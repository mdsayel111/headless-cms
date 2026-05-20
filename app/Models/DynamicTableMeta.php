<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DynamicTableMeta extends Model
{
    protected $fillable = [
        'project_id',
        'table_name',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
