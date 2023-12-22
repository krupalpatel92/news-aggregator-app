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
        Schema::create('news_article', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->unsignedBigInteger('catId');
            $table->foreign('catId')->references('id')->on('news_category');
            $table->unsignedBigInteger('authorId');
            $table->foreign('authorId')->references('id')->on('news_author');
            $table->unsignedBigInteger('sourceId');
            $table->foreign('sourceId')->references('id')->on('news_source');
            $table->unsignedBigInteger('feederId');
            $table->foreign('feederId')->references('id')->on('news_feeder');
            $table->text('imgUrl');
            $table->text('URL');
            $table->string('summary', 255);
            $table->longText('content');
            $table->longText('originalRawData');
            $table->datetime('publishedAt');
            $table->timestamp('created_at')->default(now());
            $table->timestamp('updated_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news_article');
    }
};
