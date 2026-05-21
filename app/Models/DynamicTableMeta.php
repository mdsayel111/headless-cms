<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DynamicTableMeta extends Model
{
    protected $fillable = [
        'project_id',
        'table_name',
        'status',
        'user_id'
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function fields()
    {
        return $this->hasMany(DynamicTableFieldMeta::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
