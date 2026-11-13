<?php

class LoginController extends ControllerBase
{
    /**
     * Authenticates an admin user and creates a secure session.
     *
     * @Route("POST /admin/login")
     * @AllowAnonymous
     *
     * @param string $username (Body) The admin's username.
     * @param string $password (Body) The admin's password.
     *
     * @return 200 { "ok": true, "user": { "username": "string", "language": "string" } }
     *
     * @throws 401 { "ok": false, "error": "Invalid credentials" }
     * @throws 429 { "ok": false, "error": "Too many attempts" } (Includes Retry-After header)
     * @throws 500 { "ok": false, "error": "Server error", "code": "INTERNAL_ERROR" }
     */
    public function login(): void
    {
        $cfg   = $this->config['features']['admin'];
        $limit = $cfg['login_limit'];

        Guard::csrfGuard();

        $wait = RateLimiter::blocked('admin_login', $limit['max'], $limit['window']);
        if ($wait > 0) {
            header('Retry-After: ' . $wait);
            HttpContext::fail(429, 'Too many attempts');
        }

        $input    = HttpContext::readBody();
        $username = strtolower(HttpContext::getString($input, 'username'));
        $password = is_string($input['password'] ?? null) ? $input['password'] : '';

        $user = null;
        if ($username !== '' && strlen($username) <= 50 && $password !== '' && strlen($password) <= $cfg['password']['current_max']) {
            $stmt = $this->DbContext()->prepare("SELECT id, username, language, password_hash FROM {$cfg['table']} WHERE username = ?");
            $stmt->execute([$username]);
            $user = $stmt->fetch() ?: null;
        }

        if ($user === null) {
            password_hash(bin2hex(random_bytes(8)), PASSWORD_DEFAULT);
            $ok = false;
        } else {
            $ok = password_verify($password, $user['password_hash']);
        }

        if (!$ok) {
            RateLimiter::record('admin_login', $limit['window']); 
            HttpContext::fail(401, 'Invalid credentials');
        }

        if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
            $user['password_hash'] = password_hash($password, PASSWORD_DEFAULT);
            $this->DbContext()->prepare("UPDATE {$cfg['table']} SET password_hash = ? WHERE id = ?")
                ->execute([$user['password_hash'], $user['id']]);
        }

        RateLimiter::reset('admin_login'); 
        Guard::start($this->config);
        Guard::login($user);

        HttpContext::json(['ok' => true, 'user' => Guard::publicUser($user)]);
    }

    /**
     * Destroys the current admin session and clears the secure cookie.
     *
     * @Route("POST /admin/logout")
     * @Authorize
     *
     * @return 200 { "ok": true }
     *
     * @throws 500 { "ok": false, "error": "Server error", "code": "INTERNAL_ERROR" }
     */
    public function logout(): void
    {
        Guard::requireAdmin($this->config);
        Guard::destroy();
        HttpContext::json(['ok' => true]);
    }

    /**
     * Validates the current session and returns the logged-in user's profile.
     *
     * @Route("GET /admin/me")
     * @Authorize
     *
     * @return 200 { "ok": true, "user": { "username": "string", "language": "string" } }
     *
     * @throws 401 { "ok": false, "error": "Unauthorized" }
     * @throws 500 { "ok": false, "error": "Server error", "code": "INTERNAL_ERROR" }
     */
    public function me(): void
    {
        $user = Guard::requireAdmin($this->config);
        HttpContext::json(['ok' => true, 'user' => Guard::publicUser($user)]);
    }
}