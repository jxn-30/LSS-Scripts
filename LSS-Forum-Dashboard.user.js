// ==UserScript==
// @name         LSS-Forum-Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Dashboard-Link im LSS-Forum
// @author       Jan (KBOE2)
// @include      https://forum.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('ol.boxMenu')[0].innerHTML += '<li><a href="/cms/index.php?dashboard/">Dashboard</a></li>';
    $('.menuOverlayItemList .menuOverlayItemSpacer').before('<li class="menuOverlayItem"><span class="menuOverlayItemWrapper"><a href="/cms/index.php?dashboard/" class="menuOverlayItemLink"><span class="menuOverlayItemTitle">Dashboard</span>');
    window.location.href === 'https://forum.leitstellenspiel.de/cms/index.php?dashboard/' && document.querySelector('.sidebar .containerContent').insertAdjacentHTML('beforeend', `<dt>Likes per Post</dt><dd>${(parseInt(document.querySelector('.sidebar .containerContent dd:nth-of-type(2)').innerText.replace(/\D+/g, '')) / parseInt(document.querySelector('.sidebar .containerContent dd:nth-of-type(1)').innerText.replace(/\D+/g, ''))).toFixed(4)}</dd>`);
})();
