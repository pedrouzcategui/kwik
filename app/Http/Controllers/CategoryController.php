<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class CategoryController extends Controller
{
    /**
     * Muestra una lista de las categorías.
     */
    public function index()
    {
        //
    }

    /**
     * Muestra el formulario para crear una nueva categoría.
     */
    public function create()
    {
        //
    }

    /**
     * Almacena una nueva categoría en la base de datos.
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = new Category($request->validated());
        $category->save();

        return response()->json($category); // ✅ esto retorna el ID, nombre, etc.
    }

    /**
     * Muestra la categoría especificada.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Muestra el formulario para editar la categoría especificada.
     */
    public function edit(Category $category)
    {
        //
    }

    /**
     * Actualiza la categoría especificada en la base de datos.
     */
    public function update(Request $request, Category $category)
    {
        //
    }

    /**
     * Elimina la categoría especificada de la base de datos.
     */
    public function destroy(Category $category)
    {
        //
    }
}
