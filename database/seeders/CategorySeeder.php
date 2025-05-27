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
            ['name'  => 'renta',     'color' => '#E53E3E'], // red
            ['name'  => 'comida',    'color' => '#38A169'], // green
            ['name'  => 'gasolina',  'color' => '#DD6B20'], // orange
            ['name'  => 'seguro',    'color' => '#805AD5'], // purple
            ['name'  => 'servicios', 'color' => '#3182CE'], // blue

            // Income
            ['name'  => 'salario',   'color' => '#2C7A7B'], // teal
            ['name'  => 'reembolso', 'color' => '#D69E2E'], // gold
            ['name'  => 'otros ingresos', 'color' => '#4A5568'], // gray
        ];

        foreach ($categories as $attrs) {
            Category::updateOrCreate(
                ['name'  => $attrs['name']],   // match on name
                ['color' => $attrs['color']]   // set/update color
            );
        }
    }
}
