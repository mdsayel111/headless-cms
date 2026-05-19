<?php

namespace App\Http\Controllers;

use App\Models\Project;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $database = env('DB_DATABASE');

        $tables = DB::select("SHOW TABLES");

        $tableKey = "Tables_in_" . $database;

        $userId = auth()->id();

        // SEARCH VALUE
        $search = $request->search;

        // QUERY
        $query = Project::query();

        // APPLY SEARCH
        if ($search) {

            $query->where(function ($q) use ($search) {

                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // PAGINATION
        $projects = $query->paginate(10)
            ->withQueryString();

        // TRANSFORM DATA
        $projects->getCollection()->transform(
            function ($project) use ($tables, $tableKey, $userId) {

                $totalTables = 0;

                foreach ($tables as $table) {

                    $tableName = $table->$tableKey;

                    // ONLY CURRENT USER TABLES
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

                    // CHECK project_id COLUMN EXISTS
                    if (Schema::hasColumn($tableName, 'project_id')) {

                        // CHECK PROJECT EXISTS IN TABLE
                        $exists = DB::table($tableName)
                            ->where('project_id', $project->id)
                            ->exists();

                        if ($exists) {
                            $totalTables++;
                        }
                    }
                }

                return [
                    'id' => $project->id,
                    'name' => $project->name,
                    'description' => $project->description,
                    'total_table' => $totalTables
                ];
            }
        );

        return Inertia::render('project/Index', [
            'data' => $projects,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {


    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string'
        ]);

        $user = auth()->user();

        Project::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => $user->id
        ]);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string'
        ]);

        $project = Project::findOrFail($id);

        // OPTIONAL SECURITY CHECK
        if ($project->user_id !== auth()->id()) {
            abort(403);
        }

        $project->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return redirect()->back();
    }

    public function destroy(string $id)
    {
        $project = Project::findOrFail($id);

        $database = env('DB_DATABASE');

        $tables = DB::select("SHOW TABLES");

        $tableKey = "Tables_in_" . $database;

        $userId = auth()->id();

        $projectTables = [];

        // FIND PROJECT TABLES
        foreach ($tables as $table) {

            $tableName = $table->$tableKey;

            // ONLY CURRENT USER TABLES
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

            // CHECK project_id COLUMN
            if (Schema::hasColumn($tableName, 'project_id')) {

                $exists = DB::table($tableName)
                    ->where('project_id', $project->id)
                    ->exists();

                if ($exists) {
                    $projectTables[] = $tableName;
                }
            }
        }

        // DISABLE FOREIGN KEY CHECKS
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // DROP TABLES
        foreach ($projectTables as $tableName) {

            Schema::dropIfExists($tableName);
        }

        // ENABLE FOREIGN KEY CHECKS
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // DELETE PROJECT
        $project->delete();

        return redirect()->back();
    }
}
