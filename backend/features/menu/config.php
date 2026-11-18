<?php

// On Vercel the project folder is read-only; only /tmp is writable.
$bundled = __DIR__ . '/../../storage';
$writable = is_dir($bundled) && is_writable($bundled)
    ? $bundled
    : sys_get_temp_dir() . '/kuji-storage';

if (!is_dir($writable)) {
    @mkdir($writable, 0755, true);
}

// First use on a fresh instance: copy the menu that ships with the code.
$menuFile = $writable . '/menu.json';
if (!file_exists($menuFile) && file_exists($bundled . '/menu.json')) {
    @copy($bundled . '/menu.json', $menuFile);
}

return [
    'name' => 'menu',

    'settings' => [
        'storage' => [
            'menu_file'         => $menuFile,
            'backup_dir'        => $writable . '/backups',
            'popup_dir'         => __DIR__ . '/../../../public/menu/popup',
            'product_full_dir'  => __DIR__ . '/../../../public/menu/products-full',
            'product_thumb_dir' => __DIR__ . '/../../../public/menu/products-thumb',
            'backups_kept'      => 30,
        ],

        'max_body_bytes'  => 1024 * 1024,
        'max_image_bytes' => 5 * 1024 * 1024,
    ],

    'routes' => [
        'GET /menu'                      => [MenuController::class, 'get'],
        'PUT /admin/menu'                => [MenuController::class, 'update'],
        'POST /admin/menu/popup-image'   => [MenuController::class, 'uploadPopupImage'],
        'POST /admin/menu/product-image' => [MenuController::class, 'uploadProductImage'],
    ],
];