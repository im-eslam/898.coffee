<?php

final class MenuIssues
{
    private array $errors = [];
    private array $warnings = [];

    public function error(string $path, string $code, string $message): void
    {
        $this->errors[] = ['path' => $path, 'code' => $code, 'message' => $message];
    }

    public function warning(string $path, string $code, string $message): void
    {
        $this->warnings[] = ['path' => $path, 'code' => $code, 'message' => $message];
    }

    public function hasErrors(): bool
    {
        return $this->errors !== [];
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public function warnings(): array
    {
        return $this->warnings;
    }
}
