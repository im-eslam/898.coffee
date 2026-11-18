<?php

require_once __DIR__ . '/engine.php';

class MenuController extends ControllerBase
{
    /**
     * Returns the full menu as a JSON object.
     *
     * @Route("GET /menu")
     * @AllowAnonymous
     *
     * @return 200 {
     *   "ok": true,
     *   "updatedAt": "string",
     *   "currency": "string",
     *   "badges": ["string"],
     *   "addOns": { "<id>": { "name": { "en": "string", "ar": "string" }, "price": int } },
     *   "categories": [ { "id": "string", "name": { "en": "...", "ar": "..." }, "products": [...] } ],
     *   "signatures": ["string"],
     *   "pairings": [ { "id": "string", "items": ["string"], "pricing": { "price": int, "discount": int, "final": int } } ],
     *   "popup": { "enabled": bool, "image": string|null, "delaySeconds": int }
     * }
     * @header ETag  md5 of the stored file; send it back as If-None-Match to get 304
     *
     * @throws 500 { "ok": false, "error": "Server error", "code": "INTERNAL_ERROR" }
     */
    public function get(): void
    {
        try {
            $snapshot = $this->engine()->read();
        } catch (MenuEngineException $error) {
            $this->sendError($error);
        }

        if ($this->requestEtag() === $snapshot->etag) {
            http_response_code(304);
            header('ETag: ' . $snapshot->etag);
            exit;
        }

        http_response_code(200);
        header('Content-Type: application/json; charset=utf-8');
        header('ETag: ' . $snapshot->etag);
        header('Cache-Control: public, max-age=60, stale-while-revalidate=300');
        echo json_encode(['ok' => true] + $snapshot->document, JSON_UNESCAPED_UNICODE);
        exit;
    }

    /**
     * Replaces the whole menu. The engine validates the document, fills defaults,
     * assigns ids, drops broken references (reported as warnings), computes prices,
     * and writes the file atomically after keeping a backup.
     *
     * @Route("PUT /admin/menu")
     * @Authorize
     *
     * @header If-Match  (Required) The ETag from the last GET /menu or PUT /admin/menu.
     * @param  body      The full menu document as JSON, in the shape of GET /menu.
     *
     * @return 200 { "ok": true, "warnings": [ { "path", "code", "message" } ], ...menu }   ETag header is set
     * @throws 401 UNAUTHORIZED
     * @throws 412 PRECONDITION_FAILED    the menu changed since it was loaded
     * @throws 413 PAYLOAD_TOO_LARGE
     * @throws 415 UNSUPPORTED_MEDIA_TYPE
     * @throws 422 INVALID_JSON           body is not a JSON object
     * @throws 422 INVALID_MENU           { "issues": [ { "path", "code", "message" } ] }
     * @throws 428 PRECONDITION_REQUIRED  If-Match missing
     * @throws 500 INTERNAL_ERROR
     */
    public function update(): void
    {
        Guard::requireAdmin($this->config);

        $settings = $this->menuSettings();
        $body     = HttpContext::readRaw($settings['max_body_bytes']);
        $ifMatch  = trim($_SERVER['HTTP_IF_MATCH'] ?? '');

        try {
            $result = $this->engine()->update($body, $ifMatch);
        } catch (MenuEngineException $error) {
            $this->sendError($error);
        }

        header('ETag: ' . $result->etag);
        HttpContext::json(['ok' => true, 'warnings' => $result->warnings] + $result->menu);
    }

    /**
     * Stores a WebP popup image and returns its generated public filename.
     *
     * @Route("POST /admin/menu/popup-image")
     * @Authorize
     */
    public function uploadPopupImage(): void
    {
        Guard::requireAdmin($this->config);

        $upload = $_FILES['image'] ?? null;
        $settings = $this->menuSettings();
        $maxBytes = $settings['max_image_bytes'];

        if (!is_array($upload) || ($upload['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            HttpContext::fail(422, 'Choose a WebP image to upload', 'INVALID_IMAGE');
        }
        if (!is_int($upload['size'] ?? null) || $upload['size'] < 1 || $upload['size'] > $maxBytes) {
            HttpContext::fail(413, 'Image is too large', 'PAYLOAD_TOO_LARGE');
        }
        if (!is_string($upload['tmp_name'] ?? null) || !is_uploaded_file($upload['tmp_name'])) {
            HttpContext::fail(422, 'Invalid image upload', 'INVALID_IMAGE');
        }

        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($upload['tmp_name']);
        if ($mime !== 'image/webp') {
            HttpContext::fail(415, 'Only WebP images are supported', 'UNSUPPORTED_IMAGE_TYPE');
        }

        $directory = $settings['storage']['popup_dir'];
        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            HttpContext::fail(500, 'Unable to prepare image storage', 'INTERNAL_ERROR');
        }

        try {
            $filename = bin2hex(random_bytes(16)) . '.webp';
        } catch (Throwable) {
            HttpContext::fail(500, 'Unable to create image name', 'INTERNAL_ERROR');
        }

        if (!move_uploaded_file($upload['tmp_name'], $directory . DIRECTORY_SEPARATOR . $filename)) {
            HttpContext::fail(500, 'Unable to store image', 'INTERNAL_ERROR');
        }

        HttpContext::json(['ok' => true, 'image' => $filename]);
    }

    private function engine(): MenuEngine
    {
        return MenuEngine::fromConfig($this->menuSettings()['storage']);
    }

    private function menuSettings(): array
    {
        return $this->config['features']['menu'];
    }

    private function requestEtag(): string
    {
        return $_SERVER['HTTP_IF_NONE_MATCH'] ?? '';
    }

    private function sendError(MenuEngineException $error): never
    {
        $payload = ['ok' => false, 'error' => $error->getMessage(), 'code' => $error->errorCode];
        if ($error->issues !== []) {
            $payload['issues'] = $error->issues;
        }
        HttpContext::json($payload, $error->status);
    }
}
