// ==UserScript==
// @name            [LSS] Browsertitle
// @name:de         [LSS] Browsertitel
// @namespace       https://jxn.lss-manager.de
// @version         2023.06.03+1511
// @author          Jan (jxn_30)
// @description     [Currently DE only] Shows the current page as title in the browser
// @description:de  Zeigt die aktuelle Seite als Titel im Browser an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/browsertitle.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/browsertitle.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/16784-script-browsertitle/
// @match           https://www.leitstellenspiel.de/*
// @match           https://polizei.leitstellenspiel.de/*
// @run-at          document-idle
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name Browsertitle
 * @name:de Browsertitel
 * @description [Currently DE only] Shows the current page as title in the browser
 * @description:de Zeigt die aktuelle Seite als Titel im Browser an
 * @forum https://forum.leitstellenspiel.de/index.php?thread/16784-script-browsertitle/
 * @locale de_DE
 * @grant unsafeWindow
 */

(function () {
    'use strict';

    let heading = document.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading || unsafeWindow.location.pathname === '/') heading = '';
    else {
        heading = heading.textContent
            .trim()
            .replace(/\n/g, ' ')
            .replace(/ {2,}/g, ' ');
        const navbarBrand = document.querySelector('.navbar-brand');
        if (navbarBrand && navbarBrand.textContent.trim()) {
            heading = `${navbarBrand.textContent.trim()}: ${heading}`;
        }
        if (unsafeWindow.location !== unsafeWindow.parent.location) {
            heading = `[${heading}] `;
        } else heading = `${heading} | `;
    }
    unsafeWindow.tellParent(
        `document.title = '${heading}Leitstellenspiel.de';`
    );
    const lightboxCloseOrig = unsafeWindow.lightboxClose;
    unsafeWindow.lightboxClose = (...args) => {
        lightboxCloseOrig(...args);
        document.title = `${heading}Leitstellenspiel.de`;
    };
})();
