<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Expenses
            ['name'  => 'renta',     'color' => '#E53E3E', 'type' => 'EXPENSE'], // red
            ['name'  => 'comida',    'color' => '#38A169', 'type' => 'EXPENSE'], // green
            ['name'  => 'gasolina',  'color' => '#DD6B20', 'type' => 'EXPENSE'], // orange
            ['name'  => 'seguro',    'color' => '#805AD5', 'type' => 'EXPENSE'], // purple
            ['name'  => 'servicios', 'color' => '#3182CE', 'type' => 'EXPENSE'], // blue

            // Income
            ['name'  => 'salario',   'color' => '#2C7A7B', 'type' => 'INCOME'], // teal
            ['name'  => 'reembolso', 'color' => '#D69E2E', 'type' => 'INCOME'], // gold
            ['name'  => 'otros ingresos', 'color' => '#4A5568', 'type' => 'INCOME'], // gray
        ];

        Category::upsert($categories, ['name'], ['color', 'type']);
    }
}
