// ==UserScript==
// @name            [LSS] OSM-MapScale
// @namespace       https://jxn.lss-manager.de
// @version         2024.01.19+2109
// @author          Jan (jxn_30)
// @description     Shows a scale on the map
// @description:de  Zeigt einen Maßstab auf der Karte an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/osmMapscale.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/osmMapscale.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/18908-script-osm-mapscale/
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
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name OSM-MapScale
 * @description Shows a scale on the map
 * @description:de Zeigt einen Maßstab auf der Karte an
 * @forum https://forum.leitstellenspiel.de/index.php?thread/18908-script-osm-mapscale/
 * @grant unsafeWindow
 */

const position = 'bottomright'; // Mögliche Werte:
/*                                 'bottomleft'  => Unten links
 **                                'bottomright' => Unten rechts
 **                                'topleft'     => Oben links
 **                                'topright'    => Oben rechts
 */

(() => {
    if ('L' in unsafeWindow && 'map' in unsafeWindow && unsafeWindow.map) {
        unsafeWindow.L.control.scale({ position }).addTo(unsafeWindow.map);
    }
})();
