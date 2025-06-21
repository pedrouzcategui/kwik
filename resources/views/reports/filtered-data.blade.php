<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Lista de {{ $filename }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 6px; border: 1px solid #ccc; text-align: left; }
        th { background-color: #f2f2f2; }
        .page-break { page-break-after: always; }
        .table-wrapper { page-break-inside: avoid; }
    </style>
</head>
<body>
    <div style="text-align: center">
        <img src="{{ public_path('logo-transparente-rubikate.png') }}" alt="Logo" height="75px">
        <h1>Lista de {{ $filename }}</h1>
        <p>Reporte impreso el {{ $date }}</p>
    </div>

    @foreach ($rows->chunk(20) as $chunk)
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        @foreach ($headers as $key)
                            <th>{{ ucwords(str_replace('_', ' ', $key)) }}</th>
                        @endforeach
                    </tr>
                </thead>
                <tbody>
                    @foreach ($chunk as $row)
                        <tr>
                            @foreach ($headers as $key)
                                <td>{{ $row[$key] ?? '' }}</td>
                            @endforeach
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @if (!$loop->last)
            <div class="page-break"></div>
        @endif
    @endforeach

</body>
</html>
