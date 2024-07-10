// ==UserScript==
// @name            [LSS] Forum: External Links
// @namespace       https://jxn.lss-manager.de
// @version         2024.07.10+1404
// @author          Jan (jxn_30)
// @description     Opens external links in the Forum in a new tab / window by default
// @description:de  Externe Links automatisch standardmäßig in neuem Tab / Fenster öffnen
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/forum/customNavbar.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/forum/customNavbar.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/17423-forum-external-link/
// @match           https://forum.leitstellenspiel.de/*
// @run-at          document-idle
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Forum: External Links
 * @description Opens external links in the Forum in a new tab / window by default
 * @description:de Externe Links automatisch standardmäßig in neuem Tab / Fenster öffnen
 * @forum https://forum.leitstellenspiel.de/index.php?thread/26726-script-forum-navigationsleiste-anpassen/
 * @match /*
 * @locale de_DE
 * @subdomain forum
 * @grant GM_addStyle
 */

const SHOW_ZUM_SPIEL_LINK = false;
const SHOW_FACEBOOK_LINK = false;
const SHOW_INSTAGRAM_LINK = false;
const SHOW_TIKTOK_LINK = false;

/** @type {string[]} */
const selectors = [];
if (!SHOW_ZUM_SPIEL_LINK) {
    selectors.push('a[href^="https://www.leitstellenspiel.de"]');
}
if (!SHOW_FACEBOOK_LINK) {
    selectors.push('a[href^="https://www.facebook.com"]');
}
if (!SHOW_INSTAGRAM_LINK) {
    selectors.push('a[href^="https://www.instagram.com"]');
}
if (!SHOW_TIKTOK_LINK) {
    selectors.push('a[href^="https://www.tiktok.com"]');
}

const fullSelector = `.mainMenu ol :where(${selectors.join(',')})`;

GM_addStyle(`
${fullSelector} {
    display: none;
}
`);

(() => document.querySelectorAll(fullSelector).forEach(el => el.remove()))();
