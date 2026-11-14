<?php

return [
    'name' => 'menu',

    'settings' => [
        'storage' => [
            'menu_file'    => __DIR__ . '/../../storage/menu.json',
            'backup_dir'   => __DIR__ . '/../../storage/backups',
            'backups_kept' => 30,
        ],

        'max_body_bytes' => 1024 * 1024,  
    ],

    'routes' => [
        'GET /menu'       => [MenuController::class, 'get'],
        'PUT /admin/menu' => [MenuController::class, 'update'],
    ],
];
