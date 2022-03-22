// ==UserScript==
// @name         LSS kein Hintergrund bei Bewerbung
// @description  Removes the green background on alliance applications
// @version      1.0
// @author       Jan (jxn_30)
// @match        https://www.leitstellenspiel.de/
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`.alliance_apply_new{background: unset !important;}`)
