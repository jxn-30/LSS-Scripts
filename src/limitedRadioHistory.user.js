// ==UserScript==
// @name            [LSS] Limited Radio History
// @name:de         [LSS] Verkürzte Funk-Historie
// @namespace       https://jxn.lss-manager.de
// @version         2023.12.21+0035
// @author          Jan (jxn_30)
// @description     Limits the amount of radio messages shown in the radio history.
// @description:de  Begrenzt die Anzahl der Funknachrichten in der Funk-Historie.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/limitedRadioHistory.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/limitedRadioHistory.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/25179-script-limited-radio-history-angezeigte-funk-historie-beschr%C3%A4nken/
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
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Limited Radio History
 * @name:de Verkürzte Funk-Historie
 * @description Limits the amount of radio messages shown in the radio history.
 * @description:de Begrenzt die Anzahl der Funknachrichten in der Funk-Historie.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/25179-script-limited-radio-history-angezeigte-funk-historie-beschr%C3%A4nken/
 * @match /
 * @grant GM_addStyle
 */

// Wie viele Funksprüche sollen gleichzeitig angezeigt werden? 0 = alle
const limit = 100; // How many radio messages should be shown at once? 0 = all

// Wie viele Sprechwünsche sollen gleichzeitig angezeigt werden? 0 = alle
const limitSprechwunsch = 0; // How many speech requests should be shown at once? 0 = all

// Soll das Blinken der Sprechwünsche deaktiviert werden? true = deaktivieren, false = aktivieren
const disableSprechwunschBlinking = false; // Should the blinking of the speech requests be disabled? true = disable, false = enable

if (limit) {
    GM_addStyle(`
#radio_messages > li:nth-child(${limit}) ~ li {
    display: none;
}
`);
}

if (limitSprechwunsch) {
    GM_addStyle(`
#radio_messages_important > li:nth-child(${limitSprechwunsch}) ~ li {
    display: none;
}
`);
}

if (disableSprechwunschBlinking) {
    GM_addStyle(`
#radio_messages_important .building_list_fms_5 {
    background-image: none !important;
}
`);
}

// TODO: Regelmäßig (wann?) Funksprüche (außer Sprechwünsche) aus dem DOM entfernen?
