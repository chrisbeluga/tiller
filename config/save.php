<?php

	return function ($data) {
        return $this->saveMethod($data,
            option('beluga.tiller.whitelist')
        );
    };