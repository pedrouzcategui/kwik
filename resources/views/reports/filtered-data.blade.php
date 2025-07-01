<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Lista de {{ $filename }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-block: 20px }
        th, td { padding: 6px; border: 1px solid #ccc; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <div style="text-align: center">
        <img src="{{ public_path('logo-transparente-rubikate.png') }}" alt="Logo" height="75px">
        <h1>Lista de {{ $filename }}</h1>
        <p>Reporte impreso el {{ $date }} por <b>{{ $username }}</b></p>
    </div>

    <table>
        <thead>
            <tr>
                @foreach ($headers as $key)
                    <th>{{ ucwords(str_replace('_', ' ', $key)) }}</th>
                @endforeach
            </tr>
        </thead>

        <tbody>
            @foreach ($rows as $row)
                <tr>
                    @foreach ($headers as $key)
                        <td>{{ $row[$key] ?? '-' }}</td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>
    <span style="margin-top: 20px; display: block; font-style: italic">Esta aplicación se distribuye “TAL CUAL”, sin garantías de ningún tipo, expresas o implícitas -sin limitarse a garantías de comerciabilidad o idoneidad para un propósito particular—. Los autores no serán responsables de ningún daño directo, indirecto, incidental, especial o consecuente que se derive del uso, imposibilidad de uso o resultados obtenidos con esta aplicación. El uso de la app implica que el usuario asume todo riesgo y responsabilidad sobre cualquier efecto, impacto o pérdida que pudiera generarse.</span>
</body>
</html>
