<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsFeeder extends Model
{
    protected $table = 'news_feeder';

    protected $fillable = [
        'name',
        'identifier',
        'domain',
        'URL',
        'apiKey',
        'updated_at',
    ];

    // Define the relationship to the NewsCategory model
    public function categories()
    {
        return $this->hasMany(NewsCategory::class, 'feederId');
    }

    // Define the relationship to the NewsAuthor model
    public function authors()
    {
        return $this->hasMany(NewsAuthor::class, 'feederId');
    }

    // Define the relationship to the NewsSource model
    public function sources()
    {
        return $this->hasMany(NewsSource::class, 'feederId');
    }

    // Define the relationship to the NewsArticle model
    public function articles()
    {
        return $this->hasMany(NewsArticle::class, 'feederId');
    }
}
