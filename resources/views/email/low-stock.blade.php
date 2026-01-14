<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Low stock alert</title>
</head>

<body style="color: #111827;">
    <h2 style="margin-bottom: 12px;">Low stock alert</h2>
    <p>The following product is running low on stock:</p>

    <ul>
        <li><strong>Product:</strong> {{ $product->name }}</li>
        <li><strong>Remaining Stock:</strong> {{ $product->stock_quantity }}</li>
        <li><strong>Price:</strong> €{{ number_format($product->price, 2) }}</li>
    </ul>
</body>
</html>
