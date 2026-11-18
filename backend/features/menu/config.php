<?php

$menuSource = __DIR__ . '/../../storage/menu.json';
$isServerless = getenv('VERCEL') !== false || is_dir('/var/task');
$writable = $isServerless
    ? sys_get_temp_dir() . '/898-menu'
    : __DIR__ . '/../../storage';

if (!is_dir($writable) && !mkdir($writable, 0755, true) && !is_dir($writable)) {
    $writable = sys_get_temp_dir();
}

$menuFile = $writable . '/menu.json';
if (!is_file($menuFile) && is_readable($menuSource)) {
    @copy($menuSource, $menuFile);
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