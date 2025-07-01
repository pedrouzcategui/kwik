<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

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
            'date' => $date,
        ])->stream("{$filename}.pdf");
    }

    public function initiate(Request $request)
    {
        $token = Str::uuid()->toString();

        cache()->put("pdf_export_{$token}", [
            'data' => $request->input('data'),
            'headers' => $request->input('headers'),
            'filename' => $request->input('filename') ?? 'export',
            'date' => now()->locale('es')->translatedFormat('j \d\e F, Y - g:i A'),
        ], now()->addMinutes(5)); // valid for 5 min

        return response()->json(['token' => $token]);
    }

    public function download(Request $request)
    {
        $token = $request->query('token');
        $payload = cache()->pull("pdf_export_{$token}");

        if (!$payload) {
            abort(404, 'Export data not found or expired');
        }

        $user = Auth::user()->name;

        return Pdf::loadView('reports.filtered-data', [
            'rows' => collect($payload['data']),
            'headers' => $payload['headers'],
            'filename' => $payload['filename'],
            'date' => $payload['date'],
            'username' => $user
        ])->stream("{$payload['filename']}.pdf");
    }
}
