// ==UserScript==
// @name            [LSS] Mission Vehicle Highlight
// @name:de         [LSS] Fahrzeuge im Einsatz farblich hervorheben
// @namespace       https://jxn.lss-manager.de
// @version         2024.04.11+1111
// @author          Jan (jxn_30)
// @description     Highlights vehicles in the mission window with different colors
// @description:de  Hebt Fahrzeuge im Einsatzfenster farblich hervor
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/missionVehicleHighlight.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/missionVehicleHighlight.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/17868-fahrzeuge-farblich-hervorheben/
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
// ==/UserScript==

/**
 * @name Mission Vehicle Highlight
 * @name:de Fahrzeuge im Einsatz farblich hervorheben
 * @description Highlights vehicles in the mission window with different colors
 * @description:de Hebt Fahrzeuge im Einsatzfenster farblich hervor
 * @forum https://forum.leitstellenspiel.de/index.php?thread/17868-fahrzeuge-farblich-hervorheben/
 * @match /missions/*
 * @old Mission-Vehicle-Highlight
 */

// EINSTELLUNGEN
/** @type {ConfigEntry[]} */
const CONFIG = [
    // 1. Farbe: Entweder eine benannte Farbe von https://developer.mozilla.org/en-US/docs/Web/CSS/named-color#value oder eine beliebige andere Farbe, die CSS erkennt (https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
    // 2. Fahrzeugtypen: IDs der Fahrzeugtypen, die mit der Farbe hervorgehoben werden sollen. IDs finden sich unter https://forum.leitstellenspiel.de/index.php?thread/8406-infos-f%C3%BCr-entwickler/&postID=485487#post485487
    // 3. (Optional, standardmäßig false) Soll ein Alarm ausgegeben werden, wenn ein Fahrzeug hervorgehoben wird?
    ['#0f0', [34, 129], false], // ELW 2, ELW2 Drohne
    ['#00f', [51], false], // FüKw (Polizei)
];
// ENDE DER EINSTELLUNGEN. AB HIER LIEBER NIX MEHR ÄNDERN

/** @type {Map<number, {color: string, alert: boolean}>} */
const configMap = new Map(
    CONFIG.flatMap(([color, types, alert = false]) =>
        types.map(type => [type, { color, alert }])
    )
);

let alerted = 0;

document
    .querySelectorAll(
        '#mission_vehicle_at_mission tbody tr[id^="vehicle_row"], #mission_vehicle_driving tbody tr[id^="vehicle_row"]'
    )
    .forEach(row => {
        const vehicleType = parseInt(
            row
                .querySelector('[vehicle_type_id]')
                ?.getAttribute('vehicle_type_id')
        );
        if (Number.isNaN(vehicleType)) return;
        const config = configMap.get(vehicleType);
        if (!config) return;
        row.style.backgroundColor = config.color;
        if (config.alert) alerted++;
    });

if (alerted) {
    alert(
        `Guten Tag. Es wurden insgesamt ${alerted.toLocaleString()} Fahrzeuge farblich hervorgehoben.`
    );
}

/** @typedef {Array<string|number>} SimpleConfigEntry */
/** @typedef {Array<string|number|boolean>} ExtendedConfigEntry */
/** @typedef {SimpleConfigEntry | ExtendedConfigEntry} ConfigEntry */
