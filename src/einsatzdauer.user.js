// ==UserScript==
// @name            [LSS] Einsatzdauer
// @namespace       https://jxn.lss-manager.de
// @version         2023.06.03+1509
// @author          Jan (jxn_30)
// @description     Shows the remaining time for each mission in the missions list
// @description:de  Zeigt die verbleibende Einsatzdauer in der Einsatzliste an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/einsatzdauer.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/einsatzdauer.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/13913-script-einsatzdauer-in-der-einsatzliste/
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
 * @name  Einsatzdauer
 * @description Shows the remaining time for each mission in the missions list
 * @description:de Zeigt die verbleibende Einsatzdauer in der Einsatzliste an
 * @forum https://forum.leitstellenspiel.de/index.php?thread/13913-script-einsatzdauer-in-der-einsatzliste/
 * @match /
 * @grant unsafeWindow
 */

const greenOnly = true; // Show countdown on green missions only. Set to `false` to disable

(function () {
    'use strict';

    const missionTimerOrig = unsafeWindow.missionTimer;

    unsafeWindow.missionTimer = function (t) {
        if (greenOnly && t.vehicle_state !== 2) return;
        const timeElement = document.querySelector(
            `#mission_overview_countdown_${t.id}`
        );
        if (timeElement) {
            timeElement.textContent = unsafeWindow.formatTime(
                Math.floor(t.date_end_calc - unsafeWindow.unix_timestamp()),
                false
            );
        }

        missionTimerOrig(t);
    };
})();
