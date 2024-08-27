// ==UserScript==
// @name            [LSS] Cleaner Vehicle Market
// @name:de         [LSS] Aufgeräumter Fahrzeugmarkt
// @namespace       https://jxn.lss-manager.de
// @version         2024.08.14+1821
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
// @match           https://www.operacni-stredisko.cz/buildings/*/equipments/new
// @match           https://policie.operacni-stredisko.cz/buildings/*/vehicles/new
// @match           https://policie.operacni-stredisko.cz/buildings/*/equipments/new
// @match           https://www.alarmcentral-spil.dk/buildings/*/vehicles/new
// @match           https://www.alarmcentral-spil.dk/buildings/*/equipments/new
// @match           https://politi.alarmcentral-spil.dk/buildings/*/vehicles/new
// @match           https://politi.alarmcentral-spil.dk/buildings/*/equipments/new
// @match           https://www.leitstellenspiel.de/buildings/*/vehicles/new
// @match           https://www.leitstellenspiel.de/buildings/*/equipments/new
// @match           https://polizei.leitstellenspiel.de/buildings/*/vehicles/new
// @match           https://polizei.leitstellenspiel.de/buildings/*/equipments/new
// @match           https://www.missionchief-australia.com/buildings/*/vehicles/new
// @match           https://www.missionchief-australia.com/buildings/*/equipments/new
// @match           https://police.missionchief-australia.com/buildings/*/vehicles/new
// @match           https://police.missionchief-australia.com/buildings/*/equipments/new
// @match           https://www.missionchief.co.uk/buildings/*/vehicles/new
// @match           https://www.missionchief.co.uk/buildings/*/equipments/new
// @match           https://police.missionchief.co.uk/buildings/*/vehicles/new
// @match           https://police.missionchief.co.uk/buildings/*/equipments/new
// @match           https://www.missionchief.com/buildings/*/vehicles/new
// @match           https://www.missionchief.com/buildings/*/equipments/new
// @match           https://police.missionchief.com/buildings/*/vehicles/new
// @match           https://police.missionchief.com/buildings/*/equipments/new
// @match           https://www.centro-de-mando.es/buildings/*/vehicles/new
// @match           https://www.centro-de-mando.es/buildings/*/equipments/new
// @match           https://www.centro-de-mando.mx/buildings/*/vehicles/new
// @match           https://www.centro-de-mando.mx/buildings/*/equipments/new
// @match           https://www.hatakeskuspeli.com/buildings/*/vehicles/new
// @match           https://www.hatakeskuspeli.com/buildings/*/equipments/new
// @match           https://poliisi.hatakeskuspeli.com/buildings/*/vehicles/new
// @match           https://poliisi.hatakeskuspeli.com/buildings/*/equipments/new
// @match           https://www.operateur112.fr/buildings/*/vehicles/new
// @match           https://www.operateur112.fr/buildings/*/equipments/new
// @match           https://police.operateur112.fr/buildings/*/vehicles/new
// @match           https://police.operateur112.fr/buildings/*/equipments/new
// @match           https://www.operatore112.it/buildings/*/vehicles/new
// @match           https://www.operatore112.it/buildings/*/equipments/new
// @match           https://polizia.operatore112.it/buildings/*/vehicles/new
// @match           https://polizia.operatore112.it/buildings/*/equipments/new
// @match           https://www.missionchief-japan.com/buildings/*/vehicles/new
// @match           https://www.missionchief-japan.com/buildings/*/equipments/new
// @match           https://www.missionchief-korea.com/buildings/*/vehicles/new
// @match           https://www.missionchief-korea.com/buildings/*/equipments/new
// @match           https://www.nodsentralspillet.com/buildings/*/vehicles/new
// @match           https://www.nodsentralspillet.com/buildings/*/equipments/new
// @match           https://politiet.nodsentralspillet.com/buildings/*/vehicles/new
// @match           https://politiet.nodsentralspillet.com/buildings/*/equipments/new
// @match           https://www.meldkamerspel.com/buildings/*/vehicles/new
// @match           https://www.meldkamerspel.com/buildings/*/equipments/new
// @match           https://politie.meldkamerspel.com/buildings/*/vehicles/new
// @match           https://politie.meldkamerspel.com/buildings/*/equipments/new
// @match           https://www.operatorratunkowy.pl/buildings/*/vehicles/new
// @match           https://www.operatorratunkowy.pl/buildings/*/equipments/new
// @match           https://policja.operatorratunkowy.pl/buildings/*/vehicles/new
// @match           https://policja.operatorratunkowy.pl/buildings/*/equipments/new
// @match           https://www.operador193.com/buildings/*/vehicles/new
// @match           https://www.operador193.com/buildings/*/equipments/new
// @match           https://www.jogo-operador112.com/buildings/*/vehicles/new
// @match           https://www.jogo-operador112.com/buildings/*/equipments/new
// @match           https://policia.jogo-operador112.com/buildings/*/vehicles/new
// @match           https://policia.jogo-operador112.com/buildings/*/equipments/new
// @match           https://www.jocdispecerat112.com/buildings/*/vehicles/new
// @match           https://www.jocdispecerat112.com/buildings/*/equipments/new
// @match           https://www.dispetcher112.ru/buildings/*/vehicles/new
// @match           https://www.dispetcher112.ru/buildings/*/equipments/new
// @match           https://www.dispecerske-centrum.com/buildings/*/vehicles/new
// @match           https://www.dispecerske-centrum.com/buildings/*/equipments/new
// @match           https://www.larmcentralen-spelet.se/buildings/*/vehicles/new
// @match           https://www.larmcentralen-spelet.se/buildings/*/equipments/new
// @match           https://polis.larmcentralen-spelet.se/buildings/*/vehicles/new
// @match           https://polis.larmcentralen-spelet.se/buildings/*/equipments/new
// @match           https://www.112-merkez.com/buildings/*/vehicles/new
// @match           https://www.112-merkez.com/buildings/*/equipments/new
// @match           https://www.dyspetcher101-game.com/buildings/*/vehicles/new
// @match           https://www.dyspetcher101-game.com/buildings/*/equipments/new
// @run-at          document-idle
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Cleaner Vehicle Market
 * @name:de Aufgeräumter Fahrzeugmarkt
 * @description Hides vehicles currently not available for purchase on the vehicle market.
 * @description:de Blendet aktuell nicht kaufbare Fahrzeuge im Fahrzeugmarkt aus.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/26670-script-aufger%C3%A4umter-fahrzeugmarkt/
 * @match /buildings/*\/vehicles/new
 * @match /buildings/*\/equipments/new
 * @grant GM_setValue
 * @grant GM_getValue
 * @grant GM_addStyle
 */

// ****************************************************************************
// Beginn der Konfiguration: Hier dürfen die Werte hinter dem = geändert werden
// ****************************************************************************
const TABS_AUFLOESEN = false; // true: Tabs auflösen, false: Tabs beibehalten
const REMOVE_COINS_BUTTONS = false; // true: Knöpfe zum Kaufen mit Coins entfernen, false: Knöpfe zum Kaufen mit Coins beibehalten
// ****************************************************************************
// Ende der Konfiguration: Ab hier lieber nichts mehr ändern!
// ****************************************************************************

// remove coins buttons
if (REMOVE_COINS_BUTTONS) {
    document
        .querySelectorAll('.buy-vehicle-btn[href*="coins"]')
        .forEach(btn => btn.remove());
}

// add a class to manually hidden vehicles
const HIDDEN_VEHICLES_STORAGE = 'hidden_vehicles';
const hiddenVehicles = new Set(GM_getValue(HIDDEN_VEHICLES_STORAGE, []));
const manuallyHiddenClass = 'manually-hidden';
hiddenVehicles.forEach(vehicleType =>
    document
        .querySelectorAll(
            `.vehicle_type:has(.buy-vehicle-btn[href*="/${vehicleType}/"])`
        )
        .forEach(el => {
            el.classList.add(manuallyHiddenClass);
        })
);

GM_addStyle(`
.vehicle_type h3 {
    pointer-events: none;
}
.vehicle_type h3::before {
    content: "\\e105";
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    cursor: pointer;
    pointer-events: auto;
    font-size: medium;
}
.vehicle_type.${manuallyHiddenClass} h3::before {
    content: "\\e106";
}
`);
document.addEventListener('click', e => {
    const target = e.target;
    if (target instanceof HTMLElement && target.matches('.vehicle_type h3')) {
        const vehicleWell = target.closest('.vehicle_type');
        if (!vehicleWell) return;

        const vehicleType = vehicleWell
            .querySelector('.buy-vehicle-btn')
            .getAttribute('href')
            .split('/')[5];
        if (vehicleWell.classList.contains(manuallyHiddenClass)) {
            hiddenVehicles.delete(vehicleType);
        } else {
            hiddenVehicles.add(vehicleType);
        }

        GM_setValue(HIDDEN_VEHICLES_STORAGE, Array.from(hiddenVehicles));

        target.closest('.vehicle_type').classList.toggle(manuallyHiddenClass);
    }
});

// find all tabs with available vehicles
const nonEmptyTabs = Array.from(
    document.querySelectorAll(
        '.tab-pane:has(.vehicle_type:not(.manually-hidden) .buy-vehicle-btn:not(.disabled))'
    )
).map(pane => pane.id);

// a style to hide stuff
const hideStyle = document.createElement('style');
hideStyle.textContent = `
.vehicle-market-subcategory:not(:has(.buy-vehicle-btn:not(.disabled))), /* Hide subcategories without available vehicles */
.col-sm-3:not(:has(.buy-vehicle-btn:not(.disabled))), /* Hide unavailable vehicles */
${
    nonEmptyTabs.length ?
        `
#tabs li:has(a:not(${nonEmptyTabs.map(tab => `[href="#${tab}"]`).join(',')})), /* Hide empty tabs in the tablist */
.tab-content > :not(${nonEmptyTabs.map(tab => `#${tab}`).join(',')}), /* Hide empty tabs */
`
    :   ''
}
.col-sm-3:has(.vehicle_type.${manuallyHiddenClass}) /* Hide manually hidden vehicles */
{
    display: none !important;
}

.row:has(+ .row)::after {
    clear: unset;
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
if (nonEmptyTabs.length) {
    document
        .querySelector(
            `#tabs a:not(${nonEmptyTabs.map(tab => `:not(a[href="#${tab}"])`).join('')})`
        )
        ?.click();
}

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
