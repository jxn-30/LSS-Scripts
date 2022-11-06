// ==UserScript==
// @name         [LSS] BSR AAO über Fahrzeugliste
// @namespace    https://jxn.lss-manager.de
// @version      2022.0.0
// @author       Jan (jxn_30)
// @description  Macht die AAO über die Fahrzeugliste in Bereitstellungsräumen
// @homepage     https://github.com/jxn-30/LSS-Scripts
// @homepageURL  https://github.com/jxn-30/LSS-Scripts
// @updateURL    https://github.com/jxn-30/LSS-Scripts/raw/master/src/bsrAAOAboveVehiclelist.user.js
// @downloadURL  https://github.com/jxn-30/LSS-Scripts/raw/master/src/bsrAAOAboveVehiclelist.user.js
// @supportURL   https://github.com/jxn-30/LSS-Scripts
// @match        https://www.operacni-stredisko.cz/buildings/*
// @match        https://policie.operacni-stredisko.cz/buildings/*
// @match        https://www.alarmcentral-spil.dk/buildings/*
// @match        https://politi.alarmcentral-spil.dk/buildings/*
// @match        https://www.leitstellenspiel.de/buildings/*
// @match        https://polizei.leitstellenspiel.de/buildings/*
// @match        https://www.missionchief-australia.com/buildings/*
// @match        https://police.missionchief-australia.com/buildings/*
// @match        https://www.missionchief.co.uk/buildings/*
// @match        https://police.missionchief.co.uk/buildings/*
// @match        https://www.missionchief.com/buildings/*
// @match        https://police.missionchief.com/buildings/*
// @match        https://www.centro-de-mando.es/buildings/*
// @match        https://www.centro-de-mando.mx/buildings/*
// @match        https://www.hatakeskuspeli.com/buildings/*
// @match        https://poliisi.hatakeskuspeli.com/buildings/*
// @match        https://www.operateur112.fr/buildings/*
// @match        https://police.operateur112.fr/buildings/*
// @match        https://www.operatore112.it/buildings/*
// @match        https://polizia.operatore112.it/buildings/*
// @match        https://www.missionchief-japan.com/buildings/*
// @match        https://www.missionchief-korea.com/buildings/*
// @match        https://www.nodsentralspillet.com/buildings/*
// @match        https://politiet.nodsentralspillet.com/buildings/*
// @match        https://www.meldkamerspel.com/buildings/*
// @match        https://politie.meldkamerspel.com/buildings/*
// @match        https://www.operatorratunkowy.pl/buildings/*
// @match        https://policja.operatorratunkowy.pl/buildings/*
// @match        https://www.operador193.com/buildings/*
// @match        https://www.jogo-operador112.com/buildings/*
// @match        https://policia.jogo-operador112.com/buildings/*
// @match        https://www.jocdispecerat112.com/buildings/*
// @match        https://www.dispetcher112.ru/buildings/*
// @match        https://www.dispecerske-centrum.com/buildings/*
// @match        https://www.larmcentralen-spelet.se/buildings/*
// @match        https://polis.larmcentralen-spelet.se/buildings/*
// @match        https://www.112-merkez.com/buildings/*
// @match        https://www.dyspetcher101-game.com/buildings/*
// @run-at       document-idle
// ==/UserScript==

/**
 * @version 2022.0.0
 * @name BSR AAO über Fahrzeugliste
 * @description Macht die AAO über die Fahrzeugliste in Bereitstellungsräumen
 * @match /buildings/*
 * @old bsr-aao-vehiclelist
 */

document
    .querySelector(
        'form[action^="/buildings/"][action$="/bereitstellungaufloesen"]'
    )
    ?.before(
        document.getElementById('mission-aao-group')?.parentElement
            ?.parentElement
    );
