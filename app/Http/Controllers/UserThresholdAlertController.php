<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserThresholdAlertAmount;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserThresholdAlertController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('settings/alert');
    }

    public function update(UpdateUserThresholdAlertAmount $request)
    {
        $alert_threshold_amount = $request->input('alert_threshold_amount');
        $danger_threshold_amount = $request->input('danger_threshold_amount');

        $user = User::find($request->user()->id);
        $user->alert_threshold_amount = $alert_threshold_amount;
        $user->danger_threshold_amount = $danger_threshold_amount;
        $user->save();

        return to_route('alert.index')->with('success', 'El monto de alerta ha sido actualizado exitosamente');
    }
}
