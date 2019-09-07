// ==UserScript==
// @name         LSS-Browsertitle
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Heading als Titel im Browser
// @author       Jan (KBOE2)
// @include      https://www.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let heading = $($('h1, h2, h3, h4, h5, h6')[0]).text().trim();
    $('title').html(`${heading ? `${heading} | ` : ''}Leitstellenspiel.de`);
})();
