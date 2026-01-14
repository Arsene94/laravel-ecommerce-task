<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return back()->withErrors(['Your cart is empty!']);
        }

        DB::transaction(function () use ($cartItems, $user): void {
            $order = Order::create([
                'user_id' => $user->id,
                'total' => 0,
                'placed_at' => now(),
            ]);

            $total = 0;

            foreach ($cartItems as $cartItem) {
                $product = Product::query()
                    ->lockForUpdate()
                    ->findOrFail($cartItem->product_id);

                if ($product->stock_quantity < $cartItem->quantity) {
                    throw ValidationException::withMessages([
                        'quantity' => 'Not enough stock for '.$product->name.'!',
                    ]);
                }

                $product->decrement('stock_quantity', $cartItem->quantity);

                $order->items()->create([
                    'product_id' => $product->product_id,
                    'quantity' => $product->quantity,
                    'unit_price' => $product->product->price,
                ]);

                $total += $cartItem->quantity * $product->price;

                $lowStockThreshold = (int) config('shop.low_stock_threshold');

                if ($product->stock_quantity <= $lowStockThreshold) {
                    // TODO: create low stock notification
                }
            }

            $order->update(['total' => $total]);
            $user->cartItems()->delete();
        });

        return back()->with('success', 'Order placed successfully!');
    }
}
