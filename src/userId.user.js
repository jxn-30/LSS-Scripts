// ==UserScript==
// @name            [LSS] User-ID
// @namespace       https://jxn.lss-manager.de
// @version         2024.01.07+1848
// @author          Jan (jxn_30)
// @description     Shows the own User-ID in navbar on main page and a users ID on their respective profile page
// @description:de  Zeigt die eigene Nutzer-ID in der Navigationsleiste auf der Hauptseite und die ID eines Nutzers auf dessen Profilseite an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/userId.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/userId.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/12513-user-id-anzeiger/
// @match           https://www.operacni-stredisko.cz/
// @match           https://www.operacni-stredisko.cz/profile/*
// @match           https://policie.operacni-stredisko.cz/
// @match           https://policie.operacni-stredisko.cz/profile/*
// @match           https://www.alarmcentral-spil.dk/
// @match           https://www.alarmcentral-spil.dk/profile/*
// @match           https://politi.alarmcentral-spil.dk/
// @match           https://politi.alarmcentral-spil.dk/profile/*
// @match           https://www.leitstellenspiel.de/
// @match           https://www.leitstellenspiel.de/profile/*
// @match           https://polizei.leitstellenspiel.de/
// @match           https://polizei.leitstellenspiel.de/profile/*
// @match           https://www.missionchief-australia.com/
// @match           https://www.missionchief-australia.com/profile/*
// @match           https://police.missionchief-australia.com/
// @match           https://police.missionchief-australia.com/profile/*
// @match           https://www.missionchief.co.uk/
// @match           https://www.missionchief.co.uk/profile/*
// @match           https://police.missionchief.co.uk/
// @match           https://police.missionchief.co.uk/profile/*
// @match           https://www.missionchief.com/
// @match           https://www.missionchief.com/profile/*
// @match           https://police.missionchief.com/
// @match           https://police.missionchief.com/profile/*
// @match           https://www.centro-de-mando.es/
// @match           https://www.centro-de-mando.es/profile/*
// @match           https://www.centro-de-mando.mx/
// @match           https://www.centro-de-mando.mx/profile/*
// @match           https://www.hatakeskuspeli.com/
// @match           https://www.hatakeskuspeli.com/profile/*
// @match           https://poliisi.hatakeskuspeli.com/
// @match           https://poliisi.hatakeskuspeli.com/profile/*
// @match           https://www.operateur112.fr/
// @match           https://www.operateur112.fr/profile/*
// @match           https://police.operateur112.fr/
// @match           https://police.operateur112.fr/profile/*
// @match           https://www.operatore112.it/
// @match           https://www.operatore112.it/profile/*
// @match           https://polizia.operatore112.it/
// @match           https://polizia.operatore112.it/profile/*
// @match           https://www.missionchief-japan.com/
// @match           https://www.missionchief-japan.com/profile/*
// @match           https://www.missionchief-korea.com/
// @match           https://www.missionchief-korea.com/profile/*
// @match           https://www.nodsentralspillet.com/
// @match           https://www.nodsentralspillet.com/profile/*
// @match           https://politiet.nodsentralspillet.com/
// @match           https://politiet.nodsentralspillet.com/profile/*
// @match           https://www.meldkamerspel.com/
// @match           https://www.meldkamerspel.com/profile/*
// @match           https://politie.meldkamerspel.com/
// @match           https://politie.meldkamerspel.com/profile/*
// @match           https://www.operatorratunkowy.pl/
// @match           https://www.operatorratunkowy.pl/profile/*
// @match           https://policja.operatorratunkowy.pl/
// @match           https://policja.operatorratunkowy.pl/profile/*
// @match           https://www.operador193.com/
// @match           https://www.operador193.com/profile/*
// @match           https://www.jogo-operador112.com/
// @match           https://www.jogo-operador112.com/profile/*
// @match           https://policia.jogo-operador112.com/
// @match           https://policia.jogo-operador112.com/profile/*
// @match           https://www.jocdispecerat112.com/
// @match           https://www.jocdispecerat112.com/profile/*
// @match           https://www.dispetcher112.ru/
// @match           https://www.dispetcher112.ru/profile/*
// @match           https://www.dispecerske-centrum.com/
// @match           https://www.dispecerske-centrum.com/profile/*
// @match           https://www.larmcentralen-spelet.se/
// @match           https://www.larmcentralen-spelet.se/profile/*
// @match           https://polis.larmcentralen-spelet.se/
// @match           https://polis.larmcentralen-spelet.se/profile/*
// @match           https://www.112-merkez.com/
// @match           https://www.112-merkez.com/profile/*
// @match           https://www.dyspetcher101-game.com/
// @match           https://www.dyspetcher101-game.com/profile/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name  User-ID
 * @description Shows the own User-ID in navbar on main page and a users ID on their respective profile page
 * @description:de Zeigt die eigene Nutzer-ID in der Navigationsleiste auf der Hauptseite und die ID eines Nutzers auf dessen Profilseite an
 * @forum https://forum.leitstellenspiel.de/index.php?thread/12513-user-id-anzeiger/
 * @match /
 * @match /profile/*
 */

/* global user_id */

const showInNavbar = true;
const showInProfile = true;

if (window.location.pathname === '/' && showInNavbar) {
    document
        .querySelector('#navbar-main-collapse > ul')
        ?.insertAdjacentHTML(
            'beforeend',
            `<li><a class="lightbox-open" href="/profile/${user_id}">${user_id}</a></li>`
        );
}

if (showInProfile && window.location.pathname.match(/\/profile\/\d+/u)) {
    const h1 = document.querySelector('h1');
    if (h1) {
        const smallId = 'jxn_30-userid-profile';
        const small = h1.querySelector(`small#${smallId}`);
        const content = `(${window.location.pathname.replace(/\D+/gu, '')})`;
        if (small) {
            small.textContent = content;
        } else {
            h1.innerHTML += `&nbsp;<small id="${smallId}">${content}</small>`;
        }
    }
}
