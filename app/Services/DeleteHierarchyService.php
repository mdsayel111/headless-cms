<?php
namespace App\Services;
use App\Models\DynamicTableMeta;
use App\Models\Project;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class DeleteHierarchyService
{
    public function deleteUser(User $user): bool
    {
        try {

            $user->update([
                'is_delete' => true,
            ]);

            $hasFailedProjects = false;

            foreach ($user->projects as $project) {

                if (!$this->deleteProject($project)) {
                    $hasFailedProjects = true;
                }
            }

            $user->delete();

            return !$hasFailedProjects;

        } catch (Exception $e) {

            return false;
        }
    }

    public function deleteProject(Project $project): bool
    {
        try {
            $hasFailedTables = false;

            foreach ($project->table as $table) {

                if (!$this->deleteDynamicTableFieldMeta($table)) {
                    $hasFailedTables = true;
                }
            }

            $project->delete();

            return !$hasFailedTables;

        } catch (Exception $e) {

            $project->update([
                'is_delete' => true,
            ]);

            return false;
        }
    }
    public function deleteDynamicTableMeta(DynamicTableMeta $dynamicTable): bool
    {
        try {

            Schema::dropIfExists($dynamicTable->table_name);
            $dynamicTable->delete();
            return true;

        } catch (Exception $e) {
            $dynamicTable->update([
                'is_delete' => true,
            ]);
            return false;
        }
    }

    public function deleteDynamicTableFieldMeta(DynamicTableMeta $dynamicTable): bool
    {
        try {
            Schema::dropIfExists($dynamicTable->table_name);

            /**
             * external delete logic
             * filesystem/api/etc
             */

            $dynamicTable->delete();

            return true;

        } catch (Exception $e) {
            Log::info("catch");
            $dynamicTable->update([
                'is_delete' => true,
            ]);
            return false;
        }
    }
}