import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ShoppingBag, ShoppingCart, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';


interface Products {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
}

export default function ShopIndex() {
    const products: Products[] = [
        {
            id: 1,
            name: 'Product 1',
            price: 10,
            stock_quantity: 5,
        },
        {
            id: 2,
            name: 'Product 2',
            price: 10,
            stock_quantity: 10,
        },
        {
            id: 3,
            name: 'Product 3',
            price: 10,
            stock_quantity: 7,
        },
        {
            id: 4,
            name: 'Product 4',
            price: 10,
            stock_quantity: 5,
        },
        {
            id: 5,
            name: 'Product 5',
            price: 10,
            stock_quantity: 0,
        },
        {
            id: 6,
            name: "Product 6",
            price: 10,
            stock_quantity: 0,
        }
    ];

    const formatPrice = useCallback((value: number) => `€${value.toFixed(2)}`, []);

    return (
        <AppLayout>
            <Head title="Shop" />

            <div className="flex flex-q flex-col gap-8 p-6">
                <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
                    <div className="absolute -right-12 top-0 w-1/3 h-40 rounded-full bg-indigo-500/30 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-1/3 h-40 rounded-full -translate-x-1/3 translate-y-1/3 bg-emerald-400/20 blur-3xl" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                                <Sparkles className="w-4 h-4" />
                                Lorem Ipsum
                            </div>
                            <h1 className="max-w-3xl font-semibold md:text-4xl">
                                What is Lorem Ipsum?
                            </h1>
                            <p className="max-w-2xl text-sm text-white/70">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-4">
                            <ShoppingBag className="w-5 h-5" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Cart total</p>
                                <p className="text-lg font-semibold">{formatPrice(200)}</p>
                            </div>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70">
                                5 items
                            </span>
                            <Button
                                type="button"
                                variant="secondary"
                                className="rounded-full bg-white/15 text-white hover:bg-white/25"
                                >
                                <ShoppingCart className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semybold text-slate-900">Product list</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </p>
                        </div>
                        <Badge variant="secondary" className="flex w-fit items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            {products.length} items
                        </Badge>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {products.map((product) => {
                            const isOutOfStock = product.stock_quantity === 0;

                            return (
                                <div
                                    key={product.id}
                                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 via-white to-slate-50 text-xs uppercase tracking-[0.2em] text-slate-400">
                                        Image placeholder
                                    </div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {product.name}
                                            </p>
                                        </div>
                                        <Badge variant="outline" className="text-sm">
                                            {isOutOfStock ? 'Out of stock' : 'In stock'}
                                        </Badge>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-sm">
                                        <span className="text-lg font-semibold text-slate-900">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="text-sm text-slate-500">
                                            {product.stock_quantity} available
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            max={product.stock_quantity}
                                            value="1"
                                            className="h-9 w-14 text-center"
                                            disabled={isOutOfStock}
                                        />
                                        <Button
                                            type="button"
                                            className="flex-1"
                                            disabled={isOutOfStock}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Add to card
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            <div className="fixed inset-0 z-50">
                <div

                    className="absolute inset-0 bg-slate-900/60"
                />

                <div className="absolute right-0 top-0 flex w-full max-w-md h-full flex-col bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                        <div>
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Your cart</p>
                            <h2 className="text-lg font-semibold text-slate-900">
                                5 items selected
                            </h2>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                        <Card>
                            <CardContent className="py-6 text-sm text-slate-500">
                                Your cart is empty. Add products to get started.
                            </CardContent>
                        </Card>

                        {products.map((item) => (
                            <Card key={item.id} className="border-slate-200">
                                <CardContent className="space-y-4 py-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {formatPrice(item.price)}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="bg-red-500 hover:bg-red-700 text-white"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                min={1}
                                                max={item.stock_quantity}
                                                value="1"
                                                className="h-9 w-14 text-center"
                                            />
                                            <span className="text-xs text-slate-500">
                                                of {item.stock_quantity}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold">
                                            {formatPrice(item.price)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <div className="border-t border-slate-200 px-6 py-5">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-slate-500">
                                <span>Subtotal</span>
                                <span>{formatPrice(200)}</span>
                            </div>
                            <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                                <span>Total</span>
                                <span>{formatPrice(200)}</span>
                            </div>
                            <Button
                                className="w-full"
                            >
                                Checkout
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
