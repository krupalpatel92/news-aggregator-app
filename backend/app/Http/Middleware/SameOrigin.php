<?php

namespace App\Http\Middleware;

use Closure;

class SameOrigin
{
    public function handle($request, Closure $next)
    {
        $allowedOrigin = config('app.url');

        if ($request->header('Origin') !== $allowedOrigin) {
            return response()->json(['error' => 'Not allowed by different origin'], 403);
        }

        return $next($request);
    }
}
