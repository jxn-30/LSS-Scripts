// ==UserScript==
// @name         LSS-Forum-ExternalLink
// @version      1.0.2
// @description  Externe Links automatisch standardmäßig in neuem Tab / Fenster öffnen
// @author       Jan (jxn_30)
// @include      https://forum.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', e => e.target.closest('.externalURL')?.setAttribute('target', '_blank'))
})();
