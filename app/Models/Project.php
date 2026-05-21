<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'description',
        'user_id',
        'status',
        'is_delete'
    ];

    function table()
    {
        return $this->hasMany(DynamicTableMeta::class);
    }

    function user()
    {
        return $this->belongsTo(User::class);
    }
}