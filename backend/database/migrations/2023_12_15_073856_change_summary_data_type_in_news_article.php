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
            // Change the data type of the summary column to TEXT
            $table->text('summary')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {

        Schema::table('news_article', function (Blueprint $table) {
            // However, it's common to leave the column as TEXT once it's modified
            // $table->string('summary', 255)->change();
        });
    }
};
