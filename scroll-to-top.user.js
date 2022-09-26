// ==UserScript==
// @name         LSS ScrollToTopButtons
// @namespace    https://jxn.lss-manager.de
// @version      1.0.1
// @description  Shows a scroll-to-top button to all scrollable elements
// @author       Jan (jxn_30)
// @match        https://www.operacni-stredisko.cz/*
// @match        https://policie.operacni-stredisko.cz/*
// @match        https://www.alarmcentral-spil.dk/*
// @match        https://politi.alarmcentral-spil.dk/*
// @match        https://www.leitstellenspiel.de/*
// @match        https://polizei.leitstellenspiel.de/*
// @match        https://www.missionchief-australia.com/*
// @match        https://police.missionchief-australia.com/*
// @match        https://www.missionchief.co.uk/*
// @match        https://police.missionchief.co.uk/*
// @match        https://www.missionchief.com/*
// @match        https://police.missionchief.com/*
// @match        https://www.centro-de-mando.es/*
// @match        https://www.centro-de-mando.mx/*
// @match        https://www.hatakeskuspeli.com/*
// @match        https://poliisi.hatakeskuspeli.com/*
// @match        https://www.operateur112.fr/*
// @match        https://police.operateur112.fr/*
// @match        https://www.operatore112.it/*
// @match        https://polizia.operatore112.it/*
// @match        https://www.missionchief-japan.com/*
// @match        https://www.missionchief-korea.com/*
// @match        https://www.nodsentralspillet.com/*
// @match        https://politiet.nodsentralspillet.com/*
// @match        https://www.meldkamerspel.com/*
// @match        https://politie.meldkamerspel.com/*
// @match        https://www.operatorratunkowy.pl/*
// @match        https://policja.operatorratunkowy.pl/*
// @match        https://www.operador193.com/*
// @match        https://www.jogo-operador112.com/*
// @match        https://policia.jogo-operador112.com/*
// @match        https://www.jocdispecerat112.com/*
// @match        https://www.dispetcher112.ru/*
// @match        https://www.dispecerske-centrum.com/*
// @match        https://www.larmcentralen-spelet.se/*
// @match        https://polis.larmcentralen-spelet.se/*
// @match        https://www.112-merkez.com/*
// @match        https://www.dyspetcher101-game.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.scroll-to-top-btn {
    position: sticky;
    bottom: 1em;
    right: 1em;
    z-index: 10000;
    float: right;
}
`);

(function() {
    'use strict';

    document.addEventListener('scroll', e => {
        const target = e.target;
        const targetIsDocument = target instanceof HTMLDocument
        if (!(target instanceof HTMLElement) && !targetIsDocument) return;

        const targetOrDocEl = targetIsDocument ? document.documentElement : target;

        const showScrollToTop = targetOrDocEl.scrollTop > 50;
        let scrollToTopBtn = (targetIsDocument ? document.body : target).querySelector(':scope > .scroll-to-top-btn');
        if (!scrollToTopBtn) {
            scrollToTopBtn = document.createElement('button');
            scrollToTopBtn.classList.add('scroll-to-top-btn', 'btn', 'btn-default');
            scrollToTopBtn.textContent = '↑';
            scrollToTopBtn.addEventListener('click', e => {
                e.preventDefault();
                targetOrDocEl.scrollTo({top: 0, behavior: 'smooth'});
            });
            if (targetIsDocument) document.body.append(scrollToTopBtn);
            else target.append(scrollToTopBtn);
            let translateY = parseFloat(getComputedStyle(targetOrDocEl).paddingBottom);
            if (targetIsDocument && document.querySelector('.navbar-fixed-bottom:not(#navbar-mobile-footer)')) translateY -= 50;
            scrollToTopBtn.style.setProperty('transform', `translateY(${translateY}px)`);
        }
        scrollToTopBtn.classList[showScrollToTop ? 'remove' : 'add']('hidden');
    }, {capture: true})
})();
