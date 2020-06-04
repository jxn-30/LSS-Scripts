// ==UserScript==
// @name         LSS-Browsertitle
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Heading als Titel im Browser
// @author       Jan (KBOE2)
// @include      https://www.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let heading = document.querySelector('h1, h2, h3, h4, h5, h6');
    if (!heading) heading = '';
    else {
        heading = heading.textContent
            .trim()
            .replace(/\n/g, ' ')
            .replace(/ {2,}/g, ' ');
        let navbarBrand = document.querySelector('.navbar-brand');
        if (navbarBrand && navbarBrand.textContent.trim())
            heading = `${navbarBrand.textContent.trim()}: ${heading}`;
        if (window.location !== window.parent.location)
            heading = `[${heading}] `;
        else heading = `${heading} | `;
    }
    window.tellParent(
        `document.title = '${heading}Leitstellenspiel.de';`
    );
    const lightboxCloseOrig = lightboxClose;
    lightboxClose = (...args) => {
        lightboxCloseOrig(...args);
        document.title = `${heading}Leitstellenspiel.de`;
    };
})();
