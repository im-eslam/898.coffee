<?php

final class MenuEtag
{
    public static function of(string $raw): string
    {
        return '"' . md5($raw) . '"';
    }
}

final class MenuSnapshot
{
    public function __construct(
        public readonly string $raw,
        public readonly string $etag,
        public readonly array $document,
    ) {}
}

final class MenuUpdateResult
{
    public function __construct(
        public readonly string $etag,
        public readonly array $menu,
        public readonly array $warnings,
    ) {}
}
