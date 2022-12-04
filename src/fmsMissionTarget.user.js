// ==UserScript==
// @name            [LSS] RadioMessage: Mission Target
// @name:de         [LSS] FMS: Einsatzziel
// @namespace       https://jxn.lss-manager.de
// @version         2022.11.27+1240
// @author          Jan (jxn_30)
// @description     Adds the current mission (including address) to the radio message
// @description:de  Fügt den aktuellen Einsatz (inklusive Adresse) zur Funkmeldung hinzu
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/fmsMissionTarget.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/fmsMissionTarget.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/15126-ortsangabe-bei-fms-3-4-und-5/
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
 * @name RadioMessage: Mission Target
 * @name:de FMS: Einsatzziel
 * @description Adds the current mission (including address) to the radio message
 * @description:de Fügt den aktuellen Einsatz (inklusive Adresse) zur Funkmeldung hinzu
 * @forum https://forum.leitstellenspiel.de/index.php?thread/15126-ortsangabe-bei-fms-3-4-und-5/
 * @match /
 * @old FMS-Change
 * @grant unsafeWindow
 */

const statusDescription = true; //Setzte diesen Wert auf false, um sowas wie "Auf Anfahrt", "Am Einsatzort" etc auszublenden.

const radioMessageOrig = unsafeWindow.radioMessage;
unsafeWindow.radioMessage = t => {
    if (t.mission_id !== 0) {
        t.fms_text =
            (statusDescription ? `${t.fms_text} <br>` : '') +
            document
                .querySelector(`#mission_caption_${t.mission_id}`)
                ?.textContent?.trim();
    }
    radioMessageOrig(t);
};
