<?php

namespace App\Http\Controllers;
use App\Models\DynamicTableFieldMeta;
use App\Models\DynamicTableMeta;
use App\Models\Project;
use DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // SEARCH VALUE
        $search = $request->search;

        // QUERY
        $query = Project::query();

        // APPLY SEARCH
        if ($search) {
            $query->where('user_id', auth()->id())
                ->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
        }

        // PAGINATION
        $projects = $query->with('table')
            ->paginate(10)
            ->withQueryString();


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
        $project = Project::with('table')->findOrFail($id);
        $failedTables = [];

        try {
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            foreach ($project->table as $table) {

                try {

                    Schema::dropIfExists($table->table_name);

                    // VERIFY TABLE REALLY DELETED
                    if (Schema::hasTable($table->table_name)) {
                        $failedTables[] = $table->id;
                    }

                } catch (\Throwable $e) {

                    $failedTables[] = $table->table_name;

                    Log::error($e);
                }
            }

        } finally {

            DB::statement('SET FOREIGN_KEY_CHECKS=1');
        }

        // ONLY NOW DELETE METADATA
        DB::transaction(function () use ($project, $failedTables) {
            foreach ($project->table as $table) {
                if (in_array($table->id, $failedTables)) {
                    DynamicTableFieldMeta::updateOrFail($table->id, [
                        'status' => 'failed'
                    ]);
                } else {
                    DynamicTableFieldMeta::where('dynamic_table_id', $table->id)->delete();
                }
            }

            DynamicTableMeta::where(
                'project_id',
                $project->id
            )->delete();

            try {
                $project->delete();
            } catch (\Throwable $e) {
                $project->updateOrFail([
                    'status' => 'failed'
                ]);
            }
        });

        return back();
    }
}
