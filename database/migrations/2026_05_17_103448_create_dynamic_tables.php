<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dynamic_tables', function (Blueprint $table) {
            $table->id();
            $table->string('table_name')->unique();
            $table->integer('user_id');
            $table->timestamps();
        });

        Schema::create('dynamic_fields', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('dynamic_table_id');
            $table->string('field_name');
            $table->string('field_type');
            $table->boolean('nullable')->default(false);
            $table->boolean('unique')->default(false);
            $table->string('value')->nullable();
            $table->string('relationship_type')->nullable();
            $table->string('related_table')->nullable();
            $table->string('related_field')->nullable();
            $table->timestamps();

            $table->foreign('dynamic_table_id')
                ->references('id')
                ->on('dynamic_tables')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dynamic_fields');
        Schema::dropIfExists('dynamic_tables');
    }
};