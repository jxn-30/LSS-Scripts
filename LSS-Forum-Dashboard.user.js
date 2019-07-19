// ==UserScript==
// @name         LSS-Forum-Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Dashboard-Link im LSS-Forum
// @author       Jan (KBOE2)
// @include      https://forum.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('ol.boxMenu')[0].innerHTML += '<li><a href="/cms/index.php?dashboard/">Dashboard</a></li>';
    $('.menuOverlayItemList .menuOverlayItemSpacer').before('<li class="menuOverlayItem"><span class="menuOverlayItemWrapper"><a href="/cms/index.php?dashboard/" class="menuOverlayItemLink"><span class="menuOverlayItemTitle">Dashboard</span>')
})();
