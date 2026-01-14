import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';


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
        }
    ];

    return (
        <AppLayout>
            <Head title="Shop" />

            <div className="flex flex-q flex-col gap-8 p-6">

            </div>
        </AppLayout>
    );
}
