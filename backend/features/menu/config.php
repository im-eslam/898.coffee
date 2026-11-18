<?php

return [
    'name' => 'menu',

    'settings' => [
        'storage' => [
            'menu_file'    => __DIR__ . '/../../storage/menu.json',
            'backup_dir'   => __DIR__ . '/../../storage/backups',
            'popup_dir'    => __DIR__ . '/../../../public/menu/popup',
            'product_full_dir'  => __DIR__ . '/../../../public/menu/products-full',
            'product_thumb_dir' => __DIR__ . '/../../../public/menu/products-thumb',
            'backups_kept' => 30,
        ],

        'max_body_bytes' => 1024 * 1024,
        'max_image_bytes' => 5 * 1024 * 1024,
    ],

    'routes' => [
        'GET /menu'       => [MenuController::class, 'get'],
        'PUT /admin/menu' => [MenuController::class, 'update'],
        'POST /admin/menu/popup-image' => [MenuController::class, 'uploadPopupImage'],
        'POST /admin/menu/product-image' => [MenuController::class, 'uploadProductImage'],
    ],
];
