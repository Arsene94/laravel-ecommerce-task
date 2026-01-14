<?php

namespace App\Mail;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class LowStockAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Product $product) {}

    public function build(): self
    {
        return $this->subject('Low Stock Alert: '.$this->product->name)
            ->view('email.low-stock');
    }
}
