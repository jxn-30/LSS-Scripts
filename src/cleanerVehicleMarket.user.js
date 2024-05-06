// ==UserScript==
// @name            [LSS] Cleaner Vehicle Market
// @name:de         [LSS] Aufgeräumter Fahrzeugmarkt
// @namespace       https://jxn.lss-manager.de
// @version         2024.05.03+1004
// @author          Jan (jxn_30)
// @description     Hides vehicles currently not available for purchase on the vehicle market.
// @description:de  Blendet aktuell nicht kaufbare Fahrzeuge im Fahrzeugmarkt aus.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/cleanerVehicleMarket.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/cleanerVehicleMarket.user.js
// @supportURL      https://github.com/jxn-30/LSS-Scripts
// @match           https://www.operacni-stredisko.cz/buildings/*/vehicles/new
// @match           https://policie.operacni-stredisko.cz/buildings/*/vehicles/new
// @match           https://www.alarmcentral-spil.dk/buildings/*/vehicles/new
// @match           https://politi.alarmcentral-spil.dk/buildings/*/vehicles/new
// @match           https://www.leitstellenspiel.de/buildings/*/vehicles/new
// @match           https://polizei.leitstellenspiel.de/buildings/*/vehicles/new
// @match           https://www.missionchief-australia.com/buildings/*/vehicles/new
// @match           https://police.missionchief-australia.com/buildings/*/vehicles/new
// @match           https://www.missionchief.co.uk/buildings/*/vehicles/new
// @match           https://police.missionchief.co.uk/buildings/*/vehicles/new
// @match           https://www.missionchief.com/buildings/*/vehicles/new
// @match           https://police.missionchief.com/buildings/*/vehicles/new
// @match           https://www.centro-de-mando.es/buildings/*/vehicles/new
// @match           https://www.centro-de-mando.mx/buildings/*/vehicles/new
// @match           https://www.hatakeskuspeli.com/buildings/*/vehicles/new
// @match           https://poliisi.hatakeskuspeli.com/buildings/*/vehicles/new
// @match           https://www.operateur112.fr/buildings/*/vehicles/new
// @match           https://police.operateur112.fr/buildings/*/vehicles/new
// @match           https://www.operatore112.it/buildings/*/vehicles/new
// @match           https://polizia.operatore112.it/buildings/*/vehicles/new
// @match           https://www.missionchief-japan.com/buildings/*/vehicles/new
// @match           https://www.missionchief-korea.com/buildings/*/vehicles/new
// @match           https://www.nodsentralspillet.com/buildings/*/vehicles/new
// @match           https://politiet.nodsentralspillet.com/buildings/*/vehicles/new
// @match           https://www.meldkamerspel.com/buildings/*/vehicles/new
// @match           https://politie.meldkamerspel.com/buildings/*/vehicles/new
// @match           https://www.operatorratunkowy.pl/buildings/*/vehicles/new
// @match           https://policja.operatorratunkowy.pl/buildings/*/vehicles/new
// @match           https://www.operador193.com/buildings/*/vehicles/new
// @match           https://www.jogo-operador112.com/buildings/*/vehicles/new
// @match           https://policia.jogo-operador112.com/buildings/*/vehicles/new
// @match           https://www.jocdispecerat112.com/buildings/*/vehicles/new
// @match           https://www.dispetcher112.ru/buildings/*/vehicles/new
// @match           https://www.dispecerske-centrum.com/buildings/*/vehicles/new
// @match           https://www.larmcentralen-spelet.se/buildings/*/vehicles/new
// @match           https://polis.larmcentralen-spelet.se/buildings/*/vehicles/new
// @match           https://www.112-merkez.com/buildings/*/vehicles/new
// @match           https://www.dyspetcher101-game.com/buildings/*/vehicles/new
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Cleaner Vehicle Market
 * @name:de Aufgeräumter Fahrzeugmarkt
 * @description Hides vehicles currently not available for purchase on the vehicle market.
 * @description:de Blendet aktuell nicht kaufbare Fahrzeuge im Fahrzeugmarkt aus.
 * @//forum
 * @match /buildings/*\/vehicles/new
 */

const emptyTabs = Array.from(
    document.querySelectorAll(
        '.tab-pane:has(.buy-vehicle-btn):not(:has(.buy-vehicle-btn:not(.disabled)))'
    )
).map(pane => pane.id);

const hideStyle = document.createElement('style');
hideStyle.textContent = `
.vehicle-market-subcategory:not(:has(.buy-vehicle-btn:not(.disabled))),
.col-sm-3:not(:has(.buy-vehicle-btn:not(.disabled))),
#tabs :where(${emptyTabs.map(tab => `li:has(a[href="#${tab}"])`).join(',')}) {
    display: none;
}
`;

document.head.appendChild(hideStyle);

const toggleBtn = document.createElement('span');
toggleBtn.classList.add('glyphicon', 'glyphicon-eye-open');
toggleBtn.style.setProperty('cursor', 'pointer');
toggleBtn.style.setProperty('font-size', '65%');

toggleBtn.addEventListener('click', e => {
    e.preventDefault();
    if (toggleBtn.classList.contains('glyphicon-eye-open')) hideStyle.remove();
    else document.head.appendChild(hideStyle);
    toggleBtn.classList.toggle('glyphicon-eye-open');
    toggleBtn.classList.toggle('glyphicon-eye-close');
});

document.querySelector('h1')?.append(' ', toggleBtn);
