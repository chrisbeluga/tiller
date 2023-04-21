<?php

	return [
		'fields' => function () {
			if (empty($this->fields) === true) {
				throw new Exception('Please provide some fields for the tiller field');
			}
			return $this->formMethod()->values();
		},
		'fieldsets' => function () {
			if (empty($this->fields) === true) {
				throw new Exception('Please provide some fieldsets for the tiller field');
			}
			return $this->formMethod()->fields()->toArray();
		},
		'value' => function () {
			$data = Data::decode($this->value, 'yaml');
			if (empty($data) === true) {
				return [];
			}
			return $this->tillerMethod($data);
		},
        'whitelist' => function() {
            return [
                ...kirby()->option('beluga.tiller.whitelist'),
                ...array_keys($this->formMethod()->fields()->toArray()),
            ];
        }
	];