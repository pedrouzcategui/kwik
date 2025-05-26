<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OperationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

// Todas estas rutas están protegidas por el middleware de autenticación,
// lo que significa que solo los usuarios autenticados pueden acceder a ellas.
Route::middleware(['auth'])->group(function () {
    // Este controlador resource SOLO tiene el método index, los demás métodos no funcionarán
    Route::get('dashboard', [AnalyticsController::class, 'index'])->name('dashboard');
    Route::resource('contacts', ContactController::class);
    Route::resource('accounts', AccountController::class);
    Route::resource('operations', OperationController::class);
    Route::resource('categories', CategoryController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
