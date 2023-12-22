<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('news_article', function (Blueprint $table) {
            // Modify the imgUrl column to allow null values
            $table->text('imgUrl')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('news_article', function (Blueprint $table) {
            // However, it's common to leave the column nullable once it's modified
            // $table->text('imgUrl')->nullable(false)->change();
        });
    }
};
