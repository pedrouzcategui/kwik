<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('exchange_rates', function (Blueprint $table) {
            $table->id();
            $table->char('currency_code', 3);
            $table->decimal('rate_to_usd', 18, 6); // How many of this currency is equal to 1 USD
            $table->date('effective_date');
            $table->enum('source_type', ['official', 'black_market'])->default('official');
            $table->string('source')->nullable();
            $table->timestamps();
            $table->unique(['currency_code', 'effective_date', 'source_type']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('exchange_rates');
    }
};
