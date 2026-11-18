<?php

class ReviewsController extends ControllerBase
{
    /**
     * Submits a new customer review. Includes a hidden "website" honeypot field.
     *
     * @Route("POST /review")
     * @AllowAnonymous
     *
     * @param string $message (Body) [Required] 3 to 1000 chars.
     * @param string $name    (Body) [Optional] Max 80 chars.
     * @param string $contact (Body) [Optional] Max 120 chars.
     * @param string $website (Body) [Honeypot] MUST be empty.
     *
     * @return 201 { "ok": true } (Successfully inserted)
     * @return 200 { "ok": true } (Silently discarded due to honeypot trigger)
     *
     * @throws 422 { "ok": false, "error": "Invalid input", "code": "INVALID_INPUT" }
     * @throws 429 { "ok": false, "error": "Too many requests", "code": "RATE_LIMITED" }
     * @throws 500 { "ok": false, "error": "Server error", "code": "INTERNAL_ERROR" }
     */
    public function submit(): void
    {
        $cfg    = $this->config['features']['reviews'];
        $limits = $cfg['limits'];

        RateLimiter::check('review', $cfg['rate_limit']['max'], $cfg['rate_limit']['window']);

        $input = HttpContext::readBody();

        if (HttpContext::getString($input, 'website') !== '') {
            HttpContext::json(['ok' => true]);
        }

        $message = HttpContext::getString($input, 'message');
        $name    = HttpContext::getString($input, 'name');
        $contact = HttpContext::getString($input, 'contact');

        if (str_contains($message . $name . $contact, "\0")) {
            HttpContext::fail(422, 'Invalid input', 'INVALID_INPUT');
        }
        if (
            mb_strlen($message) < $limits['min_message'] ||
            mb_strlen($message) > $limits['max_message'] ||
            mb_strlen($name)    > $limits['max_name'] ||
            mb_strlen($contact) > $limits['max_contact']
        ) {
            HttpContext::fail(422, 'Invalid input', 'INVALID_INPUT');
        }

        $this->DbContext()
            ->prepare("INSERT INTO {$cfg['table']} (name, contact, message) VALUES (?, ?, ?)")
            ->execute([$name, $contact, $message]);

        HttpContext::json(['ok' => true], 201);
    }

    /**
     * Fetches a paginated, searchable list of reviews for the admin dashboard.
     *
     * @Route("GET /admin/reviews")
     * @Authorize
     *
     * @param int    $page     (Query) Default 1.
     * @param int    $per_page (Query) Default 20, Max 100.
     * @param string $q        (Query) Optional search term.
     *
     * @return 200 { "ok": true, "items": [...], "page": int, "per_page": int, "total": int, "total_pages": int }
     *
     * @throws 401 { "ok": false, "error": "Unauthorized" }
     * @throws 422 { "ok": false, "error": "...", "code": "INVALID_INPUT" }
     * @throws 500 { "ok": false, "error": "Server error", "code": "INTERNAL_ERROR" }
     */
    public function index(): void
    {
        Guard::requireAdmin($this->config);

        $cfg    = $this->config['features']['reviews'];
        $paging = $cfg['admin'];
        $table  = $cfg['table'];

        $rawSearch = $_GET['q'] ?? '';
        if (!is_string($rawSearch)) HttpContext::fail(422, 'Invalid search query', 'INVALID_INPUT');
        
        $search = trim($rawSearch);
        if (mb_strlen($search) > $paging['max_search']) {
            HttpContext::fail(422, 'Search query is too long', 'INVALID_INPUT');
        }

        $rawPage    = $_GET['page'] ?? '1';
        $rawPerPage = $_GET['per_page'] ?? (string) $paging['default_per_page'];
        
        if (!is_string($rawPage) || !ctype_digit($rawPage) || !is_string($rawPerPage) || !ctype_digit($rawPerPage)) {
            HttpContext::fail(422, 'Invalid pagination parameters', 'INVALID_INPUT');
        }

        $page    = max(1, min(100000, (int) $rawPage));
        $perPage = max(1, min($paging['max_per_page'], (int) $rawPerPage));

        $where = '';
        $searchParams = [];
        if ($search !== '') {
            $escaped = str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $search);
            $pattern = '%' . $escaped . '%';
            $where = " WHERE (name ILIKE ? ESCAPE '!' OR contact ILIKE ? ESCAPE '!' OR message ILIKE ? ESCAPE '!')";
            $searchParams = [$pattern, $pattern, $pattern];
        }

        $pdo = $this->DbContext();
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM {$table}{$where}");
        $countStmt->execute($searchParams);
        $total = (int) $countStmt->fetchColumn();

        $totalPages = max(1, (int) ceil($total / $perPage));
        $page       = min($page, $totalPages);
        $offset     = ($page - 1) * $perPage;

        $stmt = $pdo->prepare(
            "SELECT id, name, contact, message, created_at
             FROM {$table}{$where}
             ORDER BY created_at DESC, id DESC
             LIMIT ? OFFSET ?"
        );
        
        foreach ($searchParams as $index => $value) {
            $stmt->bindValue($index + 1, $value, PDO::PARAM_STR);
        }
        $stmt->bindValue(count($searchParams) + 1, $perPage, PDO::PARAM_INT);
        $stmt->bindValue(count($searchParams) + 2, $offset, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll();
        foreach ($rows as &$row) {
            $row['id'] = (int) $row['id'];
        }
        unset($row);

        HttpContext::json([
            'ok'          => true,
            'items'       => $rows,
            'page'        => $page,
            'per_page'    => $perPage,
            'total'       => $total,
            'total_pages' => $totalPages,
        ]);
    }

    /**
     * Deletes a batch of reviews by their IDs.
     *
     * @Route("POST /admin/reviews/delete")
     * @Authorize
     *
     * @param int[] $ids (Body) Array of review IDs to delete (Max 100).
     *
     * @return 200 { "ok": true, "deleted": int }
     *
     * @throws 401 { "ok": false, "error": "Unauthorized" }
     * @throws 422 { "ok": false, "error": "Invalid input", "code": "INVALID_INPUT" }
     * @throws 500 { "ok": false, "error": "Server error", "code": "INTERNAL_ERROR" }
     */
    public function destroy(): void
    {
        Guard::requireAdmin($this->config);

        $cfg = $this->config['features']['reviews'];
        $ids = HttpContext::readBody()['ids'] ?? null;

        if (!is_array($ids) || !array_is_list($ids) || $ids === [] || count($ids) > $cfg['admin']['max_delete_batch']) {
            HttpContext::fail(422, 'Invalid input', 'INVALID_INPUT');
        }

        $clean = [];
        foreach ($ids as $id) {
            if (!is_int($id) || $id < 1 || $id > 2147483647) HttpContext::fail(422, 'Invalid input', 'INVALID_INPUT');
            $clean[$id] = $id;
        }
        $clean = array_values($clean);

        $marks = implode(',', array_fill(0, count($clean), '?'));
        $stmt  = $this->DbContext()->prepare("DELETE FROM {$cfg['table']} WHERE id IN ($marks)");
        
        foreach ($clean as $i => $id) {
            $stmt->bindValue($i + 1, $id, PDO::PARAM_INT);
        }
        $stmt->execute();

        HttpContext::json(['ok' => true, 'deleted' => $stmt->rowCount()]);
    }
}