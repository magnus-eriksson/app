<?php

use App\App;
use Jsl\Router\Contracts\RouteInterface;

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


/**
 * @param string $location
 * @param int $responseCode
 *
 * @return void
 */
function redirect(string $location, int $responseCode = 302): void
{
    header("location: {$location}", true, $responseCode);
    exit;
}


/**
 * Render a view
 *
 * @param string $template
 * @param array $data
 *
 * @return string
 */
function render(string $template, array $data = []): string
{
    return app()->views->render($template, $data);
}


/**
 * Get a named route
 *
 * @param string $route
 * @param array $args
 *
 * @return string
 */
function route(string $route, array $args = []): string
{
    return app()->router->getNamedRoute($route, $args);
}


/**
 * Add a route
 *
 * @param string $method
 * @param string $path
 * @param callable|array $callback
 *
 * @return RouteInterface
 */
function addRoute(string $method, string $path, callable|array $controller): RouteInterface
{
    return app()->router->addRoute($method, $path, $controller);
}


/**
 * Get a config param
 *
 * @param string $key
 * @param mixed $fallback
 *
 * @return mixed
 */
function config(string $key, mixed $fallback = null): mixed
{
    return app()->config($key, $fallback);
}


/**
 * @param [type] ...$params
 *
 * @return void
 */
function dd(...$params): void
{
    $backtrace = debug_backtrace();

    $fileinfo = '';
    if (!empty($backtrace[0]) && is_array($backtrace[0])) {
        $fileinfo = $backtrace[0]['file'] . ":" . $backtrace[0]['line'];
    }

    if (!empty($_SERVER['argv'])) {
        echo 'File: ' . $fileinfo . PHP_EOL;
        var_dump(...$params);
        exit;
    }
?>

    <div style="font: 12px Consolas, monospace; color: #444; background-color: #f3f3f3; border: solid 1px #ddd;">
        <div style="color: #b00; background-color: #e8e8e8; padding: 5px 10px;"><?= $fileinfo ?></div>
        <pre style="margin: 0; padding: 10px;"><?php var_dump(...$params); ?></pre>
    </div>

<?php
    exit;
}
