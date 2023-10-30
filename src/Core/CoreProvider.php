<?php

namespace App\Core;

use App\App;
use Symfony\Component\HttpFoundation\Request;
use Jsl\Router\Router;
use League\Plates\Engine;
use Jsl\Ensure\EnsureFactory;
use Jsl\Database\Connectors\ConnectionFactory;

class CoreProvider implements ProviderInterface
{
    /**
     * @inheritDoc
     */
    public function register(App $app): void
    {
        // Request
        $app->singleton(Request::class, fn () => Request::createFromGlobals());
        $app->alias(Request::class, 'request');

        // Router
        $app->singleton(RouterInterface::class, fn () => (new Router)
            ->addFixedArguments([$app])
            ->setClassResolver([$app, 'make']));
        $app->alias(RouterInterface::class, 'router');

        // Views
        $app->singleton(Engine::class, function () {
            $views = new Engine(config('templates.root'));
            foreach (config('templates.folders', []) as $name => $path) {
                $views->addFolder($name, $path);
            }
            return $views;
        });
        $app->alias(Engine::class, 'views');

        // Validation
        $app->singleton(EnsureFactory::class, function (App $app) {
            return (new EnsureFactory)
                ->setClassResolver(fn ($class) => $app->make($class));
        });
        $app->alias(EnsureFactory::class, 'validator');

        // Database
        $app->singleton(Connection::class, fn () => (new ConnectionFactory())
            ->make(config('db.connection')));
        $app->alias(Connection::class, 'db');
    }
}
