<?php

    Kirby::plugin('beluga/tiller', [
        'options' => [
            'whitelist' => [
                'uuid',
                'fields',
                'children',
            ]
        ],
        'fields' => [
            'tiller' => [
                'api'       => require_once __DIR__ . '/config/api.php',
                'save'      => require_once __DIR__ . '/config/save.php',
                'props'     => require_once __DIR__ . '/config/props.php',
                'mixins'    => require_once __DIR__ . '/config/mixins.php',
                'methods'   => require_once __DIR__ . '/config/methods.php',
            ]
        ]
    ]);
