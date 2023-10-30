<?php

namespace App;

use App\Core\CoreProvider;
use App\Core\ProviderInterface;
use Illuminate\Container\Container;
use InvalidArgumentException;
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
     * @var array<ProviderInterface>
     */
    protected array $providers = [];


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

        $this->addProvider(CoreProvider::class);
    }


    /**
     * @param ProviderInterface|string $provider
     *
     * @return self
     */
    public function addProvider(ProviderInterface|string $provider): self
    {
        if (!in_array(ProviderInterface::class, class_implements($provider))) {
            throw new InvalidArgumentException("Providers must implement " . ProviderInterface::class);
        }

        $provider = is_string($provider) ? $this->make($provider) : $provider;
        $provider->register($this);
        $this->providers[] = $provider;

        return $this;
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
}
