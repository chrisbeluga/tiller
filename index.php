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
                'api'       => require_once __DIR__ . '/config/extensions/api.php',
                'save'      => require_once __DIR__ . '/config/extensions/save.php',
                'props'     => require_once __DIR__ . '/config/extensions/props.php',
                'mixins'    => require_once __DIR__ . '/config/extensions/mixins.php',
                'methods'   => require_once __DIR__ . '/config/extensions/methods.php',
                'computed'   => require_once __DIR__ . '/config/extensions/computed.php',
                //'validations'   => require_once __DIR__ . '/config/extensions/validations.php',
            ]
        ]
    ]);
