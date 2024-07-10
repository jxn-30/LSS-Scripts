// ==UserScript==
// @name            [LSS] Forum: Custom Navbar
// @namespace       https://jxn.lss-manager.de
// @version         2024.07.10+1411
// @author          Jan (jxn_30)
// @description     Allows to remove some unnecessary links from the forum navbar
// @description:de  Ermöglicht das Entfernen einiger unnötiger Links aus der Foren-Navigationsleiste
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/forum/customNavbar.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/forum/customNavbar.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/26726-script-forum-navigationsleiste-anpassen/
// @match           https://forum.leitstellenspiel.de/*
// @run-at          document-idle
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Forum: Custom Navbar
 * @description Allows to remove some unnecessary links from the forum navbar
 * @description:de Ermöglicht das Entfernen einiger unnötiger Links aus der Foren-Navigationsleiste
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
