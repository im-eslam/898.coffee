<?php

class Guard
{
    public static function settings(array $config): array {
        return $config['features']['admin'];
    }

    public static function publicUser(array $user): array {
        return ['username' => $user['username'], 'language' => $user['language']];
    }

    public static function usernameIsValid(array $config, string $username): bool {
        return (bool) preg_match(self::settings($config)['username_pattern'], $username);
    }

    public static function passwordIsValid(array $config, string $password, string $username): bool {
        $rules = self::settings($config)['password'];
        return strlen($password) >= $rules['min']
            && strlen($password) <= $rules['max']
            && strtolower($password) !== $username;
    }

    public static function start(array $config): void {
        if (session_status() === PHP_SESSION_ACTIVE) return;
        
        $opt = self::settings($config)['session'];
        $dir = sys_get_temp_dir() . '/api_sessions';
        if (!is_dir($dir)) @mkdir($dir, 0700, true);
        if (is_dir($dir) && is_writable($dir)) session_save_path($dir);

        ini_set('session.use_strict_mode', '1');
        ini_set('session.use_only_cookies', '1');
        ini_set('session.use_trans_sid', '0');
        ini_set('session.gc_maxlifetime', (string) $opt['absolute']);

        session_name($opt['name']);
        session_set_cookie_params([
            'lifetime' => 0,
            'path'     => '/',
            'secure'   => self::isHttps(),
            'httponly' => true,
            'samesite' => 'Strict',
        ]);
        session_start();
    }

    public static function user(array $config): ?array {
        self::start($config);

        $uid = $_SESSION['uid'] ?? null;
        if (!is_int($uid)) return null;

        $opt = self::settings($config)['session'];
        $now = time();
        if ($now - (int) ($_SESSION['at'] ?? 0) > $opt['absolute'] || $now - (int) ($_SESSION['seen'] ?? 0) > $opt['idle']) {
            self::destroy();
            return null;
        }

        $table = self::settings($config)['table'];
        $stmt  = DbContext::connect($config['db'])->prepare("SELECT id, username, language, password_hash FROM $table WHERE id = ?");
        $stmt->execute([$uid]);
        $row = $stmt->fetch();

        if (!$row || !hash_equals((string) ($_SESSION['stamp'] ?? ''), self::stamp($row['password_hash']))) {
            self::destroy();
            return null;
        }

        $_SESSION['seen'] = $now;
        unset($row['password_hash']);
        $row['id'] = (int) $row['id'];
        return $row;
    }

    public static function requireAdmin(array $config): array {
        self::csrfGuard();
        $user = self::user($config);
        if ($user === null) HttpContext::fail(401, 'Unauthorized');
        return $user;
    }

    public static function login(array $user): void {
        session_regenerate_id(true);
        $_SESSION = [
            'uid'   => (int) $user['id'],
            'stamp' => self::stamp($user['password_hash']),
            'at'    => time(),
            'seen'  => time(),
        ];
    }

    public static function destroy(): void {
        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION = [];
            setcookie(session_name(), '', [
                'expires'  => time() - 3600,
                'path'     => '/',
                'secure'   => self::isHttps(),
                'httponly' => true,
                'samesite' => 'Strict',
            ]);
            session_destroy();
        }
    }

    public static function csrfGuard(): void {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        if (in_array($method, ['GET', 'HEAD', 'OPTIONS'], true)) return;
        if (($_SERVER['HTTP_ORIGIN'] ?? '') !== '') return; 
        
        $site = $_SERVER['HTTP_SEC_FETCH_SITE'] ?? '';
        if ($site !== '' && $site !== 'same-origin' && $site !== 'none') {
            HttpContext::fail(403, 'Forbidden');
        }
    }

    private static function stamp(string $passwordHash): string {
        return hash('sha256', $passwordHash);
    }

    private static function isHttps(): bool {
        if (!empty($_SERVER['HTTPS']) && strtolower((string) $_SERVER['HTTPS']) !== 'off') return true;
        return Env::get('TRUST_PROXY') === '1' && strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
    }
}