// ==UserScript==
// @name            [LSS] Map Expander
// @name:de         [LSS] Karte expandieren
// @namespace       https://jxn.lss-manager.de
// @version         2025.08.11+1716
// @author          Jan (jxn_30)
// @description     Automagically expands the map to a new window on loading the page
// @description:de  Expandiert die Karte beim Laden des Spiels automagisch in ein neues Fenster
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/expandMap.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/expandMap.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/28668-script-karte-expandieren-automagisch-die-karte-in-einem-neuen-fenster-%C3%B6ffnen/
// @match           https://www.operacni-stredisko.cz/
// @match           https://policie.operacni-stredisko.cz/
// @match           https://www.alarmcentral-spil.dk/
// @match           https://politi.alarmcentral-spil.dk/
// @match           https://www.leitstellenspiel.de/
// @match           https://polizei.leitstellenspiel.de/
// @match           https://www.missionchief-australia.com/
// @match           https://police.missionchief-australia.com/
// @match           https://www.missionchief.co.uk/
// @match           https://police.missionchief.co.uk/
// @match           https://www.missionchief.com/
// @match           https://police.missionchief.com/
// @match           https://www.centro-de-mando.es/
// @match           https://www.centro-de-mando.mx/
// @match           https://www.hatakeskuspeli.com/
// @match           https://poliisi.hatakeskuspeli.com/
// @match           https://www.operateur112.fr/
// @match           https://police.operateur112.fr/
// @match           https://www.operatore112.it/
// @match           https://polizia.operatore112.it/
// @match           https://www.missionchief-japan.com/
// @match           https://www.missionchief-korea.com/
// @match           https://www.nodsentralspillet.com/
// @match           https://politiet.nodsentralspillet.com/
// @match           https://www.meldkamerspel.com/
// @match           https://politie.meldkamerspel.com/
// @match           https://www.operatorratunkowy.pl/
// @match           https://policja.operatorratunkowy.pl/
// @match           https://www.operador193.com/
// @match           https://www.jogo-operador112.com/
// @match           https://policia.jogo-operador112.com/
// @match           https://www.jocdispecerat112.com/
// @match           https://www.dispetcher112.ru/
// @match           https://www.dispecerske-centrum.com/
// @match           https://www.larmcentralen-spelet.se/
// @match           https://polis.larmcentralen-spelet.se/
// @match           https://www.112-merkez.com/
// @match           https://www.dyspetcher101-game.com/
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Map Expander
 * @name:de Karte expandieren
 * @description Automagically expands the map to a new window on loading the page
 * @description:de Expandiert die Karte beim Laden des Spiels automagisch in ein neues Fenster
 * @forum https://forum.leitstellenspiel.de/index.php?thread/28668-script-karte-expandieren-automagisch-die-karte-in-einem-neuen-fenster-%C3%B6ffnen/
 * @match /
 */

/* global mapExpand */

mapExpand(!!document.getElementById('bigMapMenu'));
