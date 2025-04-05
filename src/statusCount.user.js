// ==UserScript==
// @name            [LSS] Status-Count
// @name:de         [LSS] Status-Zähler
// @namespace       https://jxn.lss-manager.de
// @version         2024.02.14+1250
// @author          Jan (jxn_30)
// @description     Adds a configurable counter to the radio log that shows how many vehicles are in each status
// @description:de  Fügt einen konfigurierbaren Zähler über dem Funk ein, der anzeigt, wie viele Fahrzeuge sich im jeweiligen Status befinden.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/statusCount.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/statusCount.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/15575-lss-statuscount/
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
// @require         https://raw.githubusercontent.com/LUFSI/framework/refs/heads/main/src/SharedAPIStorage.js
// @run-at          document-idle
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Status-Count
 * @name:de Status-Zähler
 * @description Adds a configurable counter to the radio log that shows how many vehicles are in each status
 * @description:de Fügt einen konfigurierbaren Zähler über dem Funk ein, der anzeigt, wie viele Fahrzeuge sich im jeweiligen Status befinden.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/15575-lss-statuscount/
 * @match /
 * @grant GM_addStyle
 * @lufsi SharedAPIStorage
 * @old LSS-StatusCount
 */

/* global radioMessage:writable, sharedAPIStorage:readonly, user_id:readonly */

/****************************************************************
 * Einstellungen: Hier dürfen Änderungen im Script getan werden *
 ***************************************************************/

const round = 0; // Auf so viele Nachkommastellen werden die Prozente gerundet.

const statusConfig = {
    s1: {
        show: true, // Zähler wird eingeblendet bei true, bei false ausgeblendet (Wichtig: Überschreibt hide! => Wenn hide auf true aber show auf false ist, wird es trotzdem nie eingeblendet).
        percent: true, // Prozentsatz wird angezeigt bei true, bei false nicht.
        hide: false, // Bei true wird der Zähler ausgeblendet, sollte er auf 0 stehen, bei false ist diese Funktion deaktiviert.
    },
    s2: {
        show: true,
        percent: true,
        hide: false,
    },
    s3: {
        show: true,
        percent: true,
        hide: false,
    },
    s4: {
        show: true,
        percent: true,
        hide: false,
    },
    s5: {
        show: true,
        percent: true,
        hide: false,
        blink: false, // Wenn dieser Wert auf false ist, blinkt der S5-Zähler nur, wenn mind. 1 Sprechwunsch vorhanden ist.
    },
    s6: {
        show: true,
        percent: true,
        hide: false,
    },
    s7: {
        show: true,
        percent: true,
        hide: false,
    },
    s9: {
        show: true,
        percent: true,
        hide: false,
    },
};

/**************************************************************
 * Ende der Einstellungen: Ab hier lieber nichts mehr ändern! *
 *************************************************************/

const statusCount = document.createElement('div');
statusCount.id = 'statusCount';

if (!statusConfig.s5.blink) {
    GM_addStyle(
        `#${statusCount.id} .building_list_fms_5[data-amount="0"] {background-image: unset;}`
    );
}

const statusFields = new Map();

const vehicleStatus = new Map();
const amounts = new Map();
const updateAPI = () =>
    sharedAPIStorage.getVehicles().then(vehicles => {
        vehicleStatus.clear();
        amounts.clear();
        vehicles.forEach(({ id, fms_real }) => {
            vehicleStatus.set(id, fms_real);
            amounts.set(fms_real, (amounts.get(fms_real) ?? 0) + 1);
        });
        amounts.keys().forEach(status => setField(status));
    });

const setField = status => {
    const config = statusConfig[`s${status}`];
    const statusField = statusFields.get(status);
    if (!statusField) return;
    const amount = amounts.get(status) ?? 0;
    statusField.dataset.amount = amount.toString();
    if (config.hide && amount === 0) {
        statusField.classList.add('hidden');
        return;
    }
    statusField.classList.remove('hidden');
    let content = amount.toLocaleString();
    if (config.percent) {
        const percent = vehicleStatus.size ? amount / vehicleStatus.size : 0;
        content += ` (${percent.toLocaleString(undefined, {
            style: 'percent',
            maximumFractionDigits: round,
        })})`;
    }
    statusField.textContent = content;
    statusField.title = `Status ${status}: ${content}`;
};

[1, 2, 3, 4, 5, 6, 7, 9].forEach(status => {
    if (!statusConfig[`s${status}`].show) return;
    const field = document.createElement('span');
    field.classList.add(
        'building_list_fms',
        `building_list_fms_${status}`,
        'hidden'
    );
    statusCount.append(field);
    statusFields.set(status, field);
    setField(status);
});

const radioMessageOrig = radioMessage;
radioMessage = (...args) => {
    const [msg] = args;
    if (msg.type === 'vehicle_fms' && msg.user_id === user_id) {
        if (!vehicleStatus.has(msg.id)) {
            vehicleStatus.set(msg.id, msg.fms_real);
            amounts.set(msg.fms_real, (amounts.get(msg.fms_real) ?? 0) + 1);
            setField(msg.fms_real);
        } else {
            const oldStatus = vehicleStatus.get(msg.id);
            amounts.set(oldStatus, (amounts.get(oldStatus) ?? 1) - 1);
            vehicleStatus.set(msg.id, msg.fms_real);
            amounts.set(msg.fms_real, (amounts.get(msg.fms_real) ?? 0) + 1);
            setField(oldStatus);
            setField(msg.fms_real);
        }
    }
    return radioMessageOrig(...args);
};

updateAPI().then(() => setInterval(updateAPI, 5.5 * 60 * 1000)); // try updating API every 5:30 minutes

(() => document.getElementById('radio_panel_heading')?.append(statusCount))();
