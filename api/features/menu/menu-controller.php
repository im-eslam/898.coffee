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
