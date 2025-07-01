<?php

namespace App\Http\Controllers;

use App\Models\SystemLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function users(Request $request)
    {
        $users = User::all();
        return Inertia::render('admin/users/index', [
            'users' => $users
        ]);
    }
    public function logs(Request $request)
    {
        $logs = SystemLog::with('user')   // eager-load the relation
            ->whereNotNull('user_id')   // same as "user_id != null"
            ->get();
        return Inertia::render('admin/logs/index', [
            'logs' => $logs
        ]);
    }
}
