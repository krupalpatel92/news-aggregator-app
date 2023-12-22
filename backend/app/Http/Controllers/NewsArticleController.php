<?php

namespace App\Http\Controllers;

use App\Models\NewsArticle;
use App\Models\UserPreference;
use Illuminate\Http\Request;
use function App\Helpers\newsArticlePublishedAt;

class NewsArticleController extends Controller
{
    public function index()
    {
        // Retrieve all news articles
        $articles = NewsArticle::all();
        return response()->json($articles);
    }

    public function show($id)
    {
        // Retrieve a specific news article by ID
        $article = NewsArticle::findOrFail($id);
        return response()->json($article);
    }

    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'catId' => 'required|exists:news_categories,id',
            'authorId' => 'required|exists:news_authors,id',
            'sourceId' => 'required|exists:news_sources,id',
            'feederId' => 'required|exists:news_feeders,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:news_articles|max:255',
            'imgUrl' => 'nullable|url',
            'URL' => 'nullable|url',
            'summary' => 'nullable|string|max:255',
            'content' => 'required|string',
            'originalRawData' => 'nullable|string',
            'publishedAt' => 'nullable|date',
        ]);

        // Create a new news article using the validated data
        $article = NewsArticle::create($validatedData);

        // Return the created news article and a 201 status code
        return response()->json($article, 201);
    }

    public function update(Request $request, $id)
    {
        // Update a specific news article by ID
        $article = NewsArticle::findOrFail($id);

        // Validate the request data
        $validatedData = $request->validate([
            'catId' => 'required|exists:news_categories,id',
            'authorId' => 'required|exists:news_authors,id',
            'sourceId' => 'required|exists:news_sources,id',
            'feederId' => 'required|exists:news_feeders,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|unique:news_articles,slug,' . $id . '|max:255',
            'imgUrl' => 'nullable|url',
            'URL' => 'nullable|url',
            'summary' => 'nullable|string|max:255',
            'content' => 'required|string',
            'originalRawData' => 'nullable|string',
            'publishedAt' => 'nullable|date',
        ]);

        $article->update($validatedData);

        // Return the updated news article
        return response()->json($article);
    }

    public function destroy($id)
    {
        // Delete a specific news article by ID
        $article = NewsArticle::findOrFail($id);
        $article->delete();
        return response()->json(null, 204);
    }

    public function createArticles($articles)
    {

        if (!is_array($articles) || empty($articles)) {
            throw new \Exception("Articles must be an array");
        }

        try {

            $articlesToCreate = array_values(array_filter($articles, function ($article) {
                return $article["authorId"] !== null && $article["sourceId"] !== null && $article["catId"] !== null && $article["feederId"] !== null;
            }));

            $articlesToCreate = array_map(function ($article) {
                return array_merge($article, [
                    "originalRawData" => json_encode($article["originalRawData"]),
                    "publishedAt" => newsArticlePublishedAt($article["publishedAt"])
                ]);
            }, $articlesToCreate);

            NewsArticle::insertOrIgnore($articlesToCreate);
            return NewsArticle::latest('id')->take(count($articlesToCreate))->get()->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    public function search(Request $request)
    {

        // When no filter is applied, use the user's feed preferences
        if (!$request->has('category') && !$request->has('source') && !$request->has('author') && !$request->has('keyword') && !$request->has('start_date') && !$request->has('end_date')) {

            $auth = auth("api");
            if ($auth->check()) {
                $userPreferences = UserPreference::where('userId', $auth->user()->id)->first(["feed"]);
                $feedPreferences = $userPreferences ? json_decode($userPreferences->feed, true) : null;

                $feedPreferences = [
                    "category" => $feedPreferences ? $feedPreferences["categoryIds"] : null,
                    "source" => $feedPreferences ? $feedPreferences["sourceIds"] : null,
                    "author" => $feedPreferences ? $feedPreferences["authorIds"] : null,
                ];

                $feedPreferences = array_filter($feedPreferences, function ($value) {
                    return $value !== null && $value !== "";
                });

                $request->merge($feedPreferences);
            }
        }

        // Start building the query
        $query = NewsArticle::query();

        // Keyword search
        if ($request->has('keyword')) {
            $keyword = $request->input('keyword');
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', "%$keyword%")
                    ->orWhere('summary', 'like', "%$keyword%")
                    ->orWhere('content', 'like', "%$keyword%");
            });
        }

        // Date range filter
        if ($request->has('start_date')) {
            $query->where('publishedAt', '>=', $request->input('start_date'));
        }

        if ($request->has('end_date')) {
            $query->where('publishedAt', '<=', $request->input('end_date'));
        }

        // Category filter
        if ($request->has('category')) {
            $query->whereIn('catId', explode(',', $request->input('category')));
        }

        // Source filter
        if ($request->has('source')) {
            $query->whereIn('sourceId', explode(',', $request->input('source')));
        }

        // Author filter
        if ($request->has('author')) {
            $query->whereIn('authorId', explode(',', $request->input('author')));
        }

        // Calculate total records count
        $totalRecords = $query->count();

        // Pagination
        $perPage = $request->input('per_page', $request->input('limit', 10));
        $page = $request->input('page', $request->input('page', 1));

        $articles = $query->with([
            'category:id,name,slug',
            'author:id,name,slug',
            'source:id,name,slug',
            'feeder:id,name',
        ])->orderBy('publishedAt', 'desc')->paginate($perPage, ['*'], 'page', $page);

        // Append total records count and related data to the response
        return response()->json([
            'meta' => [
                'current_page' => $articles->currentPage(),
                'total_pages' => $articles->lastPage(),
                'total_records' => $totalRecords,
            ],
            'filters' => $request->all(),
            'data' => $articles->items(),
        ]);
    }
}
