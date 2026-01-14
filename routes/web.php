<?php

use App\Http\Controllers\CartItemController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
    Route::controller(CartItemController::class)->prefix('cart-items')->group(function () {
        Route::post('/', 'store')->name('cart-items.store');
        Route::patch('/{cartItem}', 'update')->name('cart-items.update');
    });
});

require __DIR__.'/settings.php';
