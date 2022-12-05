<?php

	 use Kirby\Form\Form;

	return [
        'valueMethod' => function ($items) {
            $pages = [];
            foreach($items as $item) {
                $children = [];
                if(isset($item['children']) && count($item['children'])) {
                    array_push($children,
                        ...$this->valueMethod($item['children'])
                    );
                }
                $item = kirby()->site()->find($item['uuid']);
                array_push($pages, [
                    'id' => Str::random(16),
                    'uuid' => $item->uuid()->toString(),
                    'link' => $item->panel()->url(true),
                    'title' => $item->title()->value(),
                    'url' => $item->url(),
                    'image' => $item->panel()->image(),
                    'children' => $children,
                    'fields' => $this->formMethod()->values()
                ]);
            }
            return $pages;
        },
        'saveMethod' => function ($array) {
            foreach($array as $key => $val) {
                if(is_int($key) || in_array($key, $this->whitelist)) {
                    if(is_array($val) && count($val) > 0) {
                        $array[$key]
                        = $this->saveMethod($val, $this->whitelist);
                    }
                    continue;
                }
                unset($array[$key]);
            }
            return $array;
        },
        'formMethod' => function (array $values = []) {
            return new Form([
                'values' => $values,
                'model'  => $this->model,
                'fields' => $this->attrs['fields']
            ]);
        },
        'pageMethod' => function($page) {
            $params = array_replace($this->pages() ?? [], [
                'model' => $page
            ]);
            return $page->panel()->pickerData($params);
        },
        'fileMethod' => function ($file) {
            $params = array_replace($this->files() ?? [], [
                'model' => $file
            ]);
            return $file->panel()->pickerData($params);
        },
    ];
