<?php
namespace App\Services;
use App\Models\DynamicTableMeta;
use App\Models\Project;
use App\Models\User;
use Exception;

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

            $project->update([
                'is_delete' => true,
            ]);

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
                'status' => 'failed',
            ]);

            return false;
        }
    }

    public function deleteDynamicTableFieldMeta(DynamicTableMeta $dynamicTable): bool
    {
        try {

            $dynamicTable->update([
                'is_delete' => true,
            ]);

            /**
             * external delete logic
             * filesystem/api/etc
             */

            $dynamicTable->delete();

            return true;

        } catch (Exception $e) {

            return false;
        }
    }
}