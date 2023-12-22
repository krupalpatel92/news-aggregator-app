<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\NewsFeeder;

class NewsAuthor extends Model
{
    protected $table = 'news_author';

    protected $hidden = [
        'feederId',
    ];

    protected $fillable = [
        'name',
        'slug',
        'feederId',
        'updated_at',
    ];

    // Define the relationship to the NewsFeeder model
    public function feeder()
    {
        return $this->belongsTo(NewsFeeder::class, 'feederId');
    }

    // Define the relationship to the NewsArticle model
    public function articles()
    {
        return $this->hasMany(NewsArticle::class, 'authorId');
    }
}
