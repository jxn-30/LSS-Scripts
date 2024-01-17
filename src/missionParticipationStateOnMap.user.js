// ==UserScript==
// @name            [LSS] Mission Participation State on Map
// @name:de         [LSS] Einsatzbeteiligung auf der Karte
// @namespace       https://jxn.lss-manager.de
// @version         2023.07.08+1509
// @author          Jan (jxn_30)
// @description     Shows the participation state of missions on the map in their respective tooltip.
// @description:de  Zeigt den Beteiligungsstatus von Einsätzen auf der Karte im jeweiligen Tooltip an.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/missionParticipationStateOnMap.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/missionParticipationStateOnMap.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/24293-einsatzteilnahme-auf-karte-anzeigen-lassen/
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
// ==/UserScript==

/**
 * @name Mission Participation State on Map
 * @name:de Einsatzbeteiligung auf der Karte
 * @description Shows the participation state of missions on the map in their respective tooltip.
 * @description:de Zeigt den Beteiligungsstatus von Einsätzen auf der Karte im jeweiligen Tooltip an.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/24293-einsatzteilnahme-auf-karte-anzeigen-lassen/
 * @match /
 * @grant unsafeWindow
 */

/**
 * @param {number|any} missionIdOrMarker
 * @param {boolean} participating
 */
const updateTooltip = (missionIdOrMarker, participating) => {
    const tooltip = (
        typeof missionIdOrMarker === 'number' ?
            unsafeWindow.mission_markers.find(
                m => m.mission_id === missionIdOrMarker
            )
        :   missionIdOrMarker)?.getTooltip();
    if (!tooltip) return;
    tooltip.setContent(
        `<!--start-participation--><span class="glyphicon glyphicon-${
            participating ? 'user' : 'asterisk'
        }"></span>&nbsp;<!--end-participation-->${tooltip
            .getContent()
            .replace(
                /<!--start-participation-->.*<!--end-participation-->/,
                ''
            )}`
    );
};

// overwrite missionInvolved to update the tooltip
const missionMarkerAddOrig = unsafeWindow.missionMarkerAdd;
/**
 * @param {any} mission
 */
unsafeWindow.missionMarkerAdd = mission => {
    missionMarkerAddOrig(mission);
    updateTooltip(
        mission.id,
        !!document.querySelector(
            `#mission_participant_${mission.id}:not(.hidden)`
        )
    );
};

// overwrite missionInvolved to update the tooltip
const missionInvolvedOrig = unsafeWindow.missionInvolved;
/**
 * @param {number} missionId
 * @param {boolean} involved
 */
unsafeWindow.missionInvolved = (missionId, involved) => {
    missionInvolvedOrig(missionId, involved);
    updateTooltip(missionId, involved);
};

// initially update all tooltips
(() =>
    unsafeWindow.mission_markers.forEach(marker =>
        // this simple version does not work because the involved state is not correct due to an ingame bug
        // updateTooltip(marker, marker.involved)
        updateTooltip(
            marker,
            !!document.querySelector(
                `#mission_participant_${marker.mission_id}:not(.hidden)`
            )
        )
    ))();
