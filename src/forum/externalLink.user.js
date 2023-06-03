// ==UserScript==
// @name            [LSS] Forum: External Links
// @namespace       https://jxn.lss-manager.de
// @version         2023.06.03+1509
// @author          Jan (jxn_30)
// @description     Opens external links in the Forum in a new tab / window by default
// @description:de  Externe Links automatisch standardmäßig in neuem Tab / Fenster öffnen
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/forum/externalLink.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/forum/externalLink.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/17423-forum-external-link/
// @match           https://forum.leitstellenspiel.de/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Forum: External Links
 * @description Opens external links in the Forum in a new tab / window by default
 * @description:de Externe Links automatisch standardmäßig in neuem Tab / Fenster öffnen
 * @forum https://forum.leitstellenspiel.de/index.php?thread/17423-forum-external-link/
 * @match /*
 * @locale de_DE
 * @subdomain forum
 */

(function () {
    'use strict';

    document.addEventListener('click', e =>
        e.target.closest('.externalURL')?.setAttribute('target', '_blank')
    );
})();
