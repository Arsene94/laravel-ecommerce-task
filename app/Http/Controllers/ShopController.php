<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->orderBy('name')
            ->get(['id', 'name', 'price', 'stock_quantity']);

        $lowStockThreshold = (int) config('shop.low_stock_threshold');

        return Inertia::render('shop/index', [
            'products' => $products,
            'lowStockThreshold' => $lowStockThreshold,
        ]);
    }
}
