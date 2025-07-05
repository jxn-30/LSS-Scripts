// ==UserScript==
// @name            [LSS] Hide blue Missionlist boxes
// @name:de         [LSS] Blaue Kästen in der Einsatzliste ausblenden
// @namespace       https://jxn.lss-manager.de
// @version         2025.07.05+2111
// @author          Jan (jxn_30)
// @description     Hides the blue boxes in the missionlist (that inform about how to get missions)
// @description:de  Blendet die blauen Kästen in der Einsatzliste aus (die über das Erhalten von Einsätzen informieren)
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/hideBlueMissionListBoxes.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/hideBlueMissionListBoxes.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/20518-erledigt-danke-kleiner-wunsch-f%C3%BCr-ein-besonderes-script
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
 * @name Hide blue Missionlist boxes
 * @name:de Blaue Kästen in der Einsatzliste ausblenden
 * @description Hides the blue boxes in the missionlist (that inform about how to get missions)
 * @description:de Blendet die blauen Kästen in der Einsatzliste aus (die über das Erhalten von Einsätzen informieren)
 * @forum https://forum.leitstellenspiel.de/index.php?thread/20518-erledigt-danke-kleiner-wunsch-f%C3%BCr-ein-besonderes-script
 * @match /
 * @grant GM_addStyle
 */

GM_addStyle(`
#emergency_no, /* Notfalleinsätze */
#alliance_no_mission, /* Verbandseinsätze */
#patient_no_transports, /* Krankentransporte */
#critical_no_transports /* Intensivverlegungen */
{
    display: none !important;
}`);
