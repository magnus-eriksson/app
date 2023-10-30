<?php

return [
    'db' => [
        'connection' => [
            'driver'    => 'mysql',
            'host'      => 'localhost',
            'username'  => 'username',
            'password'  => 'password',
            'charset'   => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'lazy'      => false,
            'options'   => [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        ]
    ],

    'templates' => __DIR__ . '/views/templates',
];
