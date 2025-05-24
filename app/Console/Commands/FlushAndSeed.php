<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FlushAndSeed extends Command
{
    /**
     * Este es un comando custom que se ejecuta para popular la base de datos con información falsa, usando la librería "faker" de php.
     *
     * @var string
     */
    protected $signature = 'custom:flush-and-seed';

    /**
     * Este comando elimina todas las tablas, y re-ejecuta la migración con los seeders
     *
     * @var string
     */
    protected $description = 'Drops all tables, re-migrates the database, and seeds it';

    /**
     * Mensajes al ejecutar el comando
     */
    public function handle()
    {
        $this->warn('Flushing database...');
        $this->call('migrate:fresh', ['--seed' => true]);
        $this->call('custom:fetch-exchange-rates');
        $this->info('Database flushed and seeded successfully! 🚀');
    }
}
