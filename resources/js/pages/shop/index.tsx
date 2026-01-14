import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { ShoppingBag, ShoppingCart, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { FlashMessage, SharedData } from '@/types';
import { store as storeCartItem, update as updateCartItem, destroy as destroyCartItem } from '@/routes/cart-items';
import { store as storeCheckout } from '@/routes/checkout';

interface Product {
    id: number;
    name: string;
    price: number;
    stock_quantity: number;
}

interface CartItem {
    id: number;
    quantity: number;
    product: Product
}

interface ShopPageProps extends SharedData {
    products: Product[];
    cartItems: CartItem[];
    lowStockThreshold: number;
    flash?: FlashMessage;
}

export default function ShopIndex() {
    const { products, cartItems, lowStockThreshold, flash } = usePage<ShopPageProps>().props;
    const [quantitiesOverrides, setQuantityOverrides] = useState<Record<number, number>>({});
    const [cartQuantityOverrides, setCartQuantityOverrides] = useState<Record<number, number>>({});
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartUpdateTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    useEffect(() => {
        return () => {
          Object.values(cartUpdateTimers.current).forEach((timer) => {
             clearTimeout(timer);
          });
        };
    }, []);

    const cartTotal = useMemo(() => {
        return cartItems.reduce(
            (total, item) => total + item.quantity * item.product.price, 0
        );
    }, [cartItems]);

    const quantities = useMemo(() => {
        const defaults = products.reduce<Record<number, number>>((accumulator, product) => {
            accumulator[product.id] = 1;
            return accumulator;
        }, {});

        return {
            ...defaults,
            ...quantitiesOverrides
        };
    }, [products, quantitiesOverrides]);

    const cartQuantities = useMemo(() => {
        const defaults = cartItems.reduce<Record<number, number>>((accumulator, item) => {
            accumulator[item.id] = item.quantity;
            return accumulator;
        }, {});

        Object.keys(cartQuantityOverrides).forEach((key) => {
            const itemId = Number(key);
            if (Number.isNaN(itemId) || !(itemId in defaults)) {
                return;
            }

            defaults[itemId] = cartQuantityOverrides[itemId];
        });

        return defaults;
    }, [cartItems, cartQuantityOverrides]);

    const cartItemsCount = useMemo(() => {
        return Object.values(cartQuantities).reduce((total, quantity) => total+ quantity, 0);
    }, [cartQuantities]);

    const clampQuantity = useCallback((value: number, max: number) => {
        if (Number.isNaN(value)) {
            return 1;
        }

        return Math.min(Math.max(1, value), max);
    }, []);

    const formatPrice = useCallback((value: number) => `€${value.toFixed(2)}`, []);

    const openCart = useCallback(() => setIsCartOpen(true), []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);

    const handleAddToCart = useCallback((productId: number) => {
        router.post(
            storeCartItem(),
            {
                product_id: productId,
                quantity: quantities[productId] ?? 1,
            },
            {
                preserveScroll: true,
            }
        );
        openCart();
    }, [openCart, quantities]);

    const handleQuantityChange = useCallback((productId: number, value: number, max: number) => {
        const nextValue = clampQuantity(value, max);

        setQuantityOverrides((current) => ({
            ...current,
            [productId]: nextValue,
        }));
    }, [clampQuantity]);

    const handleCartUpdate = useCallback((itemId: number, quantity: number) => {
        router.patch(
            updateCartItem({ cartItem: itemId }),
            { quantity },
            { preserveScroll: true },
        );

    }, []);

    const handleCartQuantityChange = useCallback((itemId: number, value: number, max: number) => {
        const nextValue = clampQuantity(value, max);
        setCartQuantityOverrides((current) => ({
            ...current,
            [itemId]: nextValue,
        }));

        if (cartUpdateTimers.current[itemId]) {
            clearTimeout(cartUpdateTimers.current[itemId]);
        }

        cartUpdateTimers.current[itemId] = setTimeout(() => {
            handleCartUpdate(itemId, nextValue)
        });
    }, [clampQuantity, handleCartUpdate]);

    const handleRemoveFromCart = useCallback((itemId: number) => {
        if (cartUpdateTimers.current[itemId]) {
            clearTimeout(cartUpdateTimers.current[itemId]);
        }

        router.delete(destroyCartItem({ cartItem: itemId }),
            { preserveScroll: true },
        );
    }, []);

    const handleCheckout = useCallback(() => {
        router.post(storeCheckout(), {}, { preserveScroll: true },);
    }, []);

    return (
        <AppLayout>
            <Head title="Shop" />

            <div className="flex-q flex flex-col gap-8 p-6">
                <section className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
                    <div className="absolute top-0 -right-12 h-40 w-1/3 rounded-full bg-indigo-500/30 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-40 w-1/3 -translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-400/20 blur-3xl" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs tracking-[0.2em] text-white/70 uppercase">
                                <Sparkles className="h-4 w-4" />
                                Lorem Ipsum
                            </div>
                            <h1 className="max-w-3xl font-semibold md:text-4xl">
                                What is Lorem Ipsum?
                            </h1>
                            <p className="max-w-2xl text-sm text-white/70">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry. Lorem Ipsum has been
                                the industry's standard dummy text ever since
                                the 1500s, when an unknown printer took a galley
                                of type and scrambled it to make a type specimen
                                book.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/20 bg-white/10 px-5 py-4">
                            <ShoppingBag className="h-5 w-5" />
                            <div>
                                <p className="text-xs tracking-[0.2em] text-white/60 uppercase">
                                    Cart total
                                </p>
                                <p className="text-lg font-semibold">
                                    {formatPrice(cartTotal)}
                                </p>
                            </div>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-xs tracking-[0.2em] text-white/70 uppercase">
                                {cartItemsCount} items
                            </span>
                            <Button
                                type="button"
                                variant="secondary"
                                className="rounded-full bg-white/15 text-white hover:bg-white/25"
                                onClick={openCart}
                            >
                                <ShoppingCart className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </section>

                {flash?.success && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {flash.error}
                    </div>
                )}

                <section className="space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="font-semybold text-xl text-slate-900">
                                Product list
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                            </p>
                        </div>
                        <Badge
                            variant="secondary"
                            className="flex w-fit items-center gap-2"
                        >
                            <ShoppingBag className="h-4 w-4" />
                            {products.length} items
                        </Badge>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                        {products.map((product) => {
                            const isLowStock =
                                product.stock_quantity <= lowStockThreshold;
                            const isOutOfStock = product.stock_quantity === 0;

                            return (
                                <div
                                    key={product.id}
                                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                >
                                    <div className="mb-4 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 via-white to-slate-50 text-xs tracking-[0.2em] text-slate-400 uppercase">
                                        Image placeholder
                                    </div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {product.name}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                isLowStock
                                                    ? 'destructive'
                                                    : 'outline'
                                            }
                                            className="text-sm"
                                        >
                                            {isOutOfStock
                                                ? 'Out of stock'
                                                : isLowStock
                                                  ? 'Low stock'
                                                  : 'In stock'}
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
                                            value={quantities[product.id] ?? 1}
                                            onChange={(e) =>
                                                handleQuantityChange(product.id, Number(e.target.value), product.stock_quantity)
                                            }
                                            className="h-9 w-14 text-center"
                                            disabled={isOutOfStock}
                                        />
                                        <Button
                                            type="button"
                                            className="flex-1"
                                            onClick={() =>
                                                handleAddToCart(product.id)
                                            }
                                            disabled={isOutOfStock}
                                        >
                                            <ShoppingCart className="h-4 w-4" />
                                            Add to card
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>

            {isCartOpen && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-slate-900/60"
                        onClick={closeCart}
                    />

                    <div className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <p className="text-sm tracking-[0.2em] text-slate-400 uppercase">
                                    Your cart
                                </p>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    {cartItemsCount} items selected
                                </h2>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={closeCart}
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                            {cartItemsCount === 0 && (
                                <Card>
                                    <CardContent className="py-6 text-sm text-slate-500">
                                        Your cart is empty. Add products to get started.
                                    </CardContent>
                                </Card>
                            )}

                            {cartItems.map((item) => (
                                <Card
                                    key={item.id}
                                    className="border-slate-200"
                                >
                                    <CardContent className="space-y-4 py-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {item.product.name}
                                                </p>
                                                <p className="text-sm text-slate-500">
                                                    {formatPrice(item.product.price)} each
                                                </p>
                                            </div>
                                            <Button
                                                className="bg-red-500 text-white hover:bg-red-700"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveFromCart(item.id)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={item.product.stock_quantity}
                                                    value={cartQuantities[item.id] ?? item.quantity}
                                                    onChange={(e) =>
                                                        handleCartQuantityChange(item.id, Number(e.target.value), item.product.stock_quantity)
                                                    }
                                                    className="h-9 w-14 text-center"
                                                />
                                                <span className="text-xs text-slate-500">
                                                    of {item.product.stock_quantity} available
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold">
                                                {formatPrice(item.quantity * item.product.price)}
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
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                                    <span>Total</span>
                                    <span>{formatPrice(cartTotal)}</span>
                                </div>
                                <Button
                                    className="w-full"
                                    disabled={cartItemsCount === 0}
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
