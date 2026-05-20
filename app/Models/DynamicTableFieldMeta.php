<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DynamicTableFieldMeta extends Model
{
    protected $fillable = [
        'dynamic_table_id',
        'field_name',
        'field_type',
        'relation_type',
        'related_table',
        'related_field',
        'nullable',
        'unique',
    ];

    public function dynamicTable()
    {
        return $this->belongsTo(DynamicTableMeta::class);
    }
}
