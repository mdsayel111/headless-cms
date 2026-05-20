<?php

namespace App\Http\Controllers;

use App\Models\DynamicTableFieldMeta;
use App\Models\DynamicTableMeta;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

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
        'enum',
        'foreignId'
    ];

    public function store(Request $request)
    {
        $user = auth()->user();
        $request->validate([
            'project_id' => 'required|integer',
            'table_name' => 'required|string',
            'fields' => 'required|array'
        ]);


        $tableName = $request->table_name . '-' . $user->id;
        $fields = $request->fields;

        if (Schema::hasTable($tableName)) {
            return response()->json([
                'message' => 'Table already exists'
            ], 400);
        }

        try {

            Schema::create($tableName, function (Blueprint $table) use ($fields) {

                $table->id();
                $table->foreignId('project_id')
                    ->constrained('projects')
                    ->references('id')
                    ->onDelete('cascade');

                foreach ($fields as $field) {

                    $fieldType = $field['type'];

                    if (!in_array($fieldType, $this->mysqlTypes)) {
                        throw new \Exception("Invalid field type: {$fieldType}");
                    }

                    $column = null;

                    switch ($fieldType) {

                        case 'string':
                            $column = $table->string($field['name']);
                            break;

                        case 'char':
                            $column = $table->char($field['name']);
                            break;

                        case 'text':
                            $column = $table->text($field['name']);
                            break;

                        case 'mediumText':
                            $column = $table->mediumText($field['name']);
                            break;

                        case 'longText':
                            $column = $table->longText($field['name']);
                            break;

                        case 'integer':
                            $column = $table->integer($field['name']);
                            break;

                        case 'bigInteger':
                            $column = $table->bigInteger($field['name']);
                            break;

                        case 'tinyInteger':
                            $column = $table->tinyInteger($field['name']);
                            break;

                        case 'smallInteger':
                            $column = $table->smallInteger($field['name']);
                            break;

                        case 'mediumInteger':
                            $column = $table->mediumInteger($field['name']);
                            break;

                        case 'unsignedBigInteger':
                            $column = $table->unsignedBigInteger($field['name']);
                            break;

                        case 'float':
                            $column = $table->float($field['name']);
                            break;

                        case 'double':
                            $column = $table->double($field['name']);
                            break;

                        case 'decimal':
                            $column = $table->decimal($field['name'], 10, 2);
                            break;

                        case 'boolean':
                            $column = $table->boolean($field['name']);
                            break;

                        case 'date':
                            $column = $table->date($field['name']);
                            break;

                        case 'dateTime':
                            $column = $table->dateTime($field['name']);
                            break;

                        case 'timestamp':
                            $column = $table->timestamp($field['name']);
                            break;

                        case 'time':
                            $column = $table->time($field['name']);
                            break;

                        case 'year':
                            $column = $table->year($field['name']);
                            break;

                        case 'json':
                            $column = $table->json($field['name']);
                            break;

                        case 'uuid':
                            $column = $table->uuid($field['name']);
                            break;

                        case 'binary':
                            $column = $table->binary($field['name']);
                            break;

                        case 'enum':
                            $column = $table->enum($field['name'], $field['values'] ?? ['default']);
                            break;
                        case 'foreignId':
                            $column = $table->foreignId($field['name']);
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
                    if (!empty($field['relation'])) {
                        $relationship = $field['relation'];
                        $table->foreign($field['name'])
                            ->references($relationship['column'])
                            ->on($relationship['table'])
                            ->onDelete('cascade');
                    }
                }

                $table->timestamps();
            });

            DB::beginTransaction();
            $dynamic_table = DynamicTableMeta::create([
                'project_id' => $request->project_id,
                'table_name' => $tableName,
            ]);
            Log::info($dynamic_table);
            foreach ($fields as $field) {
                DynamicTableFieldMeta::create([
                    'dynamic_table_id' => $dynamic_table->id,
                    'field_name' => $field['name'],
                    'field_type' => $field['type'],
                    'relation_type' => $field['relation']['type'] ?? null,
                    'related_table' => $field['relation']['table'] ?? null,
                    'related_field' => $field['relation']['column'] ?? null,
                    'nullable' => $field['nullable'] ?? false,
                    'unique' => $field['unique'] ?? false,
                ]);
            }
            DB::commit();

            return redirect()->back();

        } catch (\Exception $e) {
            DB::rollBack();
            if (Schema::hasTable($tableName)) {
                Schema::drop($tableName);
            }
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function index(Request $request)
    {
        $projectId = $request->project;

        $search = $request->search;

        $userId = auth()->id();

        $perPage = 10;

        $currentPage = LengthAwarePaginator::resolveCurrentPage();

        $tables = DB::select("SHOW TABLES");

        // dump($tables);
        $result = [];

        $id = 1;

        foreach ($tables as $table) {


            // GET TABLE NAME
            $tableName = array_values((array) $table)[0];

            // ONLY USER TABLES
            if (!str_ends_with($tableName, '-' . $userId)) {
                continue;
            }

            // REMOVE USER ID SUFFIX
            $cleanTableName = str_replace(
                '-' . $userId,
                '',
                $tableName
            );

            // SKIP SYSTEM TABLES
            if (
                in_array($cleanTableName, [
                    'projects',
                    'users',
                    'migrations'
                ])
            ) {
                continue;
            }

            // APPLY SEARCH
            if (
                $search &&
                !str_contains(
                    strtolower($cleanTableName),
                    strtolower($search)
                )
            ) {
                continue;
            }

            // CHECK project_id COLUMN EXISTS
            if (Schema::hasColumn($tableName, 'project_id')) {

                // CHECK PROJECT EXISTS
                $exists = DB::table($tableName)
                    ->where('project_id', $projectId)
                    ->exists();

                if ($exists) {

                    // TOTAL FIELDS
                    $totalFields = count(
                        Schema::getColumnListing($tableName)
                    );

                    // TOTAL RECORDS
                    $totalRecords = DB::table($tableName)
                        ->where('project_id', $projectId)
                        ->count();

                    $result[] = [
                        'id' => $id++,
                        'name' => $cleanTableName,
                        'fields' => Schema::getColumnListing($tableName),
                        'total_field' => $totalFields,
                        'total_record' => $totalRecords
                    ];
                }
            }
        }

        // COLLECTION
        $collection = collect($result);

        // PAGINATION
        $paginated = new LengthAwarePaginator(
            $collection->forPage($currentPage, $perPage),
            $collection->count(),
            $perPage,
            $currentPage,
            [
                'path' => request()->url(),
                'query' => request()->query(),
            ]
        );

        return Inertia::render(
            'dynamic-table/Index',
            [
                'data' => $paginated,
                'filters' => [
                    'search' => $search
                ]
            ]
        );
    }

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