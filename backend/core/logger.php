<?php
final class Log
{
    private static function file(): string
    {
        return __DIR__ . '/../storage/logs/app.log';
    }

    public static function write(string $level, string $message, array $context = []): void
    {
        $dir = dirname(self::file());
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }

        $line = sprintf(
            "[%s] %s %s %s | %s%s",
            date('Y-m-d H:i:s'),
            strtoupper($level),
            $_SERVER['REQUEST_METHOD'] ?? 'CLI',
            $_SERVER['REQUEST_URI'] ?? '-',
            $message,
            $context ? ' ' . json_encode($context, JSON_UNESCAPED_UNICODE) : ''
        );

        if (@file_put_contents(self::file(), $line . PHP_EOL, FILE_APPEND | LOCK_EX) === false) {
            error_log($line); // fallback if the file can't be written
        }
    }

    public static function warning(string $message, array $context = []): void
    {
        self::write('warning', $message, $context);
    }

    public static function error(string $message, array $context = []): void
    {
        self::write('error', $message, $context);
    }

    public static function exception(Throwable $e): void
    {
        self::error(
            get_class($e) . ': ' . $e->getMessage(),
            ['file' => $e->getFile() . ':' . $e->getLine()]
        );
    }

    /** Catches PHP warnings, notices and fatal errors that would otherwise go unseen. */
    public static function register(): void
    {
        set_error_handler(function (int $no, string $msg, string $file, int $line): bool {
            if (!(error_reporting() & $no)) {
                return false;
            }
            $warnings = [E_WARNING, E_USER_WARNING, E_NOTICE, E_USER_NOTICE, E_DEPRECATED, E_USER_DEPRECATED];
            self::write(in_array($no, $warnings, true) ? 'warning' : 'error', $msg, ['file' => $file . ':' . $line]);
            return false; // let PHP keep its normal behaviour
        });

        register_shutdown_function(function () {
            $e = error_get_last();
            if ($e && in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
                self::error('FATAL: ' . $e['message'], ['file' => $e['file'] . ':' . $e['line']]);
            }
        });
    }
}