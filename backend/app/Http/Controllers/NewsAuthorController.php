<?php

namespace App\Http\Controllers;

use App\Models\NewsAuthor;
use Illuminate\Http\Request;

class NewsAuthorController extends Controller
{
    public function index()
    {
        // Retrieve all news authors
        $authors = NewsAuthor::all();
        return response()->json($authors);
    }

    public function show($id)
    {
        // Retrieve a specific news author by ID
        $author = NewsAuthor::findOrFail($id);
        return response()->json($author);
    }

    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:50',
            'slug' => 'required|string|max:50|unique:news_authors',
            'feederId' => 'required|exists:news_feeders,id',
        ]);

        // Create a new news author using the validated data
        $author = NewsAuthor::create($validatedData);

        // Return the created news author and a 201 status code
        return response()->json($author, 201);
    }

    public function update(Request $request, $id)
    {
        // Update a specific news author by ID
        $author = NewsAuthor::findOrFail($id);

        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:50',
            'slug' => 'required|string|max:50|unique:news_authors,slug,' . $id,
            'feederId' => 'required|exists:news_feeders,id',
        ]);

        $author->update($validatedData);

        // Return the updated news author
        return response()->json($author);
    }

    public function destroy($id)
    {
        // Delete a specific news author by ID
        $author = NewsAuthor::findOrFail($id);
        $author->delete();
        return response()->json(null, 204);
    }

    /**
     * Get existing authors and create new authors
     * @param array $authors
     * @return array
     */
    public function getExistingWithNewlyCreated($authors)
    {
        if (!count($authors)) return [];

        try {

            // Collect slugs from the author list
            $authorsSlugs = array_column($authors, 'slug');

            // Get IDs of already exists author in the database
            $dbAuthors = NewsAuthor::whereIn('slug', $authorsSlugs)->pluck('id', 'slug')->toArray();

            // Map slugs and add IDs to $authors
            $authors = array_map(function ($author) use ($dbAuthors) {
                $slug = $author['slug'];
                if (array_key_exists($slug, $dbAuthors)) {
                    $author['id'] = $dbAuthors[$slug];
                }
                return $author;
            }, $authors);

            // Existing Authors
            $existingAuthors = array_values(array_filter($authors, function ($author) {
                return isset($author['id']);
            }));

            // New Authors to insert in DB
            $newAuthorsToCreate = array_values(array_filter($authors, function ($author) {
                return !isset($author['id']);
            }));

            // Insert multiple records and get insert IDs
            NewsAuthor::insertOrIgnore($newAuthorsToCreate);
            $newAuthors = NewsAuthor::latest('id')->take(count($newAuthorsToCreate))->get(['id', 'name', 'slug', 'feederId'])->toArray();

            return array_merge($existingAuthors, array_reverse($newAuthors));
        } catch (\Exception $e) {
            // Do nothing
            return [];
        }
    }
}
