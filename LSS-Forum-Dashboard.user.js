// ==UserScript==
// @name         LSS-Forum-Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Jan (KBOE2)
// @include      https://forum.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('ol.boxMenu').append('<li><a href="https://forum.leitstellenspiel.de/cms/index.php?dashboard/">Dashboard</a></li>');
})();
