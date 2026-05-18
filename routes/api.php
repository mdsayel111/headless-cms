<?php
use App\Http\Controllers\DynamicSchemaController;
use Illuminate\Support\Facades\Route;

// Route::middleware(['auth', 'verified'])->group(function () {
//     // Route::resource('dynamic-tables', DynamicSchemaController::class);
//     // Route::get('dynamic-tables', [DynamicSchemaController::class, 'index']);
//     // Route::get('dynamic-tables/{table}', [DynamicSchemaController::class, 'show']);
//     // Route::post('dynamic-tables/{table}', [DynamicSchemaController::class, 'store']);
//     // Route::put('dynamic-tables/{table}/{id}', [DynamicSchemaController::class, 'update']);
// });
Route::resource('dynamic-tables', DynamicSchemaController::class);
// Route::post('/dynamic-tables', function () {
//     return response()->json([
//         'success' => true
//     ]);
// });