// ==UserScript==
// @name            [LSS] Status 5 colorize
// @name:de         [LSS] S5-Färber
// @namespace       https://jxn.lss-manager.de
// @version         2022.12.03+0016
// @author          Jan (jxn_30)
// @description     Allows to set a custom color for any Status 5 radio message by vehicle type
// @description:de  S5 nach Fahrzeugtyp einfärben
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/fms5Colorizer.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/fms5Colorizer.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/23490-scriptwunsch-fms-5-in-hiorg-farbe/
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
// @grant           unsafeWindow
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Status 5 colorize
 * @name:de S5-Färber
 * @description Allows to set a custom color for any Status 5 radio message by vehicle type
 * @description:de S5 nach Fahrzeugtyp einfärben
 * @forum https://forum.leitstellenspiel.de/index.php?thread/23490-scriptwunsch-fms-5-in-hiorg-farbe/
 * @match /
 * @grant unsafeWindow
 * @grant GM_addStyle
 */

/** @typedef Setting
 * @property {string} color
 * @property {number[]} vehicleTypes
 **/

/** @type {Setting[]} */
const colors = [
    {
        color: '#0000ff', // choose a CSS predefined color https://www.w3schools.com/cssref/css_colors.php or a valid color representation https://www.w3schools.com/cssref/css_colors_legal.php
        vehicleTypes: [32, 98, 103], // choose the vehicle types https://api.lss-manager.de/de_DE/vehicles
    },
];

GM_addStyle(
    colors
        .map(({ color, vehicleTypes }) => {
            return `#radio_messages_important > li:where(${vehicleTypes
                .map(type => `[data-vehicle-type="${type}"]`)
                .join(',')}) > span.building_list_fms_5 {
                        background-color: ${color} !important;
                        background-image: none !important;
                    }`;
        })
        .join('\n')
);

/** @type {Record<number, number>} */
const vehicleTypesStorage = {};

const radioMessageOrigin = unsafeWindow.radioMessage;

/**
 * set the vehicle type for a radio message
 * @param {number} vehicleId
 */
const setVehicleTypeAttr = vehicleId => {
    const radio = document.querySelector(`.radio_message_vehicle_${vehicleId}`);
    if (radio) {
        radio.dataset.vehicleType = vehicleTypesStorage[vehicleId].toString();
    }
};

/**
 * @typedef SimplifiedRadioMessage
 * @property {number} fms_real
 * @property {number} id
 * @property {number} user_id
 */

/**
 * @param {SimplifiedRadioMessage} radio
 */
const applyRadio = radio => {
    if (radio.fms_real !== 5 || radio.user_id !== unsafeWindow.user_id) return;
    if (vehicleTypesStorage[radio.id]) return setVehicleTypeAttr(radio.id);
    fetch(`/api/vehicles/${radio.id}`)
        .then(res => res.json())
        .then(({ vehicle_type }) => {
            vehicleTypesStorage[radio.id] = vehicle_type;
            setVehicleTypeAttr(radio.id);
        });
};

/**
 * @param {SimplifiedRadioMessage} radio
 */
unsafeWindow.radioMessage = radio => {
    radioMessageOrigin(radio);
    applyRadio(radio);
};

// apply to existing radio messages
Array.from(document.scripts)
    .map(script => script.textContent.trim())
    .join('\n')
    .match(/(?<=radioMessage\()\{.*?\}(?=\);)/gu)
    ?.forEach(match => applyRadio(JSON.parse(match)));
