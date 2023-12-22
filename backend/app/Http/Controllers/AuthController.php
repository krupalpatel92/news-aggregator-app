<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Controllers\UserPreferenceController;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class AuthController extends Controller
{

    private $userPreferencesCtrl;

    public function __construct()
    {
        $this->userPreferencesCtrl = new UserPreferenceController();
    }

    public function signup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => bcrypt($request->input('password')),
        ]);

        // Create default preferences on signup
        $this->userPreferencesCtrl->defaultPreferences($user->id);

        $tokenInfo = $this->getTokenInfo($user);

        return response()->json(array_merge($tokenInfo, ['user' => $user]));
    }

    public function signin(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $tokenInfo = $this->getTokenInfo($user);
            return response()->json(array_merge($tokenInfo, ['user' => $user]));
        }

        return response()->json(['error' => 'Invalid login credentials'], 401);
    }

    private function getTokenInfo($user)
    {
        // Generate a new access token
        $tokenResult = $user->createToken('UserPersonalToken');
        $token = $tokenResult->token;

        // Set the token expiration time (e.g., 1 hour from now)
        $token->expires_at = Carbon::now()->addDay(2); // Customize as needed

        // Save the token
        $token->save();

        return ["accessToken" => $tokenResult->accessToken, "expireAt" => Carbon::parse($tokenResult->token->expires_at)->toDateTimeString(), "token_type" => "Bearer"];
    }

    public function show(Request $request)
    {
        $userId = auth()->user()->id;
        $user = User::find($userId);
        return response()->json($request->user());
    }
}
