// ==UserScript==
// @name         Leitstellenansicht-Nav-toggle
// @version      1.0.1
// @author       Jan (jxn_30)
// @,atch        https://www.leitstellenspiel.de/leitstellenansicht
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.body.innerHTML += `<a class="btn btn-default" style="position: fixed; top: 1rem; right: 1rem; z-index: 10000;" onclick="$('.navbar-fixed-top').toggle()">S/H</a>`
})();
