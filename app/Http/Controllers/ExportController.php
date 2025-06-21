<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class ExportController extends Controller
{
    public function export(Request $request)
    {
        $filename = $request->query('filename', 'export');
        $headers = json_decode($request->query('headers'), true);
        $data = json_decode($request->query('data'), true);
        Carbon::setLocale('es');
        $date =  Carbon::now()->translatedFormat('j \d\e F, Y - g:i A');
        return Pdf::loadView('reports.filtered-data', [
            'rows' => collect($data),
            'headers' => $headers,
            'filename' => $filename,
            'date' => $date
        ])->stream("{$filename}.pdf");
    }
}
