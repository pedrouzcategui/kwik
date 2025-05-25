<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\ExchangeRate\PyDolarVeApiService;
use App\Services\ExchangeRate\FawazAhmedEuroService;

class FetchExchangeRates extends Command
{
    protected $signature = 'custom:fetch-exchange-rates';
    protected $description = 'Fetch and store exchange rates from multiple APIs';

    public function handle()
    {
        $this->info("Fetching and storing exchange rates...");
        $service = new PyDolarVeApiService();
        $service->fetchAndStoreInDatabase();
        $this->info("Done! USD Exchange rate stored in database.");
        $this->info("Fetching and storing Euro exchange rates...");
        $euroService = new FawazAhmedEuroService();
        $euroService->fetchAndStoreInDatabase();
        $this->info("Done! Euro Exchange rate stored in database.");
        return 0;
    }
}
