<?php

namespace App\Http\Controllers;

use App\Models\DynamicTableFieldMeta;
use App\Models\DynamicTableMeta;
use App\Services\DeleteHierarchyService;
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
            DB::beginTransaction();
            $dynamic_table = DynamicTableMeta::create([
                'project_id' => $request->project_id,
                'table_name' => $tableName,
                'user_id' => $user->id,
            ]);
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
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'message' => $e->getMessage()
                ], 500);
            }
            // DB::commit();
            return redirect()->back();

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => $e->getMessage()
            ], 500);
        }
    }
    public function index(Request $request)
    {
        $projectId = $request->project;
        $search = $request->search;

        $query = DynamicTableMeta::query();

        $query->where('project_id', $projectId);

        if ($search) {
            $query->where('table_name', 'like', '%' . $search . '%');
        }

        $paginated = $query->paginate(10);

        // Add record count for each table
        $paginated->getCollection()->transform(function ($item) {
            try {
                $item->record_count = DB::table($item->table_name)->count();
            } catch (\Exception $e) {
                $item->record_count = 0;
            }

            return $item;
        });

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

    public function destroy($id)
    {
        $table = DynamicTableMeta::findOrFail($id);
        if (!$table) {
            return response()->json([
                'message' => 'Table not found'
            ], 404);
        }
        $delete_service = new DeleteHierarchyService();
        $delete_service->deleteDynamicTableMeta($table);

        return back();
    }
    
}