// ==UserScript==
// @name            [LSS] Lightbox-Lightbox
// @namespace       https://jxn.lss-manager.de
// @version         2023.11.11+1223
// @author          Jan (jxn_30)
// @description     Allows opening a lightbox on all sites of the game
// @description:de  Erlaubt es, eine Lightbox auf allen Seiten des Spiels zu öffnen
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/lightboxLightbox.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/lightboxLightbox.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/18588-script-lightbox-in-lightbox-in-lightbox-in/
// @match           https://www.operacni-stredisko.cz/*
// @match           https://policie.operacni-stredisko.cz/*
// @match           https://www.alarmcentral-spil.dk/*
// @match           https://politi.alarmcentral-spil.dk/*
// @match           https://www.leitstellenspiel.de/*
// @match           https://polizei.leitstellenspiel.de/*
// @match           https://www.missionchief-australia.com/*
// @match           https://police.missionchief-australia.com/*
// @match           https://www.missionchief.co.uk/*
// @match           https://police.missionchief.co.uk/*
// @match           https://www.missionchief.com/*
// @match           https://police.missionchief.com/*
// @match           https://www.centro-de-mando.es/*
// @match           https://www.centro-de-mando.mx/*
// @match           https://www.hatakeskuspeli.com/*
// @match           https://poliisi.hatakeskuspeli.com/*
// @match           https://www.operateur112.fr/*
// @match           https://police.operateur112.fr/*
// @match           https://www.operatore112.it/*
// @match           https://polizia.operatore112.it/*
// @match           https://www.missionchief-japan.com/*
// @match           https://www.missionchief-korea.com/*
// @match           https://www.nodsentralspillet.com/*
// @match           https://politiet.nodsentralspillet.com/*
// @match           https://www.meldkamerspel.com/*
// @match           https://politie.meldkamerspel.com/*
// @match           https://www.operatorratunkowy.pl/*
// @match           https://policja.operatorratunkowy.pl/*
// @match           https://www.operador193.com/*
// @match           https://www.jogo-operador112.com/*
// @match           https://policia.jogo-operador112.com/*
// @match           https://www.jocdispecerat112.com/*
// @match           https://www.dispetcher112.ru/*
// @match           https://www.dispecerske-centrum.com/*
// @match           https://www.larmcentralen-spelet.se/*
// @match           https://polis.larmcentralen-spelet.se/*
// @match           https://www.112-merkez.com/*
// @match           https://www.dyspetcher101-game.com/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Lightbox-Lightbox
 * @description Allows opening a lightbox on all sites of the game
 * @description:de Erlaubt es, eine Lightbox auf allen Seiten des Spiels zu öffnen
 * @forum https://forum.leitstellenspiel.de/index.php?thread/18588-script-lightbox-in-lightbox-in-lightbox-in/
 */

/* global lightboxClose */

(function () {
    'use strict';

    if (
        document.getElementById('lightbox_background') ||
        (window.frameElement &&
            !window.frameElement.src?.startsWith('https://'))
    ) {
        return;
    }
    const bg = document.createElement('div');
    bg.id = 'lightbox_background';
    bg.addEventListener('click', lightboxClose);
    const box = document.createElement('div');
    box.id = 'lightbox_box';
    const close = document.createElement('button');
    close.classList.add('close');
    close.type = 'button';
    close.id = 'lightbox_close';
    const times = document.createElement('span');
    times.innerHTML = '&times;';
    close.appendChild(times);
    close.addEventListener('click', lightboxClose);
    box.appendChild(close);
    document.body.appendChild(bg);
    document.body.appendChild(box);
})();
