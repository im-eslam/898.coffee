<?php
class HttpContext {
    private const MAX_BODY = 16384; 

    public static function applySecurityHeaders(): void {
        header('X-Content-Type-Options: nosniff');
        header('Referrer-Policy: no-referrer');
        header('X-Frame-Options: DENY');
    }

    public static function json(array $data, int $status = 200): never {
        $detail = $data['code'] ?? $data['error'] ?? '';
        if ($status >= 500) {
            Log::error("HTTP $status $detail");
        } elseif ($status >= 400) {
            Log::warning("HTTP $status $detail");
        }

        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function fail(int $status, string $message, ?string $code = null): never {
        $body = ['ok' => false, 'error' => $message];
        if ($code !== null) $body['code'] = $code;
        self::json($body, $status);
    }

    public static function readRaw(int $maxBytes = self::MAX_BODY): string {
        $type = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
        if (!str_starts_with($type, 'application/json')) {
            self::fail(415, 'Content-Type must be application/json', 'UNSUPPORTED_MEDIA_TYPE');
        }
        $raw = file_get_contents('php://input', false, null, 0, $maxBytes + 1) ?: '';
        if (strlen($raw) > $maxBytes) {
            self::fail(413, 'Payload too large', 'PAYLOAD_TOO_LARGE');
        }
        return $raw;
    }

    public static function readBody(): array {
        $type = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
        if (!str_starts_with($type, 'application/json')) {
            self::fail(415, 'Content-Type must be application/json', 'UNSUPPORTED_MEDIA_TYPE');
        }
        $raw = file_get_contents('php://input', false, null, 0, self::MAX_BODY + 1) ?: '';
        if (strlen($raw) > self::MAX_BODY) {
            self::fail(413, 'Payload too large', 'PAYLOAD_TOO_LARGE');
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    public static function getString(array $input, string $key): string {
        $raw = $input[$key] ?? null;
        if (!is_string($raw)) return '';
        if (str_contains($raw, "\0")) {
            self::fail(422, 'Invalid input', 'INVALID_INPUT');
        }
        return trim($raw);
    }
}