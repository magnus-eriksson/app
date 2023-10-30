<?php

namespace App;

use Illuminate\Container\Container;
use Jsl\Config\Config;
use Jsl\Config\Contracts\ConfigInterface;
use Jsl\Database\Connection;
use Jsl\Database\Connectors\ConnectionFactory;
use Jsl\Ensure\EnsureFactory;
use Jsl\Router\Components\Route;
use Jsl\Router\Contracts\RouterInterface;
use Jsl\Router\Router;
use League\Plates\Engine;
use Symfony\Component\HttpFoundation\Request;

/**
 * @property ConfigInterface $config
 * @property Request $request
 * @property RouterInterface $router
 * @property Engine $views
 * @property EnsureFactory $validator
 * @property Connection $db
 */
class App extends Container
{
    /**
     * @param array $configs
     */
    public function __construct(array $configs = [])
    {
        if (static::$instance === null) {
            static::$instance = $this;
        }

        $this->instance(App::class, $this);

        $this->singleton(ConfigInterface::class, fn () => new Config($configs));
        $this->alias(ConfigInterface::class, 'config');

        $this->singleton(Request::class, fn () => Request::createFromGlobals());
        $this->alias(Request::class, 'request');

        $this->singleton(RouterInterface::class, fn () => (new Router)
            ->addFixedArguments([$this])
            ->setClassResolver([$this, 'make']));
        $this->alias(RouterInterface::class, 'router');

        $this->singleton(Engine::class, function () {
            $views = new Engine($this->config('templates'));
            $views->registerFunction('route', [$this->router, 'getNamedRoute']);
            return $views;
        });
        $this->alias(Engine::class, 'views');

        $this->singleton(EnsureFactory::class, function (App $app) {
            return (new EnsureFactory)
                ->setClassResolver(fn ($class) => $app->make($class));
        });
        $this->alias(EnsureFactory::class, 'validator');

        $this->singleton(Connection::class, fn () => (new ConnectionFactory())->make($this->config('db.connection')));
        $this->alias(Connection::class, 'db');
    }


    /**
     * @param string $key
     * @param mixed $fallback
     *
     * @return mixed
     */
    public function config(string $key, mixed $fallback = null): mixed
    {
        return $this->config->get($key, $fallback);
    }


    /**
     * @param string $method
     * @param string $path
     * @param callable|array $callback
     *
     * @return Route
     */
    public function addRoute(string $method, string $path, callable|array $callback): Route
    {
        return $this->router->addRoute($method, $path, $callback);
    }


    /**
     * @param string $name
     * @param array $params
     *
     * @return string
     */
    public function namedRoute(string $name, array $params = []): string
    {
        return $this->router->getNamedRoute($name, $params);
    }


    /**
     * @param string $location
     * @param int $responseCode
     *
     * @return void
     */
    public function redirect(string $location, int $responseCode = 302): void
    {
        header("location: {$location}", true, $responseCode);
        exit;
    }


    /**
     * @param string $template
     * @param array $data
     *
     * @return string
     */
    public function render(string $template, array $data = []): string
    {
        return $this->views->render($template, $data);
    }
}
