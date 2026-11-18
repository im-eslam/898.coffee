<?php
class Autoloader {
    private static array $map = [];

public static function register(string $root): void {
    foreach (['core', 'features'] as $dir) {
        $path = "$root/$dir";
        if (!is_dir($path)) continue;

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)
        );
        foreach ($files as $file) {
            if ($file->getExtension() !== 'php') continue;

            $name = $file->getBasename('.php');

            if ($name === 'config') continue;

            $class = str_replace('-', '', ucwords($name, '-'));

            if (isset(self::$map[$class])) {
                throw new RuntimeException("Autoloader: class '$class' defined in both '"
                    . self::$map[$class] . "' and '" . $file->getPathname() . "'");
            }

            self::$map[$class] = $file->getPathname();
        }
    }
    spl_autoload_register(fn(string $class) => isset(self::$map[$class]) ? require_once self::$map[$class] : null);
}
}