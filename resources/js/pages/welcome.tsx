import { login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const isAuthenticated = Boolean(auth.user);
    const featuredProducts = [
        {
            name: 'Canvas Tote Bag',
            description: 'Lightweight carryall with reinforced handles.',
            price: '$24.00',
        },
        {
            name: 'Ceramic Coffee Mug',
            description: 'Matte glaze finish with a 12oz pour.',
            price: '$16.50',
        },
        {
            name: 'Wireless Charger Pad',
            description: 'Slim profile with fast-charge alignment.',
            price: '$38.00',
        },
        {
            name: 'Minimalist Notebook',
            description: 'Dot-grid pages for focused planning.',
            price: '$12.00',
        },
    ];

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-slate-950 text-white">
                <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
                    <div className="flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-slate-200 uppercase">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                            <ShoppingBag className="h-4 w-4" />
                        </span>
                        Lorem Ipsum
                    </div>
                    <nav className="flex items-center gap-3 text-sm">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/shop"
                                    className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                                >
                                    Shop
                                </Link>
                                <Link
                                    href="/shop"
                                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
                                >
                                    Your cart
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition hover:border-white/40"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                                    >
                                        Get started
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="mx-auto w-full max-w-6xl px-6 pb-20">
                    <section className="grid gap-10 pt-8 lg:grid-cols-[1.1fr,0.9fr] lg:items-center">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs tracking-[0.2em] text-slate-200 uppercase">
                                <Sparkles className="h-4 w-4" />
                                Modern commerce experience
                            </div>
                            <h1 className="text-4xl leading-tight font-semibold md:text-5xl">
                                What is Lorem Ipsum?
                            </h1>
                            <p className="max-w-xl text-base text-slate-300">
                                Lorem Ipsum is simply dummy text of the printing
                                and typesetting industry.
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                                <Link
                                    href={
                                        isAuthenticated ? '/shop' : register()
                                    }
                                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                                >
                                    {isAuthenticated
                                        ? 'Start shopping'
                                        : 'Create an account'}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={isAuthenticated ? '/shop' : login()}
                                    className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                                >
                                    {isAuthenticated
                                        ? 'View your cart'
                                        : 'Sign in'}
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="mt-16 grid gap-6 md:grid-cols-3">
                        {[
                            {
                                title: 'User-first cart',
                                description:
                                    'Every cart is tied to the authenticated user, so items follow them across sessions and devices.',
                            },
                            {
                                title: 'Inventory aware',
                                description:
                                    'Stock levels update instantly after checkout, with queued low-stock notifications to admins.',
                            },
                            {
                                title: 'Daily sales reports',
                                description:
                                    'A scheduled job compiles each day’s sales totals and emails a digest every evening.',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-white/10 bg-white/5 p-6"
                            >
                                <div className="flex items-center gap-2 text-sm font-semibold">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                                    {feature.title}
                                </div>
                                <p className="mt-3 text-sm text-slate-300">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 px-8 py-10">
                        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold">
                                    Ready to explore the storefront?
                                </h2>
                                <p className="mt-2 max-w-xl text-sm text-slate-300">
                                    Authenticate to add items, adjust
                                    quantities, and experience the full shopping
                                    cart flow built with Laravel, Inertia, and
                                    Tailwind.
                                </p>
                            </div>
                            <Link
                                href={isAuthenticated ? '/shop' : register()}
                                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                            >
                                {isAuthenticated
                                    ? 'Visit the shop'
                                    : 'Create your account'}
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
