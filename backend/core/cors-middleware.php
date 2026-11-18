<?php
class CorsMiddleware {
    public static function handle(array $config): void {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

        if ($origin === '') {
            if ($method === 'OPTIONS') { http_response_code(204); exit; }
            return;
        }

        header('Vary: Origin');

        if (self::isSameOrigin($origin)) {
            if ($method === 'OPTIONS') { http_response_code(204); exit; }
            return;
        }

        $allowed = $config['cors']['origins'];
        if (!in_array($origin, $allowed, true)) {
            if (Env::get('CORS_ALLOW_ANY') === '1') {
                if ($method === 'OPTIONS') { http_response_code(204); exit; }
                return;
            }
            HttpContext::fail(403, 'Origin not allowed');
        }

        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: true'); 

        if ($method === 'OPTIONS') {
            header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
            header('Access-Control-Allow-Headers: Content-Type, If-Match');
            header('Access-Control-Max-Age: 600');
            http_response_code(204);
            exit;
        }
    }
    private static function isSameOrigin(string $origin): bool {
        $parts = parse_url($origin);
        if (!isset($parts['scheme'], $parts['host'])) return false;

        $scheme = (!empty($_SERVER['HTTPS']) && strtolower($_SERVER['HTTPS']) !== 'off') ? 'https' : 'http';
        if (Env::get('TRUST_PROXY') === '1') {
            $proto = strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '');
            if ($proto === 'https' || $proto === 'http') $scheme = $proto;
        }

        $expected = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? '');
        return strcasecmp($origin, $expected) === 0;
    }
}