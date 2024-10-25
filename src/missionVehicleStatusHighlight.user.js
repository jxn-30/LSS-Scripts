// ==UserScript==
// @name            [LSS] Mission vehicle status highlight
// @name:de         [LSS] Fahrzeuge nach Status im Einsatzfenster hervorheben
// @namespace       https://jxn.lss-manager.de
// @version         2024.10.25+1316
// @author          Jan (jxn_30)
// @description     Highlights vehicles based on their current status in the mission window
// @description:de  Hebt Fahrzeuge im Einsatzfenster basierend auf ihrem aktuellen Status hervor
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/missionVehicleStatusHighlight.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/missionVehicleStatusHighlight.user.js
// @supportURL      https://github.com/jxn-30/LSS-Scripts
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
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Mission vehicle status highlight
 * @name:de Fahrzeuge nach Status im Einsatzfenster hervorheben
 * @description Highlights vehicles based on their current status in the mission window
 * @description:de Hebt Fahrzeuge im Einsatzfenster basierend auf ihrem aktuellen Status hervor
 * @//forum
 * @match /missions/*
 * @grant GM_addStyle
 * @old Mission-Status-Highlight
 */

// ****************************************************************************
// Beginn der Konfiguration: Hier dürfen die Werte geändert werden
// ****************************************************************************
const FAHRZEUGE_UNTERWEGS = true; // false: Fahrzeuge auf Anfahrt nicht hervorheben
const FAHRZEUGE_AM_EINSATZORT = true; // false: Fahrzeuge am Einsatzort nicht hervorheben
const FAHRZEUGE_VERFUEGBAR = true; // false: verfügbare Fahrzeuge nicht hervorheben
const CONFIG = {
    // Jede Zeile folgt dem Schema:
    // Status: 'Farbe',
    // Das Komma ist wichtig! Als Farben können alle CSS-Farben verwendet werden
    // z. B. vorgefertigte Farben mit Namen: https://developer.mozilla.org/en-US/docs/Web/CSS/named-color
    // oder alle möglichen Farbwerte, die CSS erlaubt: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Color_values
    1: '#0000FF',
    2: '#00FF00',
    3: '#FFFF00',
};
// ****************************************************************************
// Ende der Konfiguration: Ab hier lieber nichts mehr ändern!
// ****************************************************************************

const tables = [];
if (FAHRZEUGE_UNTERWEGS) tables.push('#mission_vehicle_driving');
if (FAHRZEUGE_AM_EINSATZORT) tables.push('#mission_vehicle_at_mission');
if (FAHRZEUGE_VERFUEGBAR) tables.push('#vehicle_list_step');

GM_addStyle(
    Object.entries(CONFIG)
        .map(
            ([status, color]) =>
                `:where(${tables.join(',')}) tbody tr:has(.building_list_fms.building_list_fms_${status}) {
                    background-color: ${color} !important;
                }`
        )
        .join('\n\n')
);
