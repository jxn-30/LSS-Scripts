// ==UserScript==
// @name            [LSS] Reload list of buildings
// @name:de         [LSS] Gebäudeliste neu laden
// @namespace       https://jxn.lss-manager.de
// @version         2022.11.26+1801
// @author          Jan (jxn_30)
// @description     Adds a button to the map to reload the list of buildings
// @description:de  Fügt der Karte einen Knopf hinzu, über den sich die Gebäudeliste neu laden lässt.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/reloadBuildinglist.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/reloadBuildinglist.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/23357-script-wunsch-aktualisierung-der-lst-liste/
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
 * @name Reload list of buildings
 * @name:de Gebäudeliste neu laden
 * @description Adds a button to the map to reload the list of buildings
 * @description:de Fügt der Karte einen Knopf hinzu, über den sich die Gebäudeliste neu laden lässt.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/23357-script-wunsch-aktualisierung-der-lst-liste/
 * @match /
 * @old reload-buildinglist
 */

/* global buildingLoadContent */

const bar = document.createElement('div');
bar.classList.add('leaflet-bar', 'leaflet-control');
document
    .querySelector('#map .leaflet-control-container .leaflet-top.leaflet-right')
    ?.append(bar);
const control = document.createElement('a');
control.textContent = '🏘️🔃';
control.addEventListener('click', e => {
    e.preventDefault();
    buildingLoadContent('/buildings');
});
control.style.setProperty('cursor', 'pointer');
bar.append(control);
