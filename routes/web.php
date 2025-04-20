<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {

    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('contacts', ContactController::class);
    Route::resource('accounts', AccountController::class);

    // Route::prefix('contacts')->group(function () {
    //     Route::get('/', [ContactController::class, 'index'])->name('contacts.index');
    //     Route::get('/add', [ContactController::class, 'create']);
    //     Route::post('/', [ContactController::class, 'store']);
    //     Route::get('/{contact}', [ContactController::class, 'edit']);
    //     Route::put('/{contact}', [ContactController::class, 'update']);
    //     Route::delete('/{contact}', [ContactController::class, 'destroy']);
    // });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
