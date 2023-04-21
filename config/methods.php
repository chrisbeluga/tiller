<?php

    use Kirby\Cms\App;
	use Kirby\Form\Form;

	return [
        'formMethod' => function ($data = []) {
            return new Form([
                'values' => $data,
                'model'  => $this->model,
                'fields' => $this->attrs['fields']
            ]);
        },
        'tillerMethod' => function ($data = []) {
            $pages = [];
            if(empty($data) === true) {
                return [];
            }
            foreach($data as $item) {
                $children = [];
                if (empty($item['children']) === false) {
                    array_push($children,
                        ...$this->tillerMethod($item['children'])
                    );
                }
                $page = kirby()->site()->find($item['uuid']);
                array_push($pages, [
                    'id' => Str::random(16),
                    'uuid' => $page->uuid()->toString(),
                    'link' => $page->panel()->url(true),
                    'title' => $page->title()->value(),
                    'url' => $page->url(),
                    'image' => $page->panel()->image(),
                    'children' => $children,
                    'fields' => $this->formMethod($item['fields'])->values()
                ]);
            }
            return $pages;
        },
        'saveMethod' => function($data) {
            foreach($data as $key => $val) {
                if(is_int($key) || in_array($key, $this->whitelist)) {
                    if(is_array($val) && count($val) > 0) {
                        $data[$key] = $this->saveMethod($val, $this->whitelist);
                    }
                    continue;
                }
                unset($data[$key]);
            }
            return $data;
        }
    ];
