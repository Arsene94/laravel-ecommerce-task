<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    private const SORT_OPTIONS = [
        'name-asc' => ['name', 'asc'],
        'name-desc' => ['name', 'desc'],
        'price-asc' => ['price', 'asc'],
        'price-desc' => ['price', 'desc'],
    ];
    public function index(Request $request): Response
    {
        $sort = $request->string('sort')->toString();
        $sortConfig = self::SORT_OPTIONS[$sort] ?? self::SORT_OPTIONS['name-asc'];

        $products = Product::query()
            ->orderBy($sortConfig[0], $sortConfig[1])
            ->paginate(6, ['id', 'name', 'price', 'stock_quantity'])
            ->withQueryString();

        $cartItems = $request->user()
            ->cartItems()
            ->with('product:id,name,price,stock_quantity')
            ->get();

        $lowStockThreshold = (int) config('shop.low_stock_threshold');

        return Inertia::render('shop/index', [
            'products' => $products,
            'cartItems' => $cartItems,
            'lowStockThreshold' => $lowStockThreshold,
            'sort' => $sort,
        ]);
    }
}
