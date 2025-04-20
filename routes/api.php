<?php

use App\Http\Controllers\AccountProviderController;
use App\Http\Controllers\ContactController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Should I create a LoginRequest type?
Route::post('/login', function (Request $request) {
    // Get credentials from the request
    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return response()->json([
        'token' => $request->user()->createToken('api-token')->plainTextToken,
        'user' => $request->user(),
    ]);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Contact API Routes
Route::prefix('contacts')->middleware('auth:sanctum')->group(function () {
    Route::get('/', [ContactController::class, 'index']);       // /contacts
    // THIS IS CALLED ROUTE MODEL BINDING!!! PLEASE DON'T CHANGE THIS SHIT!
    Route::get('/{contact}', [ContactController::class, 'show']);    // /contacts/{id}
    Route::post('/', [ContactController::class, 'store']);
    Route::put('/{contact}', [ContactController::class, 'update']);    // /contacts/{id}
    Route::delete('/{contact}', [ContactController::class, 'destroy']);
});
