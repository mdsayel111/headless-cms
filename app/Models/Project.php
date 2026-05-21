<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'name',
        'description',
        'user_id',
        'status'
    ];

    function table()
    {
        return $this->hasMany(DynamicTableMeta::class)
            ->where('status', 'active');
    }

    function user()
    {
        return $this->belongsTo(User::class);
    }
}