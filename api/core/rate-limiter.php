<?php
class RateLimiter {
    public static function check(string $bucket, int $max, int $windowSeconds): void {
        if ($max <= 0) return;

        $fh = self::open($bucket);
        if ($fh === null) {
            error_log("RateLimiter: cannot open file for bucket '$bucket' — rate limiting is disabled!");
            return;
        }

        flock($fh, LOCK_EX);
        $hits = self::read($fh, $windowSeconds);

        if (count($hits) >= $max) {
            $retry = self::retryAfter($hits, $windowSeconds);
            flock($fh, LOCK_UN);
            fclose($fh);
            header('Retry-After: ' . $retry);
            HttpContext::fail(429, 'Too many requests', 'RATE_LIMITED');
        }

        $hits[] = time();
        self::write($fh, $hits);
        flock($fh, LOCK_UN);
        fclose($fh);
    }

    public static function blocked(string $bucket, int $max, int $windowSeconds): int {
        if ($max <= 0) return 0;

        $fh = self::open($bucket);
        if ($fh === null) return 0;

        flock($fh, LOCK_SH);
        $hits = self::read($fh, $windowSeconds);
        flock($fh, LOCK_UN);
        fclose($fh);

        return count($hits) >= $max ? self::retryAfter($hits, $windowSeconds) : 0;
    }

    public static function record(string $bucket, int $windowSeconds): void {
        $fh = self::open($bucket);
        if ($fh === null) return;

        flock($fh, LOCK_EX);
        $hits = self::read($fh, $windowSeconds);
        $hits[] = time();
        self::write($fh, $hits);
        flock($fh, LOCK_UN);
        fclose($fh);
    }

    public static function reset(string $bucket): void {
        self::remove(self::file($bucket));
    }

    public static function resetForClientIp(string $bucket, string $clientIp): bool {
        return self::remove(self::file($bucket, $clientIp));
    }

    private static function file(string $bucket, ?string $clientIp = null): string {
        return sys_get_temp_dir() . '/api_ratelimit_' . hash('sha256', $bucket . '|' . ($clientIp ?? self::clientIp())) . '.json';
    }

    private static function remove(string $file): bool {
        return !file_exists($file) || @unlink($file);
    }

    private static function open(string $bucket) {
        return @fopen(self::file($bucket), 'c+');
    }

    private static function read($fh, int $windowSeconds): array {
        $now = time();
        rewind($fh);
        $hits = json_decode(stream_get_contents($fh) ?: '[]', true);
        return array_values(array_filter(
            is_array($hits) ? $hits : [],
            fn($t) => is_int($t) && $t > $now - $windowSeconds
        ));
    }

    private static function write($fh, array $hits): void {
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode($hits));
    }

    private static function retryAfter(array $hits, int $windowSeconds): int {
        return max(1, $windowSeconds - (time() - min($hits)));
    }

    private static function clientIp(): string {
        if (Env::get('TRUST_PROXY') === '1') {
            $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
            if ($forwarded !== '') {
                return trim(explode(',', $forwarded)[0]);
            }
        }
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
}