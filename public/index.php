<?php
require __DIR__ . '/../boot.php';

$response = app()->router->run();

if (is_string($response)) {
    echo $response;
    exit;
}

header('Content-Type: application/json');
echo json_encode($response);
