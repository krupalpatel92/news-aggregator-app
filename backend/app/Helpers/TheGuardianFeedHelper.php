<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Http;

class TheGuardianFeedHelper
{

    public $identifier = "the-guardian"; // This should be same as the slug in the feeder table.
    private $feeder;
    private $defaultCategoryName = "Other (The Guardian)"; // When no category is found in the article, this will be used.
    private $defaultAuthorName = "The Guardian"; // When no author is found in the article, this will be used.
    private $defaultSourceName = "TheGuardian.com"; // When no author is found in the article, this will be used.
    private $apiParam = ["q" => "world", "pageSize" => 200, "page" => 1];


    public function __construct($source, $query, $perPage, $page)
    {
        $this->feeder = $source;
        $this->apiParam = [
            'q' => $query !== null ? $query : $this->apiParam['q'],
            'page' => $perPage !== null ? $page : $this->apiParam['page'],
            // NOTE: open-platform.theguardian.com/documentation has limitation to provide max 200 records per page.
            'pageSize' => $perPage !== null ? ($perPage > 200 ? 200 : $perPage) : $this->apiParam['pageSize'],
        ];
    }

    /**
     * @return array List of authors, sources, categories of articles and articles
     */
    public function getFeed()
    {
        /* TODO: Lots of things can be done here as per doc https://open-platform.theguardian.com/explore/ */
        $response = Http::get($this->feeder->URL, [
            'api-key' => $this->feeder->apiKey,
            'q' => $this->apiParam['q'],
            'page-size' => $this->apiParam['pageSize'],
            'page' => $this->apiParam['page'],
        ]);

        if (!$response->successful()) throw new \Exception("The Guardian API is not responding.");


        $theGuardianResponse = $response->json()["response"];
        $articles = $theGuardianResponse["status"] === "ok" ? $theGuardianResponse["results"] : [];

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
         * NOTE: guardianapis.org is not providing author info. Because they are the original author of their news articles.
         * https://content.guardianapis.com/search
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
    private function getSourceName($name)
    {
        return substr(newsSpecialCharsRemove($name), 0, 50);
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
        /**
         * NOTE: guardianapis.org is not providing source info. Because they are the original source itself.
         * https://content.guardianapis.com/search
         **/
        $defaultSourceName = $this->getSourceName($this->defaultSourceName);
        $sources[] = [
            "name" => $defaultSourceName,
            "slug" => $this->getSourceSlug($defaultSourceName),
            "feederId" => $this->feeder->id
        ];

        return array_values(array_intersect_key($sources, array_unique(array_column($sources, 'slug'))));
    }


    /**
     * @return string Category name
     */
    private function getCategoryName($article)
    {

        return substr(newsSpecialCharsRemove($article["sectionName"]), 0, 50);
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
                'name' => $article["webTitle"],
                'slug' => newsArticleUniqueSlug($article["webTitle"]),
                'imgUrl' => null, // Guardian is not providing image URL
                'URL' => $article["webUrl"],
                'summary' => null, // Guardian is not summary image URL
                'content' => null, // Guardian is not providing content
                'originalRawData' => $article,
                'publishedAt' => $article["webPublicationDate"],

            ]);
        }

        return $articlesToCreate;
    }
}
