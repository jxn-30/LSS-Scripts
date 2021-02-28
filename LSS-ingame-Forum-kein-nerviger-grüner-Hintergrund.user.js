// ==UserScript==
// @name         LSS-Ingame-Forum-kein-nerviger-grüner-Hintergrund
// @version      1.0
// @description  Avoids the green background to be set at the alliance dropdown when amount of unread Forum posts changes
// @author       Jan (jxn_30)
// @match        https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

document.head.innerHTML += `<style>.alliance_forum_new{background: unset !important;}</style>`
