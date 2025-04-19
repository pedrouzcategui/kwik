<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FlushAndSeed extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'custom:flush-and-seed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Drops all tables, re-migrates the database, and seeds it';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->warn('Flushing database...');
        $this->call('migrate:fresh', ['--seed' => true]);
        $this->info('Database flushed and seeded successfully! 🚀');
    }
}
