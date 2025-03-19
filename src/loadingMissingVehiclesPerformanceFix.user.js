// ==UserScript==
// @name            [LSS] Performance-Bugfix when loading missing vehicles
// @name:de         [LSS] Nachlade-Performance-Bugfix
// @namespace       https://jxn.lss-manager.de
// @version         2024.08.21+1208
// @author          Jan (jxn_30)
// @description     This script speeds up the performance when loading missing vehicles
// @description:de  Dieses Skript behebt die Performance-Probleme, die beim Nachladen auftreten
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/loadingMissingVehiclesPerformanceFix.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/loadingMissingVehiclesPerformanceFix.user.js
// @supportURL      https://github.com/jxn-30/LSS-Scripts
// @match           https://www.operacni-stredisko.cz/missions/*
// @match           https://policie.operacni-stredisko.cz/missions/*
// @match           https://www.alarmcentral-spil.dk/missions/*
// @match           https://politi.alarmcentral-spil.dk/missions/*
// @match           https://www.leitstellenspiel.de/missions/*
// @match           https://polizei.leitstellenspiel.de/missions/*
// @match           https://www.missionchief-australia.com/missions/*
// @match           https://police.missionchief-australia.com/missions/*
// @match           https://www.missionchief.co.uk/missions/*
// @match           https://police.missionchief.co.uk/missions/*
// @match           https://www.missionchief.com/missions/*
// @match           https://police.missionchief.com/missions/*
// @match           https://www.centro-de-mando.es/missions/*
// @match           https://www.centro-de-mando.mx/missions/*
// @match           https://www.hatakeskuspeli.com/missions/*
// @match           https://poliisi.hatakeskuspeli.com/missions/*
// @match           https://www.operateur112.fr/missions/*
// @match           https://police.operateur112.fr/missions/*
// @match           https://www.operatore112.it/missions/*
// @match           https://polizia.operatore112.it/missions/*
// @match           https://www.missionchief-japan.com/missions/*
// @match           https://www.missionchief-korea.com/missions/*
// @match           https://www.nodsentralspillet.com/missions/*
// @match           https://politiet.nodsentralspillet.com/missions/*
// @match           https://www.meldkamerspel.com/missions/*
// @match           https://politie.meldkamerspel.com/missions/*
// @match           https://www.operatorratunkowy.pl/missions/*
// @match           https://policja.operatorratunkowy.pl/missions/*
// @match           https://www.operador193.com/missions/*
// @match           https://www.jogo-operador112.com/missions/*
// @match           https://policia.jogo-operador112.com/missions/*
// @match           https://www.jocdispecerat112.com/missions/*
// @match           https://www.dispetcher112.ru/missions/*
// @match           https://www.dispecerske-centrum.com/missions/*
// @match           https://www.larmcentralen-spelet.se/missions/*
// @match           https://polis.larmcentralen-spelet.se/missions/*
// @match           https://www.112-merkez.com/missions/*
// @match           https://www.dyspetcher101-game.com/missions/*
// @run-at          document-idle
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name Performance-Bugfix when loading missing vehicles
 * @name:de Nachlade-Performance-Bugfix
 * @description This script speeds up the performance when loading missing vehicles
 * @description:de Dieses Skript behebt die Performance-Probleme, die beim Nachladen auftreten
 * @match /missions/*
 * @grant unsafeWindow
 */

// This MAY have unexpected sideproblems but it fixes the performance issue.
unsafeWindow.initEquipment = () => {};
