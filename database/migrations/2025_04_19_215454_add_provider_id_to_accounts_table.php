<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->uuid('account_provider_id')->nullable()->after('type');
            $table->foreign('account_provider_id')->references('id')->on('account_providers')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            $table->dropForeign(['account_provider_id']);
            $table->dropColumn('account_provider_id');
        });
    }
};
