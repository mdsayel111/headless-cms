<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DynamicTable extends Model
{
    protected $fillable = [
        'table_name'
    ];

    public function fields()
    {
        return $this->hasMany(DynamicField::class);
    }
}