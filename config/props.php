<?php

	return [
        'fieldsets' => function () {
            return $this->formMethod()->fields()->toArray();
        },
        'fields' => function () {
            return $this->formMethod()->values();
        },
        'levels' => function ($value = 10) {
            return $value;
        },
        'value' => function($value = false) {
            return $this->valueMethod(Yaml::decode($value));
        },
        'pages' => function ($value = []) {
            return array_merge([
                'query' => 'site.pages',
                'search' => true,
                'selected' => []
            ], $value);
        },
        'files' => function ($value = []) {
            return array_merge([
                'query' => 'site.files.add(site.index.files)',
                'search' => true,
                'selected' => []
            ], $value);
        },
        'whitelist' => function() {
            return [
                ...option('beluga.tiller.whitelist'),
                ...array_keys($this->formMethod()->fields()->toArray())
            ];
        }
	];