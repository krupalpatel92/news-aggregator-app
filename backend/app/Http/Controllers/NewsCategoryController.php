<?php

namespace App\Http\Controllers;

use App\Models\NewsCategory;
use Illuminate\Http\Request;

class NewsCategoryController extends Controller
{
    public function index()
    {
        // Retrieve all news categories
        $categories = NewsCategory::all();
        return response()->json($categories);
    }

    public function show($id)
    {
        // Retrieve a specific news category by ID
        $category = NewsCategory::findOrFail($id);
        return response()->json($category);
    }

    public function store(Request $request)
    {
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:120|unique:news_categories',
            'parentId' => 'nullable|integer',
            'feederId' => 'required|exists:news_feeders,id',
        ]);

        // Create a new news category using the validated data
        $category = NewsCategory::create($validatedData);

        // Return the created news category and a 201 status code
        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        // Update a specific news category by ID
        $category = NewsCategory::findOrFail($id);

        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'required|string|max:120|unique:news_categories,slug,' . $id,
            'parentId' => 'nullable|integer',
            'feederId' => 'required|exists:news_feeders,id',
        ]);

        $category->update($validatedData);

        // Return the updated news category
        return response()->json($category);
    }

    public function destroy($id)
    {
        // Delete a specific news category by ID
        $category = NewsCategory::findOrFail($id);
        $category->delete();
        return response()->json(null, 204);
    }

    /**
     * Get existing categories and create new category if not exists
     * @param array $categories
     * @return array
     */
    public function getExistingWithNewlyCreated($categories)
    {
        if (!count($categories)) return [];

        try {

            // Collect slugs from the category list
            $categoriesSlugs = array_column($categories, 'slug');

            // Get IDs of already exists category in the database
            $dbCategories = NewsCategory::whereIn('slug', $categoriesSlugs)->pluck('id', 'slug')->toArray();

            // Map slugs and add IDs to $categories
            $categories = array_map(function ($category) use ($dbCategories) {
                $slug = $category['slug'];
                if (array_key_exists($slug, $dbCategories)) {
                    $category['id'] = $dbCategories[$slug];
                }
                return $category;
            }, $categories);

            // Existing Categories
            $existingCategories = array_values(array_filter($categories, function ($category) {
                return isset($category['id']);
            }));

            // New Categories to insert in DB
            $newCategoriesToCreate = array_values(array_filter($categories, function ($category) {
                return !isset($category['id']);
            }));

            // Insert multiple records and get insert IDs
            NewsCategory::insertOrIgnore($newCategoriesToCreate);
            $newCategories = NewsCategory::latest('id')->take(count($newCategoriesToCreate))->get(['id', 'name', 'slug', 'feederId'])->toArray();

            return array_merge($existingCategories, array_reverse($newCategories));
        } catch (\Exception $e) {
            return [];
        }
    }
}
