<?php

namespace App\Services\ExchangeRate;

use Illuminate\Support\Facades\Http;
use App\Models\ExchangeRate;

class PyDolarVeApiService
{
    public function fetch(): array|null
    {
        $url = 'https://pydolarve.org/api/v2/dollar';
        $response = Http::get($url);

        return $response->successful() ? $response->json() : null;
    }

    public function fetchAndStoreInDatabase(): void
    {
        $json = $this->fetch();
        if (!$json || !isset($json['monitors'])) {
            logger()->warning('[PydolarveApiService] Invalid or missing response.');
            return;
        }

        $monitors = $json['monitors'];
        $datetime = now()->toDateString();

        $sources = [
            'bcv' => 'official',
            'enparalelovzla' => 'black_market',
        ];

        foreach ($sources as $monitorKey => $sourceType) {
            if (!isset($monitors[$monitorKey]['price'])) {
                logger()->warning("Monitor '{$monitorKey}' not found in response.");
                continue;
            }

            $price = $monitors[$monitorKey]['price'];
            $title = $monitors[$monitorKey]['title'] ?? strtoupper($monitorKey);

            ExchangeRate::updateOrCreate(
                [
                    'currency_code' => 'VES',
                    'effective_date' => $datetime,
                    'source_type' => $sourceType,
                ],
                [
                    'rate_to_usd' => $price,
                    'source' => $title,
                ]
            );
        }
    }
}
