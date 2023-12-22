<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class TheNewYorkTimesFeedHelper
{

    public $identifier = "the-ny-times"; // This should be same as the slug in the feeder table.
    private $feeder;
    private $defaultCategoryName = "Other (The NY Times)"; // When no category is found in the article, this will be used.
    private $defaultAuthorName = "The New York Times"; // When no author is found in the article, this will be used.
    private $defaultSourceName = "The New York Times"; // When no source is found in the article, this will be used.
    private $apiParam = ["q" => "world", "sort" => "newest", "pageSize" => 100, "page" => 1];


    public function __construct($source, $query, $perPage, $page)
    {
        $this->feeder = $source;
        $this->apiParam = [
            'q' => $query !== null ? $query : $this->apiParam['q'],
            // NOTE: developer.nytimes.com/docs is max returning 100s pages.
            'page' => $perPage !== null ? ($page > 100 ? 100 : $this->apiParam['page']) : $this->apiParam['page'],
            // NOTE: developer.nytimes.com/docs isn't supporting pageSize. They are using returning 10 records by default.
            'pageSize' => $perPage !== null ? $perPage : $this->apiParam['pageSize'],
        ];
    }

    /**
     * @return array List of authors, sources, categories of articles and articles
     */
    public function getFeed()
    {
        /* TODO: Lots of things can be done here as per doc https://developer.nytimes.com/docs */
        $response = Http::get($this->feeder->URL, [
            'api-key' => $this->feeder->apiKey,
            'q' => $this->apiParam['q'],
            'page' => $this->apiParam['page'],
        ]);

        if (!$response->successful()) throw new \Exception("NYTimes API is not responding.");


        $nyTimesResponse = $response->json();
        $articles = $nyTimesResponse["status"] === "OK" ? $nyTimesResponse["response"]["docs"] ?? [] : [];

        // dd($articles);

        $authors = $this->getAuthors($articles);
        $sources = $this->getSources($articles);
        $categories = $this->getCategories($articles);

        return [
            "authors" => $authors,
            "sources" => $sources,
            "categories" => $categories,
            "articles" => $articles
        ];
    }

    /**
     * @return string Author name
     */
    private function getAuthorName($name)
    {
        return substr(newsSpecialCharsRemove($name), 0, 50);
    }

    /**
     * @note: input value should be output value of $this->getAuthorName()
     * @return string Author Slug by name
     */
    private function getAuthorSlug($name)
    {
        return newsParamsSlugify($name);
    }

    /**
     * @return array List of authors
     */
    private function getAuthors($articles)
    {
        /**
         * NOTE: NYTimes.com is not providing author info. Because they are the original author of their news articles.
         * https://developer.nytimes.com/docs/articlesearch-product/1/overview
         **/
        $defaultAuthorName = $this->getAuthorName($this->defaultAuthorName);
        $authors[] = [
            "name" => $defaultAuthorName,
            "slug" => $this->getAuthorSlug($defaultAuthorName),
            "feederId" => $this->feeder->id
        ];

        return array_values(array_intersect_key($authors, array_unique(array_column($authors, 'slug'))));
    }

    /**
     * @return string Source name
     */
    private function getSourceName($article)
    {
        return substr(newsSpecialCharsRemove($article["source"] ?? $this->defaultSourceName), 0, 50);
    }

    /**
     * @note: input value should be output value of $this->getSourceName()
     * @return string Source Slug by name
     */
    private function getSourceSlug($name)
    {
        return newsParamsSlugify($name);
    }

    /**
     * @return array List of sources
     */
    private function getSources($articles)
    {

        // Collect all source name
        $sources = array_map(function ($article) {
            $sourceName = $this->getSourceName($article);
            return $sourceName !== "" ? [
                "name" => $sourceName,
                "slug" => $this->getCategorySlug($sourceName),
                "feederId" => $this->feeder->id,
            ] : null;
        }, $articles);

        // Filter null values
        $sources = array_values(array_filter($sources, function ($source) {
            return $source !== null;
        }));

        // Remove duplicate categories and reset keys
        $sourcesReturn = array_intersect_key($sources, array_unique(array_column($sources, 'slug')));

        return array_values($sourcesReturn);
    }


    /**
     * @return string Category name
     */
    private function getCategoryName($article)
    {
        return substr(newsSpecialCharsRemove($article["section_name"] ?? $article["subsection_name"]), 0, 50);
    }

    /**
     * @note: input value should be output value of $this->getCategoryName()
     * @return string Category Slug by name
     */
    private function getCategorySlug($categoryName)
    {
        return newsParamsSlugify($categoryName);
    }

    /**
     * @return array List of categories with name, slug and feederId
     */
    private function getCategories($articles)
    {
        // Collect all category name
        $categories = array_map(function ($article) {
            $categoryName = $this->getCategoryName($article);
            return $categoryName !== "" ? [
                "name" => $categoryName,
                "slug" => $this->getCategorySlug($categoryName),
                "feederId" => $this->feeder->id,
            ] : null;
        }, $articles);

        // Filter null values
        $categories = array_values(array_filter($categories, function ($category) {
            return $category !== null;
        }));

        // Remove duplicate categories and reset keys
        $categoryReturn = array_intersect_key($categories, array_unique(array_column($categories, 'slug')));

        return array_values($categoryReturn);
    }


    /**
     * @return array List of articles with DB ids of author, source, category and feeder
     */
    public function makeRelationsWithArticle($articles, $sources, $authors, $categories)
    {

        $articlesToCreate = [];

        foreach ($articles as $article) {

            array_push($articlesToCreate, [
                'catId' => array_values(array_filter($categories, function ($cat) use ($article) {
                    return $cat["slug"] === $this->getCategorySlug($this->getCategoryName($article));
                }))[0]["id"] ?? null,
                'authorId' => array_values(array_filter($authors, function ($author) use ($article) {
                    return $author["slug"] === $this->getAuthorSlug($this->defaultAuthorName);
                }))[0]["id"] ?? null,
                'sourceId' => array_values(array_filter($sources, function ($source) use ($article) {
                    return $source["slug"] === $this->getSourceSlug($this->defaultSourceName);
                }))[0]["id"] ?? null,
                'feederId' => $this->feeder->id,
                'name' => $article["headline"]["main"],
                'slug' => newsArticleUniqueSlug($article["headline"]["main"]),
                'imgUrl' => isset($article["multimedia"][0]["url"]) ? "https://https://www.nytimes.com/" . $article["multimedia"][0]["url"] : null,
                'URL' => $article["web_url"],
                'summary' => $article["snippet"],
                'content' => $article["lead_paragraph"],
                'originalRawData' => $article,
                'publishedAt' => $article["pub_date"],

            ]);
        }

        return $articlesToCreate;
    }
}
