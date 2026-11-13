<?php
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

if ($argc !== 2) {
    fwrite(STDERR, "Usage: php reset-login-limit.php <client-ip>\n");
    exit(2);
}

$clientIp = trim($argv[1]);
if (filter_var($clientIp, FILTER_VALIDATE_IP) === false) {
    fwrite(STDERR, "Error: client-ip must be a valid IPv4 or IPv6 address.\n");
    exit(2);
}

define('API_ENTRY', true);

require __DIR__ . '/../core/autoloader.php';
Autoloader::register(dirname(__DIR__));

if (!RateLimiter::resetForClientIp('admin_login', $clientIp)) {
    fwrite(STDERR, "Error: could not clear login attempts. Check PHP's temporary-directory permissions.\n");
    exit(1);
}

fwrite(STDOUT, "Login attempts cleared for {$clientIp}.\n");
