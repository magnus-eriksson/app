<?php

use App\App;

/**
 * @return App
 */
function app(): App
{
    return App::getInstance();
}


/**
 * Get an excerpt of a text string
 *
 * @param  string  $text
 * @param  integer $maxLength
 * @param  string  $suffix
 *
 * @return string
 */
function excerpt(string $text, int $maxLength = 300, string $suffix = '...')
{
    $more = stripos($text, '<!--more-->');
    if ($more !== false) {
        return strip_tags(substr($text, 0, $more));
    }

    $text = strip_tags($text);

    if (strlen($text) > $maxLength) {
        $text      = substr($text, 0, $maxLength - strlen($suffix));
        $lastSpace = strrpos($text, ' ');
        $text      = substr($text, 0, $lastSpace);
        $text      .= $suffix;
    }

    return $text;
}


/**
 * Convert markdown into HTML
 *
 * @param string $text
 *
 * @return string
 */
function parseMarkdown(string $text): string
{
    static $instance = new cebe\markdown\GithubMarkdown;
    return $instance->parse($text);
}


/**
 * @param array $set
 * @param array $remove
 *
 * @return string
 */
function queryString(array $add = [], array $remove = []): string
{
    $current = app()->request->query;
    $current->add($add);

    $query = array_filter(
        $current->all(),
        fn ($key) => !in_array($key, $remove),
        ARRAY_FILTER_USE_KEY
    );

    return http_build_query($query);
}
