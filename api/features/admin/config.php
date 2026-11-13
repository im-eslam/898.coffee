<?php

return [
    'name' => 'admin',
    
    'settings' => [
        'table' => 'admin_users',
        'session'      => ['name' => '898_sid', 'idle' => 2 * 60 * 60, 'absolute' => 12 * 60 * 60],
        'login_limit'  => ['max' => 5, 'window' => 15 * 60],
        'reauth_limit' => ['max' => 5, 'window' => 15 * 60],
        
        'languages'        => ['en', 'ar'],
        'username_pattern' => '/^[a-z0-9._-]{3,50}$/',
        'password'         => ['min' => 10, 'max' => 72, 'current_max' => 72],
    ],

    'routes' => [
        'POST /admin/login'             => [LoginController::class, 'login'],
        'POST /admin/logout'            => [LoginController::class, 'logout'],
        'GET /admin/me'                 => [LoginController::class, 'me'],
        'POST /admin/settings/language' => [ProfileController::class, 'language'],
        'POST /admin/settings/username' => [ProfileController::class, 'username'],
        'POST /admin/settings/password' => [ProfileController::class, 'password'],
    ]
];