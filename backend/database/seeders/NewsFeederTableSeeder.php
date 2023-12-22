<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NewsFeeder;

class NewsFeederTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        NewsFeeder::insert([
            [
                'name' => 'News API Org',
                'identifier' => 'news-api-org',
                'domain' => 'https://newsapi.org/',
                'apiKey' => 'b3b70512105d4144bebedba022828d2b',
                'url' => 'https://newsapi.org/v2/everything?q=title&language=en&sortBy=publishedAt&pageSize=100',
            ],
            [
                'name' => 'The Guardian',
                'identifier' => 'the-guardian',
                'domain' => 'https://www.theguardian.com',
                'apiKey' => '63030e6e-2526-4ded-8f93-2179fd711a3c',
                'url' => 'https://content.guardianapis.com/search',
            ],
            [
                'name' => 'The New york Times',
                'identifier' => 'the-ny-times',
                'domain' => 'https://www.nytimes.com',
                'apiKey' => 'EfbnlerqG4jrTxZZ4OOvmZV7CtJLfWBI',
                'url' => 'https://api.nytimes.com/svc/search/v2/articlesearch.json',
            ]
        ]);
    }
}
