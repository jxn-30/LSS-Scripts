// ==UserScript==
// @name            [LSS] Cleaner Vehicle Market
// @name:de         [LSS] Aufgeräumter Fahrzeugmarkt
// @namespace       https://jxn.lss-manager.de
// @version         2024.07.04+1021
// @author          Jan (jxn_30)
// @description     Hides vehicles currently not available for purchase on the vehicle market.
// @description:de  Blendet aktuell nicht kaufbare Fahrzeuge im Fahrzeugmarkt aus.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/cleanerVehicleMarket.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/cleanerVehicleMarket.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/26670-script-aufger%C3%A4umter-fahrzeugmarkt/
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
 * @forum https://forum.leitstellenspiel.de/index.php?thread/26670-script-aufger%C3%A4umter-fahrzeugmarkt/
 * @match /buildings/*\/vehicles/new
 */

const TABS_AUFLOESEN = false; // true: Tabs auflösen, false: Tabs beibehalten

// find all tabs with unavailable vehicles
const emptyTabs = Array.from(
    document.querySelectorAll(
        '.tab-pane:has(.buy-vehicle-btn):not(:has(.buy-vehicle-btn:not(.disabled)))'
    )
).map(pane => pane.id);

// a style to hide stuff
const hideStyle = document.createElement('style');
hideStyle.textContent = `
.vehicle-market-subcategory:not(:has(.buy-vehicle-btn:not(.disabled))), /* Hide subcategories without available vehicles */
.col-sm-3:not(:has(.buy-vehicle-btn:not(.disabled))), /* Hide unavailable vehicles */
#tabs :where(${emptyTabs.map(tab => `li:has(a[href="#${tab}"])`).join(',')}), /* Hide empty tabs in the tablist */
.tab-content :where(${emptyTabs.map(tab => `#${tab}`).join(',')}) /* Hide empty tabs */
{
    display: none !important;
}
`;

document.head.appendChild(hideStyle);

// add the button to toggle normal / cleaner view
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
// open first non-empty tab
document
    .querySelector(
        `#tabs a${emptyTabs.map(tab => `:not(a[href="#${tab}"])`).join('')}`
    )
    ?.click();

if (TABS_AUFLOESEN) {
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.add('active');
        const title =
            document
                .querySelector(`#tabs a[href="#${pane.id}"]`)
                ?.textContent?.trim() ?? '';
        const h2 = document.createElement('h2');
        h2.textContent = title;
        pane.prepend(h2);
    });
    document.getElementById('tabs').classList.add('hidden');
}
