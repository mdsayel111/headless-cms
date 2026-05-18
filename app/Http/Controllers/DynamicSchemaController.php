<?php

namespace App\Http\Controllers;

use App\Models\DynamicField;
use App\Models\DynamicTable;
use Illuminate\Http\Request;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Log;

class DynamicSchemaController extends Controller
{
    protected array $mysqlTypes = [
        'string',
        'char',
        'text',
        'mediumText',
        'longText',
        'integer',
        'bigInteger',
        'tinyInteger',
        'smallInteger',
        'mediumInteger',
        'unsignedBigInteger',
        'float',
        'double',
        'decimal',
        'boolean',
        'date',
        'dateTime',
        'timestamp',
        'time',
        'year',
        'json',
        'uuid',
        'binary',
        'enum'
    ];

    public function store(Request $request)
    {
        $request->validate([
            'table_name' => 'required|string|unique:dynamic_tables,table_name',
            'fields' => 'required|array'
        ]);

        $tableName = $request->table_name;
        $fields = $request->fields;

        if (Schema::hasTable($tableName)) {
            return response()->json([
                'message' => 'Table already exists'
            ], 400);
        }

        DB::beginTransaction();

        try {

            $dynamicTable = DynamicTable::create([
                'table_name' => $tableName,
                'user_id' => auth()->user()->id
            ]);

            Schema::create($tableName, function (Blueprint $table) use ($fields, $dynamicTable) {

                $table->id();

                foreach ($fields as $field) {

                    $fieldName = $field['name'];
                    $fieldType = $field['type'];

                    if (!in_array($fieldType, $this->mysqlTypes)) {
                        throw new \Exception("Invalid field type: {$fieldType}");
                    }

                    $column = null;

                    switch ($fieldType) {

                        case 'string':
                            $column = $table->string($fieldName);
                            break;

                        case 'char':
                            $column = $table->char($fieldName);
                            break;

                        case 'text':
                            $column = $table->text($fieldName);
                            break;

                        case 'mediumText':
                            $column = $table->mediumText($fieldName);
                            break;

                        case 'longText':
                            $column = $table->longText($fieldName);
                            break;

                        case 'integer':
                            $column = $table->integer($fieldName);
                            break;

                        case 'bigInteger':
                            $column = $table->bigInteger($fieldName);
                            break;

                        case 'tinyInteger':
                            $column = $table->tinyInteger($fieldName);
                            break;

                        case 'smallInteger':
                            $column = $table->smallInteger($fieldName);
                            break;

                        case 'mediumInteger':
                            $column = $table->mediumInteger($fieldName);
                            break;

                        case 'unsignedBigInteger':
                            $column = $table->unsignedBigInteger($fieldName);
                            break;

                        case 'float':
                            $column = $table->float($fieldName);
                            break;

                        case 'double':
                            $column = $table->double($fieldName);
                            break;

                        case 'decimal':
                            $column = $table->decimal($fieldName, 10, 2);
                            break;

                        case 'boolean':
                            $column = $table->boolean($fieldName);
                            break;

                        case 'date':
                            $column = $table->date($fieldName);
                            break;

                        case 'dateTime':
                            $column = $table->dateTime($fieldName);
                            break;

                        case 'timestamp':
                            $column = $table->timestamp($fieldName);
                            break;

                        case 'time':
                            $column = $table->time($fieldName);
                            break;

                        case 'year':
                            $column = $table->year($fieldName);
                            break;

                        case 'json':
                            $column = $table->json($fieldName);
                            break;

                        case 'uuid':
                            $column = $table->uuid($fieldName);
                            break;

                        case 'binary':
                            $column = $table->binary($fieldName);
                            break;

                        case 'enum':
                            $column = $table->enum($fieldName, $field['values'] ?? ['default']);
                            break;
                    }

                    if (!empty($field['nullable'])) {
                        $column->nullable();
                    }

                    if (!empty($field['unique'])) {
                        $column->unique();
                    }

                    if (isset($field['default'])) {
                        $column->default($field['default']);
                    }

                    if (!empty($field['index'])) {
                        $column->index();
                    }

                    // RELATIONSHIP
                    if (!empty($field['relationship'])) {

                        $relationship = $field['relationship'];

                        if ($relationship['type'] === 'belongsTo') {

                            $table->foreign($fieldName)
                                ->references($relationship['related_field'])
                                ->on($relationship['related_table'])
                                ->onDelete('cascade');
                        }
                    }

                    DynamicField::create([
                        'dynamic_table_id' => $dynamicTable->id,
                        'field_name' => $fieldName,
                        'field_type' => $fieldType,
                        'nullable' => $field['nullable'] ?? false,
                        'unique' => $field['unique'] ?? false,
                        'value' => $field['value'] ?? $field['default'] ?? null,
                        'relationship_type' => $field['relationship']['type'] ?? null,
                        'related_table' => $field['relationship']['related_table'] ?? null,
                        'related_field' => $field['relationship']['related_field'] ?? null,
                    ]);
                }

                $table->timestamps();
            });

            DB::commit();

            return response()->json([
                'message' => 'Dynamic table created successfully'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        $data = DynamicTable::with('fields')->paginate(10);
        // if (!Schema::hasTable($table)) {
        //     return response()->json([
        //         'message' => 'Table not found'
        //     ], 404);
        // }

        // $data = DB::table($table)
        //     ->latest()
        //     ->paginate(10);

        return Inertia::render('dynamic-table/Index', [
            'data' => $data
        ]);
        // return response()->json($data->toArray());
    }

    /**
     * GET SINGLE DATA
     */
    public function show($table, $id)
    {
        if (!Schema::hasTable($table)) {
            return response()->json([
                'message' => 'Table not found'
            ], 404);
        }

        $item = DB::table($table)
            ->where('id', $id)
            ->first();

        if (!$item) {
            return response()->json([
                'message' => 'Data not found'
            ], 404);
        }

        return response()->json($item);
    }

    public function update(Request $request, $table, $id)
    {
        if (!Schema::hasTable($table)) {
            return response()->json([
                'message' => 'Table not found'
            ], 404);
        }

        $exists = DB::table($table)
            ->where('id', $id)
            ->exists();

        if (!$exists) {
            return response()->json([
                'message' => 'Data not found'
            ], 404);
        }

        $data = $request->except([
            '_token',
            '_method'
        ]);

        DB::table($table)
            ->where('id', $id)
            ->update($data);

        return response()->json([
            'message' => 'Updated successfully'
        ]);
    }

    public function destroy($table, $id)
    {
        if (!Schema::hasTable($table)) {
            return response()->json([
                'message' => 'Table not found'
            ], 404);
        }

        $exists = DB::table($table)
            ->where('id', $id)
            ->exists();

        if (!$exists) {
            return response()->json([
                'message' => 'Data not found'
            ], 404);
        }

        DB::table($table)
            ->where('id', $id)
            ->delete();

        return response()->json([
            'message' => 'Deleted successfully'
        ]);
    }
}