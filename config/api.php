<?php

	return function () {
		return [
			[
				'pattern' => '/validate',
				'method'  => 'ALL',
				'action'  => function () {
					return array_values($this->field()->formMethod($this->requestBody())->errors());
				}
			],
			[
				'pattern' => '/pages',
				'method' => 'GET',
				'action' => function () {
					$data = array_replace($this->field()->pages(), [
						'page' => $this->requestQuery('page'),
						'parent' => $this->requestQuery('parent'),
						'search' => $this->requestQuery('search')
					]);
					return $this->field()->pagepicker($data);
				}
			],
			[
				'pattern' => '/files',
				'method' => 'GET',
				'action' => function () {
					$data = array_replace($this->field()->files(), [
						'page' => $this->requestQuery('page'),
						'search' => $this->requestQuery('search'),
					]);
					return $this->field()->filepicker($data);
				}
			]
		];
	};