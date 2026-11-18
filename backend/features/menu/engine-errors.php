<?php

final class MenuEngineException extends RuntimeException
{
    public function __construct(
        public readonly int $status,
        public readonly string $errorCode,
        string $message,
        public readonly array $issues = [],
    ) {
        parent::__construct($message);
    }

    public static function invalidJson(): self
    {
        return new self(422, 'INVALID_JSON', 'The body must be a JSON object');
    }

    public static function invalidMenu(array $issues): self
    {
        return new self(422, 'INVALID_MENU', 'The menu has problems', $issues);
    }

    public static function preconditionRequired(): self
    {
        return new self(428, 'PRECONDITION_REQUIRED', 'Send If-Match with the ETag of the menu you loaded');
    }

    public static function preconditionFailed(): self
    {
        return new self(412, 'PRECONDITION_FAILED', 'The menu changed since you loaded it. Reload and apply your changes again.');
    }

    public static function storage(string $reason): self
    {
        error_log('MenuEngine storage: ' . $reason);
        return new self(500, 'INTERNAL_ERROR', 'Server error');
    }

    public static function engineBug(array $issues): self
    {
        error_log('MenuEngine bug: ' . json_encode($issues));
        return new self(500, 'INTERNAL_ERROR', 'Server error');
    }
}
