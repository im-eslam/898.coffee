<?php
ini_set('display_errors', '0');
ini_set('log_errors', '1');

define('API_ENTRY', true);

require __DIR__ . '/core/autoloader.php';
Autoloader::register(__DIR__);

Env::load(__DIR__ . '/.env');
$config = require __DIR__ . '/appsettings.php';

HttpContext::applySecurityHeaders();
CorsMiddleware::handle($config);

Router::dispatch($config);