<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsArticle extends Model
{
    protected $table = 'news_article';

    protected $hidden = [
        'catId',
        'authorId',
        'sourceId',
        'feederId',
        'originalRawData',
        'created_at',
        'updated_at',
    ];

    protected $fillable = [
        'name',
        'slug',
        'catId',
        'authorId',
        'sourceId',
        'feederId',
        'imgUrl',
        'URL',
        'summary',
        'content',
        'originalRawData',
        'publishedAt',
        'updated_at',
    ];

    // Define the relationship to the NewsCategory model
    public function category()
    {
        return $this->belongsTo(NewsCategory::class, 'catId');
    }

    // Define the relationship to the NewsAuthor model
    public function author()
    {
        return $this->belongsTo(NewsAuthor::class, 'authorId');
    }

    // Define the relationship to the NewsSource model
    public function source()
    {
        return $this->belongsTo(NewsSource::class, 'sourceId');
    }

    // Define the relationship to the NewsFeeder model
    public function feeder()
    {
        return $this->belongsTo(NewsFeeder::class, 'feederId');
    }
}
