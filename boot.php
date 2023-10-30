<?php

namespace App;

require __DIR__ . '/vendor/autoload.php';

app()->config->load([
    __DIR__ . '/config-defaults.php',
    __DIR__ . '/config.php',
]);

app()->addRoute('GET', '/', [Controllers\Home::class, 'home'])
    ->setName('home');
