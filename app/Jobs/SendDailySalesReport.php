<?php

namespace App\Jobs;

use App\Mail\DailySalesReport;
use App\Models\OrderItem;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public ?CarbonImmutable $reportDate = null) {}

    public function handle(): void
    {
        $date = $this->reportDate ?? CarbonImmutable::today();

        $orderItems = OrderItem::query()
            ->whereHas('order', function ($query) use ($date): void {
                $query->whereBetween('placed_at', [$date->startOfDay(), $date->endOfDay()]);
            })
            ->get();

        $reportRows = $orderItems
            ->groupBy('product_id')
            ->map(function ($items) {
                $quantity = $items->sum('quantity');
                $revenue = $items->sum(function ($item) {
                    return $item->quantity * $item->unit_price;
                });

                return [
                    'name' => $items->first()->product->name ?? 'Unknown',
                    'quantity' => $quantity,
                    'revenue' => number_format($revenue, 2),
                ];
            })
            ->values();

        $adminEmail = config('shop.admin_email');

        Mail::to($adminEmail)
            ->send(new DailySalesReport($reportRows, $date->toDateString()));
    }
}
