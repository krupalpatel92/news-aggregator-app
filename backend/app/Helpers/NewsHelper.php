<?php

namespace App\Helpers;

use Illuminate\Support\Str;

if (!function_exists('newsParamsSlugify')) {
    /**
     * Generate a custom slug.
     *
     * @param string $sourceName
     * @return string
     */
    function newsParamsSlugify($param)
    {
        return Str::slug($param, '-', 'en', ['.' => '-']);
    }
}

if (!function_exists('newsSpecialCharsRemove')) {
    /**
     * Generate a custom slug.
     *
     * @param string $sourceName
     * @return string
     */
    function newsSpecialCharsRemove($param)
    {
        return preg_replace('/[^a-zA-Z0-9 .]/', '', $param);
    }
}


if (!function_exists('newsArticleUniqueSlug')) {
    /**
     * Generate a unique slug for article.
     *
     * @param string $sourceName
     * @return string
     */
    function newsArticleUniqueSlug($title)
    {
        return newsParamsSlugify(newsSpecialCharsRemove($title)) . '-' . time();
    }
}

if (!function_exists('newsArticlePublishedAt')) {
    /**
     * Convert published date time string to MySQL datetime format.
     *
     * @param string $sourceName
     * @return string
     */
    function newsArticlePublishedAt($timeString)
    {

        // Create a DateTime object from the string
        $timestamp = strtotime($timeString);

        // Format the timestamp in MySQL datetime format
        return date('Y-m-d H:i:s', $timestamp);
    }
}
