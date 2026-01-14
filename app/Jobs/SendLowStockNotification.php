<?php

namespace App\Jobs;

use App\Mail\LowStockAlert;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendLowStockNotification
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public Product $product) {}

    public function handle(): void
    {
        $adminEmail = config('shop.admin_email');

        Mail::to($adminEmail)
            ->send(new LowStockAlert($this->product));
    }
}
