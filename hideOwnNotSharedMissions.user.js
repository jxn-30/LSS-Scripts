// ==UserScript==
// @name         LSS-Hide-Own-Not-Shared-Missions
// @version      1.0
// @description  Hide all own missions that aren't shared with alliance
// @author       Jan (jxn_30)
// @match        https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

document.head.innerHTML += '<style>#mission_list .panel:not(.panel-success) {display: none;}</style>';
