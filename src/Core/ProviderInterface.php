<?php

namespace App\Core;

use App\App;

interface ProviderInterface
{
    /**
     * @param App $app
     *
     * @return void
     */
    public function register(App $app): void;
}
