<?php

return [
    /**
     * Database
     */
    'db' => [
        'connection' => [
            'driver'    => 'mysql',
            'host'      => 'localhost',
            'database'  => 'database',
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

    /**
     * Views
     */
    'templates' => [
        'root' => __DIR__ . '/views/templates',
        'folders' => [],
    ],
];
