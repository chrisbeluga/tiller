<?php

	return [
        'fields' => function() {
            return $this->fields;
        },
        'fieldsets' => function() {
            return $this->fieldsets;
        },
        'pages' => function($data = []) {
            return array_merge([
                'query' => 'site.pages',
                'search' => true,
                'selected' => []
            ], $data);
        },
        'files' => function($data = []) {
            return array_merge([
                'query' => 'site.files.add(site.index.files)',
                'search' => true,
                'selected' => []
            ], $data);
        },
	];