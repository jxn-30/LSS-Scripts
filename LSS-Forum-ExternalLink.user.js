// ==UserScript==
// @name         LSS-Forum-ExternalLink
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Externe Links automatisch standardmäßig in neuem Tab / Fenster öffnen
// @author       Jan (KBOE2)
// @include      https://forum.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('a').forEach(el => !el.href.match(/(^https:\/\/forum.leitstellenspiel.de)|(^javascript:)/) && el.setAttribute('target', '_blank'));
})();
