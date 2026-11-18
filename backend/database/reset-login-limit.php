<?php
if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

define('API_ENTRY', true);

require __DIR__ . '/../core/autoloader.php';
Autoloader::register(dirname(__DIR__));

$tempDir = sys_get_temp_dir();

$pattern = $tempDir . '/rate_limit_*';
$files = glob($pattern);

$clearedCount = 0;

if ($files) {
    foreach ($files as $file) {
        if (is_file($file)) {
            @unlink($file);
            $clearedCount++;
        }
    }
}

$developmentIps = ['127.0.0.1', '::1', 'localhost'];
foreach ($developmentIps as $ip) {
    @RateLimiter::resetForClientIp('admin_login', $ip);
}

fwrite(STDOUT, "Successfully cleared all login rate limit blocks ({$clearedCount} state files removed).\n");