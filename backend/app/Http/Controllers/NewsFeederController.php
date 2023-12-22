<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\NewsFeeder;
use App\Http\Controllers\NewsSourceController;
use App\Http\Controllers\NewsAuthorController;
use App\Http\Controllers\NewsCategoryController;
use App\Http\Controllers\NewsArticleController;
use App\Helpers\NewsApiOrgFeedHelper;
use App\Helpers\TheGuardianFeedHelper;
use App\Helpers\TheNewYorkTimesFeedHelper;
use Error;

class NewsFeederController extends Controller
{
    private NewsSourceController $newsSourceCtrl;
    private NewsAuthorController $newsAuthorCtrl;
    private NewsCategoryController $newsCategoryCtrl;
    private NewsArticleController $newsArticleCtrl;

    public function __construct()
    {
        $this->newsSourceCtrl = new NewsSourceController();
        $this->newsAuthorCtrl = new NewsAuthorController();
        $this->newsCategoryCtrl = new NewsCategoryController();
        $this->newsArticleCtrl = new NewsArticleController();
    }

    public function index()
    {
        // Retrieve all news feeders
        $feeders = NewsFeeder::all();
        return response()->json($feeders);
    }

    public function show($id)
    {
        // Retrieve a specific news feeder by ID
        $feeder = NewsFeeder::findOrFail($id);
        return response()->json($feeder);
    }

    public function store(Request $request)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'identifier' => 'required|string|max:60|unique:news_feeders',
                'domain' => 'required|string|max:100',
                'URL' => 'required|url',
                'apiKey' => 'required|string|max:100',
            ]);

            $feeder = NewsFeeder::create($validatedData);
            return response()->json($feeder, 201);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function update(Request $request, $id)
    {
        // Update a specific news feeder by ID
        $feeder = NewsFeeder::findOrFail($id);
        $feeder->update($request->all());
        return response()->json($feeder);
    }

    public function destroy($id)
    {
        // Delete a specific news feeder by ID
        $feeder = NewsFeeder::findOrFail($id);
        $feeder->delete();
        return response()->json(null, 204);
    }

    /**
     * Update DB by getting the latest news from a specific feeder by ID.
     *
     * @param  int  $identifier
     * @return \Illuminate\Http\Response
     */
    public function syncFeed(Request $request)
    {

        $identifier = $request->query('feeder');
        if (!$identifier) return response()->json(['error' => 'Bad Request', 'message' => 'The \'identifier\' query param is missing'], 400);

        $feeder = NewsFeeder::where('identifier', $identifier)->first();
        if (!$feeder) return response()->json(['error' => 'feeder not found'], 404);

        // Get the latest right helper for the feeder
        $newsFeedHelper = $this->getNewsFeedHelper($feeder, $request->query('query'), $request->query('perPage'), $request->query('page'));
        if (isset($newsFeedHelper->error)) return response()->json(['error' => $newsFeedHelper->error], 404);

        try {
            // Get the latest news from the feeder's API endpoint
            $news = $newsFeedHelper->getFeed();
        } catch (\Exception $e) {
            return response()->json(["error" => "Having some error in fetching latest news feed from the feeder: " . $feeder->name . "."], 500);
        }

        try {
            // Create new categories, authors, sources and articles
            $newsSources = $this->newsSourceCtrl->getExistingWithNewlyCreated($news["sources"]);
            $newsAuthors = $this->newsAuthorCtrl->getExistingWithNewlyCreated($news["authors"]);
            $newsCategory = $this->newsCategoryCtrl->getExistingWithNewlyCreated($news["categories"]);

            // Store database IDs of source, author, and category into article before creating article in DB 
            $newsArticles = $newsFeedHelper->makeRelationsWithArticle($news["articles"], $newsSources, $newsAuthors, $newsCategory);

            // Create new articles
            $newsArticles = $this->newsArticleCtrl->createArticles($newsArticles);
        } catch (\Exception $e) {
            return response()->json(["error" => "Having error while creating News Authors, Sources, Categories, and article into DB"], 500);
        }

        return response()->json($newsArticles, 200);
    }

    /**
     * Get the right helper for the feeder
     */
    private function getNewsFeedHelper($feederInfo, $query = null, $perPage = null, $page = null)
    {
        $feedIdentifier = $feederInfo->identifier;
        $newsApiOrgHelper = new NewsApiOrgFeedHelper($feederInfo, $query, $perPage, $page);
        $theGuardianNewsHelper = new TheGuardianFeedHelper($feederInfo, $query, $perPage, $page);
        $theNyTimesNewsHelper = new TheNewYorkTimesFeedHelper($feederInfo, $query, $perPage, $page);

        switch ($feedIdentifier) {
            case $newsApiOrgHelper->identifier:
                return $newsApiOrgHelper;
                break;
            case $theGuardianNewsHelper->identifier:
                return $theGuardianNewsHelper;
                break;
            case $theNyTimesNewsHelper->identifier:
                return $theNyTimesNewsHelper;
                break;
            default:
                return (object) ["error" => "Feed helper not found for " . $feederInfo->name];
        }
    }
}
