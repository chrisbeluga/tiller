<?php

	return function () {
		return [
			[
				'pattern' => '/pages',
				'method' => 'GET',
				'action' => function () {
					$params = array_replace($this->field()->pages(), [
						'page' => $this->requestQuery('page'),
						'parent' => $this->requestQuery('parent'),
						'search' => $this->requestQuery('search')
					]);
					return $this->field()->pagepicker($params);
				}
			],
			[
				'pattern' => '/files',
				'method' => 'GET',
				'action' => function () {
					$params = array_replace($this->field()->files(), [
						'page' => $this->requestQuery('page'),
						'search' => $this->requestQuery('search'),
					]);
					return $this->field()->filepicker($params);
				}
			]
		];
	};