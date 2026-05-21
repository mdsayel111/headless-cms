<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dynamic_table_field_metas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dynamic_table_id')
                ->constrained('dynamic_table_metas');
            $table->string('field_name');
            $table->string('field_type');
            $table->string('relation_type')->nullable();
            $table->string('related_table')->nullable();
            $table->string('related_field')->nullable();
            $table->boolean('nullable')->default(false);
            $table->boolean('unique')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dynamic_table_field_metas');
    }
};
