<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DynamicField extends Model
{
    protected $fillable = [
        'dynamic_table_id',
        'field_name',
        'field_type',
        'nullable',
        'unique',
        'default_value',
        'relationship_type',
        'related_table',
        'related_field'
    ];
}