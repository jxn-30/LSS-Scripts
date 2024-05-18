// ==UserScript==
// @name            [LSS] Empty ARR
// @name:de         [LSS] AAO leeren
// @namespace       https://jxn.lss-manager.de
// @version         2024.05.18+1213
// @author          Jan (jxn_30)
// @description     Adds a button to ARR edit windows to empty all numeric inputs
// @description:de  Fügt einen Knopf im AAO-Editor hinzu, um alle Anforderungen auf 0 zu setzen.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/emptyAAO.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/emptyAAO.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/26414-script-aao-leeren-alle-anforderungen-in-einer-aao-auf-0-setzen/
// @match           https://www.operacni-stredisko.cz/aaos/*/edit
// @match           https://www.operacni-stredisko.cz/aaos/*/copy
// @match           https://policie.operacni-stredisko.cz/aaos/*/edit
// @match           https://policie.operacni-stredisko.cz/aaos/*/copy
// @match           https://www.alarmcentral-spil.dk/aaos/*/edit
// @match           https://www.alarmcentral-spil.dk/aaos/*/copy
// @match           https://politi.alarmcentral-spil.dk/aaos/*/edit
// @match           https://politi.alarmcentral-spil.dk/aaos/*/copy
// @match           https://www.leitstellenspiel.de/aaos/*/edit
// @match           https://www.leitstellenspiel.de/aaos/*/copy
// @match           https://polizei.leitstellenspiel.de/aaos/*/edit
// @match           https://polizei.leitstellenspiel.de/aaos/*/copy
// @match           https://www.missionchief-australia.com/aaos/*/edit
// @match           https://www.missionchief-australia.com/aaos/*/copy
// @match           https://police.missionchief-australia.com/aaos/*/edit
// @match           https://police.missionchief-australia.com/aaos/*/copy
// @match           https://www.missionchief.co.uk/aaos/*/edit
// @match           https://www.missionchief.co.uk/aaos/*/copy
// @match           https://police.missionchief.co.uk/aaos/*/edit
// @match           https://police.missionchief.co.uk/aaos/*/copy
// @match           https://www.missionchief.com/aaos/*/edit
// @match           https://www.missionchief.com/aaos/*/copy
// @match           https://police.missionchief.com/aaos/*/edit
// @match           https://police.missionchief.com/aaos/*/copy
// @match           https://www.centro-de-mando.es/aaos/*/edit
// @match           https://www.centro-de-mando.es/aaos/*/copy
// @match           https://www.centro-de-mando.mx/aaos/*/edit
// @match           https://www.centro-de-mando.mx/aaos/*/copy
// @match           https://www.hatakeskuspeli.com/aaos/*/edit
// @match           https://www.hatakeskuspeli.com/aaos/*/copy
// @match           https://poliisi.hatakeskuspeli.com/aaos/*/edit
// @match           https://poliisi.hatakeskuspeli.com/aaos/*/copy
// @match           https://www.operateur112.fr/aaos/*/edit
// @match           https://www.operateur112.fr/aaos/*/copy
// @match           https://police.operateur112.fr/aaos/*/edit
// @match           https://police.operateur112.fr/aaos/*/copy
// @match           https://www.operatore112.it/aaos/*/edit
// @match           https://www.operatore112.it/aaos/*/copy
// @match           https://polizia.operatore112.it/aaos/*/edit
// @match           https://polizia.operatore112.it/aaos/*/copy
// @match           https://www.missionchief-japan.com/aaos/*/edit
// @match           https://www.missionchief-japan.com/aaos/*/copy
// @match           https://www.missionchief-korea.com/aaos/*/edit
// @match           https://www.missionchief-korea.com/aaos/*/copy
// @match           https://www.nodsentralspillet.com/aaos/*/edit
// @match           https://www.nodsentralspillet.com/aaos/*/copy
// @match           https://politiet.nodsentralspillet.com/aaos/*/edit
// @match           https://politiet.nodsentralspillet.com/aaos/*/copy
// @match           https://www.meldkamerspel.com/aaos/*/edit
// @match           https://www.meldkamerspel.com/aaos/*/copy
// @match           https://politie.meldkamerspel.com/aaos/*/edit
// @match           https://politie.meldkamerspel.com/aaos/*/copy
// @match           https://www.operatorratunkowy.pl/aaos/*/edit
// @match           https://www.operatorratunkowy.pl/aaos/*/copy
// @match           https://policja.operatorratunkowy.pl/aaos/*/edit
// @match           https://policja.operatorratunkowy.pl/aaos/*/copy
// @match           https://www.operador193.com/aaos/*/edit
// @match           https://www.operador193.com/aaos/*/copy
// @match           https://www.jogo-operador112.com/aaos/*/edit
// @match           https://www.jogo-operador112.com/aaos/*/copy
// @match           https://policia.jogo-operador112.com/aaos/*/edit
// @match           https://policia.jogo-operador112.com/aaos/*/copy
// @match           https://www.jocdispecerat112.com/aaos/*/edit
// @match           https://www.jocdispecerat112.com/aaos/*/copy
// @match           https://www.dispetcher112.ru/aaos/*/edit
// @match           https://www.dispetcher112.ru/aaos/*/copy
// @match           https://www.dispecerske-centrum.com/aaos/*/edit
// @match           https://www.dispecerske-centrum.com/aaos/*/copy
// @match           https://www.larmcentralen-spelet.se/aaos/*/edit
// @match           https://www.larmcentralen-spelet.se/aaos/*/copy
// @match           https://polis.larmcentralen-spelet.se/aaos/*/edit
// @match           https://polis.larmcentralen-spelet.se/aaos/*/copy
// @match           https://www.112-merkez.com/aaos/*/edit
// @match           https://www.112-merkez.com/aaos/*/copy
// @match           https://www.dyspetcher101-game.com/aaos/*/edit
// @match           https://www.dyspetcher101-game.com/aaos/*/copy
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Empty ARR
 * @name:de AAO leeren
 * @description Adds a button to ARR edit windows to empty all numeric inputs
 * @description:de Fügt einen Knopf im AAO-Editor hinzu, um alle Anforderungen auf 0 zu setzen.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/26414-script-aao-leeren-alle-anforderungen-in-einer-aao-auf-0-setzen/
 * @match /aaos/*\/edit
 * @match /aaos/*\/copy
 */

const btn = document.createElement('button');
btn.classList.add('btn', 'btn-danger', 'btn-sm', 'pull-right');
btn.textContent = 'Reset';
btn.addEventListener('click', e => {
    e.preventDefault();
    document
        .querySelectorAll('.tab-content input[type="number"]')
        .forEach(input => (input.value = 0));
});
(() => document.getElementById('tabs')?.append(btn))();
