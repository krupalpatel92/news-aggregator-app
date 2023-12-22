<?php

namespace App\Http\Controllers;

use App\Models\UserPreference;
use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    public function index()
    {
        $userPreferences = UserPreference::all();
        return response()->json(['data' => $userPreferences]);
    }

    public function show()
    {

        // Get the authenticated user's ID
        $userId = auth()->user()->id;
        $preferences = UserPreference::where("userId", $userId)->first();

        return response()->json($preferences);
    }

    public function store(Request $request)
    {
        $request->validate([
            'feed' => 'nullable',
            'notification' => 'nullable',
            'email' => 'in:everyday,twice-a-week,biweekly',
        ]);

        // Get the authenticated user's ID
        $userId = auth()->user()->id;

        $userPreference = UserPreference::create([
            'userId' => $userId, // Set the user ID
            'feed' => $request->input('feed'),
            'notification' => $request->input('notification'),
            'email' => $request->input('email'),
        ]);

        return response()->json(['data' => $userPreference], 201);
    }

    public function update(Request $request, UserPreference $userPreference)
    {
        $request->validate([
            'feed' => 'nullable',
            'notification' => 'nullable',
            'email' => 'in:everyday,twice-a-week,biweekly',
        ]);

        // Get the authenticated user's ID
        $userId = auth()->user()->id;

        // Ensure that the user ID matches before updating
        if ($userPreference->userId !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userPreference->update([
            'feed' => $request->input('feed'),
            'notification' => $request->input('notification'),
            'email' => $request->input('email'),
        ]);

        return response()->json(['data' => $userPreference]);
    }

    public function destroy(UserPreference $userPreference)
    {
        // Get the authenticated user's ID
        $userId = auth()->user()->id;

        // Ensure that the user ID matches before deleting
        if ($userPreference->userId !== $userId) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userPreference->delete();
        return response()->json(['message' => 'User preference deleted']);
    }

    public function defaultPreferences($userId)
    {
        try {
            UserPreference::insert([
                'userId' => $userId, // Set the user ID
                'feed' => json_encode(["sourcesId" => "", "categoriesId" => "", "authorsId" => ""]),
                'notification' => json_encode(["mobile" => "on", "web" => "off", "email" => "off"]),
                'email' => "everyday",
            ]);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    public function updateFeedPreferences(Request $request)
    {
        try {

            // Validate the incoming request parameters
            $request->validate([
                'categoryIds' => 'string|nullable',
                'sourceIds' => 'string|nullable',
                'authorIds' => 'string|nullable',
            ]);

            // Get the authenticated user
            $userId = $request->input("userId") ?? auth()->user()->id;

            $categoryIds = $request->input('categoryIds');
            $sourceIds = $request->input('sourceIds');
            $authorIds = $request->input('authorIds');

            $feedPreferences = json_encode([
                "categoryIds" => !is_null($categoryIds) ? $categoryIds : "",
                "sourceIds" =>  !is_null($sourceIds) ? $sourceIds : "",
                "authorIds" =>  !is_null($authorIds) ? $authorIds : "",
            ]);

            UserPreference::where('userId', $userId)->update([
                'feed' => $feedPreferences,
            ]);

            return response()->json(['message' => 'News Feed preferences updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
