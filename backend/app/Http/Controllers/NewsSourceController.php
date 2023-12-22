<?php

namespace App\Http\Controllers;

use App\Models\NewsSource;
use Illuminate\Http\Request;

class NewsSourceController extends Controller
{
    public function index()
    {
        // Retrieve all news sources
        $sources = NewsSource::all();
        return response()->json($sources);
    }

    public function show($id)
    {
        // Retrieve a specific news source by ID
        $source = NewsSource::findOrFail($id);
        return response()->json($source);
    }

    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:50',
            'slug' => 'required|string|max:50|unique:news_sources',
            'feederId' => 'required|exists:news_feeders,id',
        ]);

        // Create a new news source using the validated data
        $source = NewsSource::create($validatedData);

        // Return the created news source and a 201 status code
        return response()->json($source, 201);
    }

    public function update(Request $request, $id)
    {
        // Update a specific news source by ID
        $source = NewsSource::findOrFail($id);

        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:50',
            'slug' => 'required|string|max:50|unique:news_sources,slug,' . $id,
            'feederId' => 'required|exists:news_feeders,id',
        ]);

        $source->update($validatedData);

        // Return the updated news source
        return response()->json($source);
    }

    public function destroy($id)
    {
        // Delete a specific news source by ID
        $source = NewsSource::findOrFail($id);
        $source->delete();
        return response()->json(null, 204);
    }


    /**
     * Get existing sources and create new sources
     * @param array $sources
     * @return array
     */
    public function getExistingWithNewlyCreated($sources)
    {

        if (!count($sources)) return [];

        try {

            // Collect slugs from the source list
            $sourcesSlugs = array_column($sources, 'slug');

            // Get IDs of already exists source in the database
            $dbSources = NewsSource::whereIn('slug', $sourcesSlugs)->pluck('id', 'slug')->toArray();

            // Map slugs and add IDs to $sources
            $sources = array_map(function ($source) use ($dbSources) {
                $slug = $source['slug'];
                if (array_key_exists($slug, $dbSources)) {
                    $source['id'] = $dbSources[$slug];
                }
                return $source;
            }, $sources);

            // Existing Sources
            $existingSource = array_values(array_filter($sources, function ($source) {
                return isset($source['id']);
            }));

            // New Sources to insert in DB
            $newSourceToCreate = array_values(array_filter($sources, function ($source) {
                return !isset($source['id']);
            }));

            // Insert multiple records and get insert IDs
            NewsSource::insertOrIgnore($newSourceToCreate);
            $newSource = NewsSource::latest('id')->take(count($newSourceToCreate))->get(['id', 'name', 'slug', 'feederId'])->toArray();

            return array_merge($existingSource, array_reverse($newSource));
        } catch (\Exception $e) {
            return [];
        }
    }
}
