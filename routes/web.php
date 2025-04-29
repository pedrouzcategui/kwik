<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\OperationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {

    Route::get('dashboard', [AnalyticsController::class,'index'])->name('dashboard');
    Route::resource('contacts', ContactController::class);
    Route::resource('accounts', AccountController::class);
    Route::resource('operations', OperationController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
