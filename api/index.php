<?php
ini_set('display_errors', '0');
ini_set('log_errors', '1');

define('API_ENTRY', true);

$backend = dirname(__DIR__) . '/backend';

require $backend . '/core/autoloader.php';
Autoloader::register($backend);

Env::load($backend . '/.env');
$config = require $backend . '/appsettings.php';

require $backend . '/core/logger.php';
Log::register();

HttpContext::applySecurityHeaders();
CorsMiddleware::handle($config);

$uri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($uri, PHP_URL_PATH);
$path = $path === false || $path === null ? '/' : $path;

$segments = explode('/', trim($path, '/'));
foreach ($segments as $segment) {
    if ($segment === '..' || $segment === '.') {
        HttpContext::fail(404, 'Endpoint not found', 'NOT_FOUND');
    }
}

$path = preg_replace('#^/?api/?#', '/', $path);
$path = '/' . trim($path, '/');

if (str_ends_with($path, '.php')) {
    $path = substr($path, 0, -4);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$routeKey = $method . ' ' . $path;

if (!isset($config['routes'][$routeKey])) {
    $allowed = [];
    foreach (array_keys($config['routes']) as $key) {
        if (str_ends_with($key, ' ' . $path)) {
            $allowed[] = substr($key, 0, strpos($key, ' '));
        }
    }

    if ($allowed) {
        header('Allow: ' . implode(', ', $allowed));
        HttpContext::fail(405, 'Method not allowed', 'METHOD_NOT_ALLOWED');
    }

    HttpContext::fail(404, 'Endpoint not found', 'NOT_FOUND');
}

    $_SERVER['REQUEST_URI'] = $path;
Router::dispatch($config);
