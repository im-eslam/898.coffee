<?php

class ProfileController extends ControllerBase
{
    /**
     * Updates the admin's dashboard language preference.
     *
     * @Route("POST /admin/settings/language")
     * @Authorize
     *
     * @param string $language (Body) Must be "en" or "ar".
     *
     * @return 200 { "ok": true, "user": { "username": "string", "language": "string" } }
     *
     * @throws 401 { "ok": false, "error": "Unauthorized" }
     * @throws 422 { "ok": false, "error": "Invalid language", "code": "invalid_language" }
     * @throws 500 { "ok": false, "error": "Server error", "code": "INTERNAL_ERROR" }
     */
    public function language(): void
    {
        $user = Guard::requireAdmin($this->config);

        $language = HttpContext::getString(HttpContext::readBody(), 'language');
        if (!in_array($language, $this->config['features']['admin']['languages'], true)) {
            HttpContext::fail(422, 'Invalid language', 'invalid_language');
        }

        $this->update($user['id'], 'language', $language);
        HttpContext::json(['ok' => true, 'user' => Guard::publicUser(['language' => $language] + $user)]);
    }

    /**
     * Updates the admin's username. Requires the current password for security verification.
     *
     * @Route("POST /admin/settings/username")
     * @Authorize
     *
     * @param string $username         (Body) The new username (3-50 chars).
     * @param string $current_password (Body) The admin's current password.
     *
     * @return 200 { "ok": true, "user": { "username": "string", "language": "string" } }
     *
     * @throws 401 { "ok": false, "error": "Unauthorized" }
     * @throws 409 { "ok": false, "error": "Username already taken", "code": "username_taken" }
     * @throws 422 { "ok": false, "error": "...", "code": "invalid_username" | "unchanged" | "wrong_password" }
     * @throws 429 { "ok": false, "error": "Too many attempts", "code": "too_many_attempts" }
     * @throws 500 { "ok": false, "error": "Server error", "code": "INTERNAL_ERROR" }
     */
    public function username(): void
    {
        $user = Guard::requireAdmin($this->config);
        $this->assertNotLocked();

        $input    = HttpContext::readBody();
        $username = strtolower(HttpContext::getString($input, 'username'));

        if (!Guard::usernameIsValid($this->config, $username)) {
            HttpContext::fail(422, 'Invalid username', 'invalid_username');
        }
        if ($username === $user['username']) {
            HttpContext::fail(422, 'Username unchanged', 'unchanged');
        }

        $currentPassword = is_string($input['current_password'] ?? null) ? $input['current_password'] : '';
        $this->confirmCurrentPassword($user['id'], $currentPassword);

        try {
            $this->update($user['id'], 'username', $username);
        } catch (PDOException $error) {
            if (in_array((string) $error->getCode(), ['23505', '23000'], true)) {
                HttpContext::fail(409, 'Username already taken', 'username_taken');
            }
            throw $error;
        }

        HttpContext::json(['ok' => true, 'user' => Guard::publicUser(['username' => $username] + $user)]);
    }

    /**
     * Changes the admin's password and logs out all other active sessions globally.
     *
     * @Route("POST /admin/settings/password")
     * @Authorize
     *
     * @param string $current_password (Body) The admin's current password.
     * @param string $new_password     (Body) The new password (min 10 chars).
     *
     * @return 200 { "ok": true }
     *
     * @throws 401 { "ok": false, "error": "Unauthorized" }
     * @throws 422 { "ok": false, "error": "...", "code": "weak_password" | "same_password" | "wrong_password" }
     * @throws 429 { "ok": false, "error": "Too many attempts", "code": "too_many_attempts" }
     * @throws 500 { "ok": false, "error": "Server error", "code": "INTERNAL_ERROR" }
     */
    public function password(): void
    {
        $user = Guard::requireAdmin($this->config);
        $this->assertNotLocked();

        $input   = HttpContext::readBody();
        $current = is_string($input['current_password'] ?? null) ? $input['current_password'] : '';
        $new     = is_string($input['new_password'] ?? null) ? $input['new_password'] : '';

        if (!Guard::passwordIsValid($this->config, $new, $user['username'])) {
            HttpContext::fail(422, 'Password does not meet the rules', 'weak_password');
        }
        if ($new === $current) {
            HttpContext::fail(422, 'New password must be different', 'same_password');
        }

        $this->confirmCurrentPassword($user['id'], $current);

        $hash = password_hash($new, PASSWORD_DEFAULT);
        $this->update($user['id'], 'password_hash', $hash);

        Guard::login(['id' => $user['id'], 'password_hash' => $hash]);
        HttpContext::json(['ok' => true]);
    }

    private function update(int $id, string $column, string $value): void
    {
        static $allowed = ['language', 'username', 'password_hash'];
        if (!in_array($column, $allowed, true)) {
            throw new \InvalidArgumentException("update(): invalid column '$column'");
        }

        $table = $this->config['features']['admin']['table'];
        $this->DbContext()->prepare("UPDATE {$table} SET {$column} = ? WHERE id = ?")
            ->execute([$value, $id]);
    }

    private function assertNotLocked(): void
    {
        $limit = $this->config['features']['admin']['reauth_limit'];
        $wait  = RateLimiter::blocked('admin_reauth', $limit['max'], $limit['window']);
        if ($wait > 0) {
            header('Retry-After: ' . $wait);
            HttpContext::fail(429, 'Too many attempts', 'too_many_attempts');
        }
    }

    private function confirmCurrentPassword(int $userId, string $password): void
    {
        $cfg   = $this->config['features']['admin'];
        $limit = $cfg['reauth_limit'];

        $stmt = $this->DbContext()->prepare("SELECT password_hash FROM {$cfg['table']} WHERE id = ?");
        $stmt->execute([$userId]);
        $hash = $stmt->fetchColumn();

        $ok = $hash !== false
            && $password !== ''
            && strlen($password) <= $cfg['password']['current_max']
            && password_verify($password, (string) $hash);

        if (!$ok) {
            RateLimiter::record('admin_reauth', $limit['window']);
            HttpContext::fail(422, 'Wrong current password', 'wrong_password');
        }

        RateLimiter::reset('admin_reauth'); 
    }
}