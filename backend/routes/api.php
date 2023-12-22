<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NewsFeederController;
use App\Http\Controllers\NewsCategoryController;
use App\Http\Controllers\NewsAuthorController;
use App\Http\Controllers\NewsSourceController;
use App\Http\Controllers\NewsArticleController;
use App\Http\Controllers\UserPreferenceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('auth')->group(function () {
   Route::post('/signup', [AuthController::class, 'signup']);
   Route::post('/signin', [AuthController::class, 'signin']);
});


// User Routes
Route::middleware('auth:api')->group(function () {
   // Route::get('user/preferences', [UserPreferenceController::class, 'index']);
   Route::get('user/me/profile', [AuthController::class, 'show']);

   /* User Preferences routes */
   Route::get('user/me/preferences', [UserPreferenceController::class, 'show']);
   // Route::post('user/me/preferences', [UserPreferenceController::class, 'store']);

   // Route::delete('/', [UserPreferenceController::class, 'destroy']);

   // Update News Feed Preferences
   Route::post('user/{userId}/preferences/feed', [UserPreferenceController::class, 'updateFeedPreferences']);
   Route::post('user/me/preferences/feed', [UserPreferenceController::class, 'updateFeedPreferences']);
});

// News Feeder Routes
Route::prefix('news/feeders')->group(function () {
   // Route::get('/', [NewsFeederController::class, 'index']);
   // Route::get('/{id}', [NewsFeederController::class, 'show']);
   // Route::post('/', [NewsFeederController::class, 'store']);
   // Route::put('/{id}', [NewsFeederController::class, 'update']);
   // Route::delete('/{id}', [NewsFeederController::class, 'destroy']);

   /* same.origin: This middleware for prevent this to be exposed in public. */
   Route::get('/sync-feed', [NewsFeederController::class, 'syncFeed'])->middleware('same.origin');
});

// News Category Routes
Route::prefix('news/categories')->group(function () {
   Route::get('/', [NewsCategoryController::class, 'index']);
   // Route::get('/{id}', [NewsCategoryController::class, 'show']);
   // Route::post('/', [NewsCategoryController::class, 'store']);
   // Route::put('/{id}', [NewsCategoryController::class, 'update']);
   // Route::delete('/{id}', [NewsCategoryController::class, 'destroy']);
});

// News Author Routes
Route::prefix('news/authors')->group(function () {
   Route::get('/', [NewsAuthorController::class, 'index']);
   // Route::get('/{id}', [NewsAuthorController::class, 'show']);
   // Route::post('/', [NewsAuthorController::class, 'store']);
   // Route::put('/{id}', [NewsAuthorController::class, 'update']);
   // Route::delete('/{id}', [NewsAuthorController::class, 'destroy']);
});

// News Source Routes
Route::prefix('news/sources')->group(function () {
   Route::get('/', [NewsSourceController::class, 'index']);
   // Route::get('/{id}', [NewsSourceController::class, 'show']);
   // Route::post('/', [NewsSourceController::class, 'store']);
   // Route::put('/{id}', [NewsSourceController::class, 'update']);
   // Route::delete('/{id}', [NewsSourceController::class, 'destroy']);
});


// News Article Routes
Route::prefix('news/articles')->group(function () {
   // Route::get('/', [NewsArticleController::class, 'index']);
   // Route::get('/{id}', [NewsArticleController::class, 'show']);
   // Route::post('/', [NewsArticleController::class, 'store']);
   // Route::put('/{id}', [NewsArticleController::class, 'update']);
   // Route::delete('/{id}', [NewsArticleController::class, 'destroy']);
   Route::get('/search', [NewsArticleController::class, 'search']);
});

// News Category Routes
Route::prefix('news/categories')->group(function () {
   Route::get('/', [NewsCategoryController::class, 'index']);
   // Route::get('/{id}', [NewsCategoryController::class, 'show']);
   // Route::post('/', [NewsCategoryController::class, 'store']);
   // Route::put('/{id}', [NewsCategoryController::class, 'update']);
   // Route::delete('/{id}', [NewsCategoryController::class, 'destroy']);
});
