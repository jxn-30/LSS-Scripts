// ==UserScript==
// @name            [LSS] Better SpawnArea visibility
// @name:de         [LSS] Bessere Sichtbarkeit von Generierungsradien
// @namespace       https://jxn.lss-manager.de
// @version         2026.06.01+1833
// @author          Jan (jxn_30)
// @description     Improves visibility of the circles while setting mission spawn area
// @description:de  Verbessert die Sichtbarkeit der Kreise, wenn man einen Generierungsradius setzt
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/betterSpawnAreaVisibility.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/betterSpawnAreaVisibility.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/29069-umgesetzt-radius-spezialeinsatzgebiet-seenotrettung-auf-1km-und-500m-erweitern
// @match           https://www.operacni-stredisko.cz/buildings/*
// @match           https://policie.operacni-stredisko.cz/buildings/*
// @match           https://www.alarmcentral-spil.dk/buildings/*
// @match           https://politi.alarmcentral-spil.dk/buildings/*
// @match           https://www.leitstellenspiel.de/buildings/*
// @match           https://polizei.leitstellenspiel.de/buildings/*
// @match           https://www.missionchief-australia.com/buildings/*
// @match           https://police.missionchief-australia.com/buildings/*
// @match           https://www.missionchief.co.uk/buildings/*
// @match           https://police.missionchief.co.uk/buildings/*
// @match           https://www.missionchief.com/buildings/*
// @match           https://police.missionchief.com/buildings/*
// @match           https://www.centro-de-mando.es/buildings/*
// @match           https://www.centro-de-mando.mx/buildings/*
// @match           https://www.hatakeskuspeli.com/buildings/*
// @match           https://poliisi.hatakeskuspeli.com/buildings/*
// @match           https://www.operateur112.fr/buildings/*
// @match           https://police.operateur112.fr/buildings/*
// @match           https://www.operatore112.it/buildings/*
// @match           https://polizia.operatore112.it/buildings/*
// @match           https://www.missionchief-japan.com/buildings/*
// @match           https://www.missionchief-korea.com/buildings/*
// @match           https://www.nodsentralspillet.com/buildings/*
// @match           https://politiet.nodsentralspillet.com/buildings/*
// @match           https://www.meldkamerspel.com/buildings/*
// @match           https://politie.meldkamerspel.com/buildings/*
// @match           https://www.operatorratunkowy.pl/buildings/*
// @match           https://policja.operatorratunkowy.pl/buildings/*
// @match           https://www.operador193.com/buildings/*
// @match           https://www.jogo-operador112.com/buildings/*
// @match           https://policia.jogo-operador112.com/buildings/*
// @match           https://www.jocdispecerat112.com/buildings/*
// @match           https://www.dispetcher112.ru/buildings/*
// @match           https://www.dispecerske-centrum.com/buildings/*
// @match           https://www.larmcentralen-spelet.se/buildings/*
// @match           https://polis.larmcentralen-spelet.se/buildings/*
// @match           https://www.112-merkez.com/buildings/*
// @match           https://www.dyspetcher101-game.com/buildings/*
// @run-at          document-idle
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Better SpawnArea visibility
 * @name:de Bessere Sichtbarkeit von Generierungsradien
 * @description Improves visibility of the circles while setting mission spawn area
 * @description:de Verbessert die Sichtbarkeit der Kreise, wenn man einen Generierungsradius setzt
 * @forum https://forum.leitstellenspiel.de/index.php?thread/29069-umgesetzt-radius-spezialeinsatzgebiet-seenotrettung-auf-1km-und-500m-erweitern
 * @match /buildings/*
 * @grant GM_addStyle
 */

GM_addStyle(`
    .leaflet-pane.leaflet-overlay-pane:has(.leaflet-interactive[stroke="orange"]) {
        z-index: 601;
    }

    .leaflet-pane.leaflet-overlay-pane:has(.leaflet-interactive[stroke="orange"]) * {
        pointer-events: none;
    }

    .leaflet-pane.leaflet-overlay-pane .leaflet-interactive[stroke="orange"] {
        stroke-width: 5px;
        fill-opacity: 0.25;
    }
`);
