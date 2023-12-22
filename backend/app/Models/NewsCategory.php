<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\NewsFeeder;

class NewsCategory extends Model
{
    protected $table = 'news_category';

    protected $fillable = [
        'name',
        'slug',
        'parentId',
        'feederId',
        'updated_at',
    ];

    // Define the relationship to the NewsFeeder model
    public function feeder()
    {
        return $this->belongsTo(NewsFeeder::class, 'feederId');
    }

    // Relationship with itself for parent-child hierarchy
    public function parentCategory()
    {
        return $this->belongsTo(NewsCategory::class, 'parentId');
    }

    // Define the relationship to the NewsArticle model
    public function articles()
    {
        return $this->hasMany(NewsArticle::class, 'catId');
    }
}
