<?php

if (!defined('API_ENTRY')) {
    http_response_code(404);
    exit;
}

$config = [
    'db' => [
        'dsn'      => Env::get('DB_DSN'),
        'user'     => Env::get('DB_USER'),
        'password' => Env::get('DB_PASSWORD'),
    ],

    'cors' => [
        'origins' => array_filter(array_map(
            'trim',
            explode(',', Env::get('CORS_ORIGINS', 'http://localhost:5173,http://localhost:4173'))
        )),
    ],

    'features' => [],
    'routes'   => [],
];

foreach (glob(__DIR__ . '/features/*/config.php') as $file) {
    $featureConfig = require $file;

    if (isset($featureConfig['name'])) {
        $config['features'][$featureConfig['name']] = $featureConfig['settings'] ?? [];
    }

    if (isset($featureConfig['routes'])) {
        $config['routes'] = array_merge($config['routes'], $featureConfig['routes']);
    }
}

return $config;