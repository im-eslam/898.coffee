<?php
if (php_sapi_name() !== 'cli') {
    http_response_code(404);
    exit;
}

define('API_ENTRY', true);

require __DIR__ . '/../core/autoloader.php';
Autoloader::register(dirname(__DIR__));

Env::load(dirname(__DIR__) . '/.env');
$config = require __DIR__ . '/../appsettings.php';

echo "Connecting to Neon DB...\n";

try {
    $db = DbContext::connect($config['db']);
    echo "Connection successful.\n\n";

    $files = glob(__DIR__ . '/../features/*/schema.sql');
    
    if (empty($files)) {
        echo "No schema.sql files found.\n";
        exit;
    }

    foreach ($files as $file) {
        $featureName = basename(dirname($file));
        echo "Running migration for feature: [$featureName]...\n";
        
        $sql = file_get_contents($file);
        $db->exec($sql);
        
        echo " -> Success.\n";
    }

    echo "\nAll migrations completed successfully.\n";

} catch (Throwable $e) {
    die("\nMigration failed: " . $e->getMessage() . "\n");
}