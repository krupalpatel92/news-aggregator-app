<?php

namespace App\Helpers;

use jcobhams\NewsApi\NewsApi;

class NewsApiOrgFeedHelper
{

    private $newsApi;
    public $identifier = "news-api-org"; // This should be same as the slug in the feeder table.
    private $feeder;
    private $defaultCategoryName = "Other (NewApi.Org)"; // When no category is found in the article, this will be used.
    private $apiParam = ["q" => "world", "pageSize" => 100, "page" => 1];

    public function __construct($source, $query, $perPage, $page)
    {
        $this->feeder = $source;
        $this->newsApi = new NewsApi($source->apiKey);
        $this->apiParam = [
            'q' => $query !== null ? $query : $this->apiParam['q'],
            'page' => $perPage !== null ? $page : $this->apiParam['page'],
            // NOTE: NewsApi.org has limitation to provide max 100 records per page.
            'pageSize' => $perPage !== null ? ($perPage > 100 ? 100 : $perPage) : $this->apiParam['pageSize'],
        ];
    }

    /**
     * @return array List of authors, sources, categories of articles and articles
     */
    public function getFeed()
    {
        /* TODO: Lots of things can be done here as per doc https://newsapi.org/docs/endpoints/everything */
        $allNews = $this->newsApi->getEverything($this->apiParam['q'], null, null, null, null, null, 'en', 'publishedAt', $this->apiParam['pageSize'], $this->apiParam['page']);
        $articles = $allNews->status === "ok" ? $allNews->articles : [];

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
    private function getAuthorName($article)
    {
        // NOTE: Not all records have an author. In that case I have considered source as a author.
        return substr(newsSpecialCharsRemove($article->author ?? $article->source->name), 0, 50);
    }

    /**
     * @note: input value should be output value of $this->getAuthorName()
     * @return string Author Slug by name
     */
    private function getAuthorSlug($authorName)
    {
        return newsParamsSlugify($authorName);
    }

    /**
     * @return array List of authors with name, slug and feederId
     */
    private function getAuthors($articles)
    {
        // Collect all authors name
        $authors = array_map(function ($article) {
            $authorName = $this->getAuthorName($article);
            return $authorName !== "" ? [
                "name" => $authorName,
                "slug" => $this->getAuthorSlug($authorName),
                "feederId" => $this->feeder->id,
            ] : null;
        }, $articles);

        // Filter null values
        $authors = array_values(array_filter($authors, function ($author) {
            return $author !== null;
        }));

        // Remove duplicate authors and reset keys
        $authorReturn = array_intersect_key($authors, array_unique(array_column($authors, 'slug')));

        return array_values($authorReturn);
    }

    /**
     * @return string Source name
     */
    private function getSourceName($article)
    {
        return substr(newsSpecialCharsRemove($article->source->name), 0, 50);
    }

    /**
     * @note: input value should be output value of $this->getSourceName()
     * @return string Source Slug by name
     */
    private function getSourceSlug($sourceName)
    {
        return newsParamsSlugify($sourceName);
    }

    /**
     * @return array List of sources with name, slug and feederId
     */
    private function getSources($articles)
    {
        // Collect all sources name
        $sources = array_map(function ($article) {
            $sourceName = $this->getSourceName($article);
            return $sourceName !== "" ? [
                "name" => $sourceName,
                "slug" => $this->getSourceSlug($sourceName),
                "feederId" => $this->feeder->id,
            ] : null;
        }, $articles);

        // Filter null values
        $sources = array_values(array_filter($sources, function ($source) {
            return $source !== null;
        }));

        // Remove duplicate sources and reset keys
        $sourceReturn = array_intersect_key($sources, array_unique(array_column($sources, 'slug')));

        return array_values($sourceReturn);
    }

    /**
     * @return string Category name
     */
    private function getCategoryName($catName)
    {
        return substr(newsSpecialCharsRemove($catName), 0, 50);
    }

    /**
     * @note: input value should be output value of $this->getCategoryName()
     * @return string Category Slug by name
     */
    private function getCategorySlug($catName)
    {
        return newsParamsSlugify($catName);
    }

    /**
     * @return array List of categories
     */
    private function getCategories($articles)
    {
        /**
         * TODO: NewsAPI.org is not providing category info for the Endpoint /v2/everything
         * https://newsapi.org/docs/endpoints/everything
         **/
        $defaultCategoryName = $this->getCategoryName($this->defaultCategoryName);
        $categories[] = [
            "name" => $defaultCategoryName,
            "slug" => $this->getCategorySlug($defaultCategoryName),
            "feederId" => $this->feeder->id
        ];

        return array_values(array_intersect_key($categories, array_unique(array_column($categories, 'slug'))));
    }

    /**
     * @return array List of articles with DB ids of author, source, category and feeder
     */
    public function makeRelationsWithArticle($articles, $sources, $authors, $category)
    {

        $articlesToCreate = [];

        foreach ($articles as $article) {

            // NOTE: Many articles are removed from NewsApi.org and those still returns in endpoint response as a named "[Removed]"
            if ($article->title === "[Removed]") continue;

            array_push($articlesToCreate, [
                'catId' => array_filter($category, function ($cat) {
                    return $cat["slug"] === $this->getCategorySlug($this->defaultCategoryName);
                })[0]["id"] ?? null,
                'authorId' => array_values(array_filter($authors, function ($author) use ($article) {
                    return $author["slug"] === $this->getAuthorSlug($this->getAuthorName($article));
                }))[0]["id"] ?? null,
                'sourceId' => array_values(array_filter($sources, function ($source) use ($article) {
                    return $source["slug"] === $this->getSourceSlug($this->getSourceName($article));
                }))[0]["id"] ?? null,
                'feederId' => $this->feeder->id,
                'name' => $article->title,
                'slug' => newsArticleUniqueSlug($article->title),
                'imgUrl' => $article->urlToImage,
                'URL' => $article->url,
                'summary' => $article->description,
                'content' => $article->content,
                'originalRawData' => $article,
                'publishedAt' => $article->publishedAt,

            ]);
        }


        return $articlesToCreate;
    }
}
