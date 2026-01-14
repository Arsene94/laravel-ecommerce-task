<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class CartItemController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($validated['product_id']);
        $cartItem = CartItem::query()->findOrNew([
            'user_id' => $request->user()->id,
            'product_id' => $product->id,
        ]);

        $newQuantity = ($cartItem->exists ? $cartItem->quantity : 0) + $validated['quantity'];

        if ($newQuantity > $product->stock_quantity) {
            throw ValidationException::withMessages([
                'quantity' => 'Only '.$product->stock_quantity.' left in stock!',
            ]);
        }

        $cartItem->quantity = $newQuantity;
        $cartItem->save();

        return back()->with('success', 'Item added to cart!');
    }
}
