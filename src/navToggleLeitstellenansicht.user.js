// ==UserScript==
// @name         [LSS] Leitstellenansicht Nav-toggle
// @namespace    https://jxn.lss-manager.de
// @version      2023.06.03+1512
// @author       Jan (jxn_30)
// @description  Adds a button to show/hide navbar in Leitstellenansicht
// @homepage     https://github.com/jxn-30/LSS-Scripts
// @homepageURL  https://github.com/jxn-30/LSS-Scripts
// @icon         https://www.leitstellenspiel.de/favicon.ico
// @updateURL    https://github.com/jxn-30/LSS-Scripts/raw/master/src/navToggleLeitstellenansicht.user.js
// @downloadURL  https://github.com/jxn-30/LSS-Scripts/raw/master/src/navToggleLeitstellenansicht.user.js
// @supportURL   https://github.com/jxn-30/LSS-Scripts
// @match        https://www.operacni-stredisko.cz/leitstellenansicht
// @match        https://www.operacni-stredisko.cz/statusoverzicht
// @match        https://policie.operacni-stredisko.cz/leitstellenansicht
// @match        https://policie.operacni-stredisko.cz/statusoverzicht
// @match        https://www.alarmcentral-spil.dk/leitstellenansicht
// @match        https://www.alarmcentral-spil.dk/statusoverzicht
// @match        https://politi.alarmcentral-spil.dk/leitstellenansicht
// @match        https://politi.alarmcentral-spil.dk/statusoverzicht
// @match        https://www.leitstellenspiel.de/leitstellenansicht
// @match        https://www.leitstellenspiel.de/statusoverzicht
// @match        https://polizei.leitstellenspiel.de/leitstellenansicht
// @match        https://polizei.leitstellenspiel.de/statusoverzicht
// @match        https://www.missionchief-australia.com/leitstellenansicht
// @match        https://www.missionchief-australia.com/statusoverzicht
// @match        https://police.missionchief-australia.com/leitstellenansicht
// @match        https://police.missionchief-australia.com/statusoverzicht
// @match        https://www.missionchief.co.uk/leitstellenansicht
// @match        https://www.missionchief.co.uk/statusoverzicht
// @match        https://police.missionchief.co.uk/leitstellenansicht
// @match        https://police.missionchief.co.uk/statusoverzicht
// @match        https://www.missionchief.com/leitstellenansicht
// @match        https://www.missionchief.com/statusoverzicht
// @match        https://police.missionchief.com/leitstellenansicht
// @match        https://police.missionchief.com/statusoverzicht
// @match        https://www.centro-de-mando.es/leitstellenansicht
// @match        https://www.centro-de-mando.es/statusoverzicht
// @match        https://www.centro-de-mando.mx/leitstellenansicht
// @match        https://www.centro-de-mando.mx/statusoverzicht
// @match        https://www.hatakeskuspeli.com/leitstellenansicht
// @match        https://www.hatakeskuspeli.com/statusoverzicht
// @match        https://poliisi.hatakeskuspeli.com/leitstellenansicht
// @match        https://poliisi.hatakeskuspeli.com/statusoverzicht
// @match        https://www.operateur112.fr/leitstellenansicht
// @match        https://www.operateur112.fr/statusoverzicht
// @match        https://police.operateur112.fr/leitstellenansicht
// @match        https://police.operateur112.fr/statusoverzicht
// @match        https://www.operatore112.it/leitstellenansicht
// @match        https://www.operatore112.it/statusoverzicht
// @match        https://polizia.operatore112.it/leitstellenansicht
// @match        https://polizia.operatore112.it/statusoverzicht
// @match        https://www.missionchief-japan.com/leitstellenansicht
// @match        https://www.missionchief-japan.com/statusoverzicht
// @match        https://www.missionchief-korea.com/leitstellenansicht
// @match        https://www.missionchief-korea.com/statusoverzicht
// @match        https://www.nodsentralspillet.com/leitstellenansicht
// @match        https://www.nodsentralspillet.com/statusoverzicht
// @match        https://politiet.nodsentralspillet.com/leitstellenansicht
// @match        https://politiet.nodsentralspillet.com/statusoverzicht
// @match        https://www.meldkamerspel.com/leitstellenansicht
// @match        https://www.meldkamerspel.com/statusoverzicht
// @match        https://politie.meldkamerspel.com/leitstellenansicht
// @match        https://politie.meldkamerspel.com/statusoverzicht
// @match        https://www.operatorratunkowy.pl/leitstellenansicht
// @match        https://www.operatorratunkowy.pl/statusoverzicht
// @match        https://policja.operatorratunkowy.pl/leitstellenansicht
// @match        https://policja.operatorratunkowy.pl/statusoverzicht
// @match        https://www.operador193.com/leitstellenansicht
// @match        https://www.operador193.com/statusoverzicht
// @match        https://www.jogo-operador112.com/leitstellenansicht
// @match        https://www.jogo-operador112.com/statusoverzicht
// @match        https://policia.jogo-operador112.com/leitstellenansicht
// @match        https://policia.jogo-operador112.com/statusoverzicht
// @match        https://www.jocdispecerat112.com/leitstellenansicht
// @match        https://www.jocdispecerat112.com/statusoverzicht
// @match        https://www.dispetcher112.ru/leitstellenansicht
// @match        https://www.dispetcher112.ru/statusoverzicht
// @match        https://www.dispecerske-centrum.com/leitstellenansicht
// @match        https://www.dispecerske-centrum.com/statusoverzicht
// @match        https://www.larmcentralen-spelet.se/leitstellenansicht
// @match        https://www.larmcentralen-spelet.se/statusoverzicht
// @match        https://polis.larmcentralen-spelet.se/leitstellenansicht
// @match        https://polis.larmcentralen-spelet.se/statusoverzicht
// @match        https://www.112-merkez.com/leitstellenansicht
// @match        https://www.112-merkez.com/statusoverzicht
// @match        https://www.dyspetcher101-game.com/leitstellenansicht
// @match        https://www.dyspetcher101-game.com/statusoverzicht
// @run-at       document-idle
// ==/UserScript==

/**
 * @name Leitstellenansicht Nav-toggle
 * @description Adds a button to show/hide navbar in Leitstellenansicht
 * @match /leitstellenansicht
 * @match /statusoverzicht
 */

(function () {
    'use strict';

    const btn = document.createElement('a');
    btn.classList.add('btn', 'btn-default');
    btn.style.setProperty('position', 'fixed');
    btn.style.setProperty('top', '1rem');
    btn.style.setProperty('right', '1rem');
    btn.style.setProperty('z-index', '10000');
    btn.textContent = 'S/H';

    btn.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.navbar-fixed-top').classList.toggle('hidden');
    });

    document.body.append(btn);
})();
