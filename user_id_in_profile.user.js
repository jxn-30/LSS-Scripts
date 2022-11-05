// ==UserScript==
// @name         LSS-User-Id in profile
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  shows user_id of user in each profile
// @author       Jan (jxn_30)
// @match        https://www.leitstellenspiel.de/profile/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var userId = 'Couldnt filter User-Id';
    if($('a[href*="freunde"]')[0]){
        userId = $('a[href*="freunde"]')[0].href.replace(/.*=/, '');
    } else {
        userId = user_id;
    }
    $('h1')[0].innerHTML += ' <small>(' + userId + ')</small>';
})();
