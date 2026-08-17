// ==UserScript==
// @name            [LSS] SLF nicht als LF alarmieren
// @name:de         [LSS] SLF nicht als LF alarmieren
// @namespace       https://jxn.lss-manager.de
// @version         2026.05.15+1342
// @author          Jan (jxn_30)
// @description     Verhindert es, dass die LF-AAO auch SLFs auswählt.
// @description:de  Verhindert es, dass die LF-AAO auch SLFs auswählt.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/SLFNoLF.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/SLFNoLF.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/29736-script-slf-nicht-als-lf-alarmieren/
// @match           https://www.leitstellenspiel.de/missions/*
// @match           https://polizei.leitstellenspiel.de/missions/*
// @run-at          document-idle
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name SLF nicht als LF alarmieren
 * @name:de SLF nicht als LF alarmieren
 * @description Verhindert es, dass die LF-AAO auch SLFs auswählt.
 * @description:de Verhindert es, dass die LF-AAO auch SLFs auswählt.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/29736-script-slf-nicht-als-lf-alarmieren/
 * @locale de_DE
 * @match /missions/*
 * @grant unsafeWindow
 */

// Die Fahrzeug IDs finden sich unter https://lnk.lss-manager.de/ids
// Nicht vergessen, hinter einer Zahl auch ein Komma zu setzen.
const Fahrzeuge = [
    167, // SLF
];

const LFAttributes = [
    'fire',
    'lf_only',
    'crew_carrier_or_fire_engine',
    'road_rescue_or_fire_engine',
];

const removeLFAttributes = () =>
    document
        .querySelectorAll(
            `.vehicle_checkbox:is(${Fahrzeuge.map(id => `[vehicle_type_id="${id}"]`).join(',')}):is(${LFAttributes.map(attr => `[${CSS.escape(attr)}="1"]`).join(',')})`
        )
        .forEach(v => LFAttributes.forEach(attr => v.removeAttribute(attr)));

removeLFAttributes();

const reloadTableOrig = unsafeWindow.reload_table_do;
unsafeWindow.reload_table_do = (...args) => {
    const result = reloadTableOrig(...args);
    removeLFAttributes();
    return result;
};
