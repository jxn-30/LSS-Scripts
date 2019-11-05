// ==UserScript==
// @name         LSS-Forum-Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Dashboard-Link im LSS-Forum
// @author       Jan (KBOE2)
// @include      https://forum.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const active = window.location.href === 'https://forum.leitstellenspiel.de/cms/index.php?dashboard/' ? 'active' : null;
    $('ol.boxMenu')[0].innerHTML += `<li class="${active}"><a href="/cms/index.php?dashboard/">Dashboard</a></li>`;
    $('.menuOverlayItemList .menuOverlayItemSpacer').before(`<li class="menuOverlayItem ${active}"><span class="menuOverlayItemWrapper"><a href="/cms/index.php?dashboard/" class="menuOverlayItemLink"><span class="menuOverlayItemTitle">Dashboard</span>`);
    active && document.querySelector('.sidebar .containerContent').insertAdjacentHTML('beforeend', `<dt>Likes per Post</dt><dd>${(parseInt(document.querySelector('.sidebar .containerContent dd:nth-of-type(2)').innerText.replace(/\D+/g, '')) / parseInt(document.querySelector('.sidebar .containerContent dd:nth-of-type(1)').innerText.replace(/\D+/g, ''))).toFixed(4)}</dd>`);
})();
