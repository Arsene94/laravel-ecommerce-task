<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class DailySalesReport extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param Collection<int, array{name: string, quantity: int, revenue: string}> $reportRows
     */
    public function __construct(public Collection $collection, public string $reportDate) {}

    public function build(): self
    {
        return $this->subject('Daoly Sales Report: ' . $this->reportDate)
        ->view('emails.daily-sales-report');
    }
}
