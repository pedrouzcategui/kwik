<?php

namespace App\Services\ExchangeRate;

use App\Models\ExchangeRate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FawazAhmedEuroService
{
    /**
     * Fetches the amount of euros needed for one USD on a given date.
     *
     * @param string|null $date Date in 'Y-m-d' format. Defaults to today's date.
     * @return float|null Returns the exchange rate or null if unavailable.
     */
    public function fetch(): ?float
    {
        // Set default date to today if not provided
        $date = $date ?? now()->format('Y-m-d');

        $url = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{$date}/v1/currencies/usd.json";
        $response = Http::get($url);

        if ($response->status() === 404) {
            Log::warning("[FawazAhmedEuroService] Data not found (404) for date {$date}.");
            return null;
        }

        if (! $response->successful()) {
            Log::warning("[FawazAhmedEuroService] Failed to fetch data for date {$date}: HTTP " . $response->status());
            return null;
        }

        $data = $response->json();
        if (! isset($data['usd']['eur'])) {
            Log::warning("[FawazAhmedEuroService] Unexpected data format for date {$date}.");
            return null;
        }

        return (float) $data['usd']['eur'];
    }

    /**
     * Fetches the exchange rate and stores it in the database.
     *
     * @param string|null $date Date in 'Y-m-d' format. Defaults to today's date.
     * @return void
     */
    public function fetchAndStoreInDatabase(?string $date = null): void
    {
        $date = $date ?? now()->format('Y-m-d');
        $rate = $this->fetch($date);

        if ($rate === null) {
            Log::warning("[FawazAhmedEuroService] No exchange rate data available for date {$date}.");
            return;
        }

        ExchangeRate::updateOrCreate(
            [
                'currency_code' => 'EUR',
                'effective_date' => $date,
                'source_type' => 'official',
            ],
            [
                'rate_to_usd' => $rate,
                'source' => 'FawazAhmedCurrencyAPI',
            ]
        );
    }
}
