<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>Daily Sales Report</title>
</head>

<body style="color: #111827;">
    <h2 style="margin-bottom: 12px;">Daily Sales Report {{ $reportDate }}</h2>

    @if($reportRows->isEmpty())
        <p>No products were sold today</p>
    @else
        <table style="width: 100%; border-collapse: collapse; margin-top: 12px">
            <thead>
                <tr>
                    <th align="left" style="border-bottom: 1px solid #e5e7eb; padding: 8px;">Product</th>
                    <th align="left" style="border-bottom: 1px solid #e5e7eb; padding: 8px;">Quantity Sold</th>
                    <th align="left" style="border-bottom: 1px solid #e5e7eb; padding: 8px;">Revenue</th>
                </tr>
            </thead>
            <tbody>
                @foreach($reportRows as $row)
                    <tr>
                        <td style="border-bottom: 1px solid #f3f4f6; padding: 8px">{{ $row['name'] }}</td>
                        <td style="border-bottom: 1px solid #f3f4f6; padding: 8px">{{ $row['quantity'] }}</td>
                        <td style="border-bottom: 1px solid #f3f4f6; padding: 8px">{{ $row['revenue'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif
</body>
</html>
