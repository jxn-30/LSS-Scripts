// ==UserScript==
// @name            [LSS] hide own not shared missions
// @name:de         [LSS] eigene ungeteilte Einsätze ausblenden
// @namespace       https://jxn.lss-manager.de
// @version         2024.03.02+1539
// @author          Jan (jxn_30)
// @description     Hides own missions that are not yet shared with alliance
// @description:de  Blendet eigene Einsätze, die nicht im Verband geteilt wurden aus
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/hideOwnNotSharedMissions.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/hideOwnNotSharedMissions.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/20046-scriptwunsch-nur-freigegebene-eins%C3%A4tze-in-der-liste-anzeigen
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
 * @name hide own not shared missions
 * @name:de eigene ungeteilte Einsätze ausblenden
 * @description Hides own missions that are not yet shared with alliance
 * @description:de Blendet eigene Einsätze, die nicht im Verband geteilt wurden aus
 * @forum https://forum.leitstellenspiel.de/index.php?thread/20046-scriptwunsch-nur-freigegebene-eins%C3%A4tze-in-der-liste-anzeigen
 * @match /
 * @grant GM_addStyle
 */

// Funktion zum Ein- und Ausschalten der Panels
function togglePanels() {
    const missionListPanels = document.querySelectorAll(
        '#mission_list .panel:not(.panel-success)'
    );
    missionListPanels.forEach(panel => {
        panel.style.display = panel.style.display === 'none' ? '' : 'none';
    });

    const button = document.getElementById('toggle-panels-btn');
    const isActive = missionListPanels[0].style.display !== 'none';

    button.textContent = isActive ? 'Alle Einsätze' : 'Nur Freigaben';
    button.classList.toggle('btn-danger', !isActive);
    button.classList.toggle('btn-success', isActive);
}

// Erstellen und Hinzufügen des Buttons
const togglePanelsBtn = document.createElement('button');
togglePanelsBtn.id = 'toggle-panels-btn';
togglePanelsBtn.classList.add('btn', 'btn-xs', 'btn-success');
togglePanelsBtn.textContent = 'Alle Einsätze';
togglePanelsBtn.addEventListener('click', togglePanels);
document
    .querySelector('#missions .mission-filters .mission-filters-row')
    ?.append(togglePanelsBtn);

// Funktion zum Initialisieren des Skripts
function initializeScript() {
    // Verstecke Panels und setze Button-Text und -Klasse entsprechend
    togglePanels();
}

// Führe die Initialisierung aus, sobald das Dokument bereit ist
document.addEventListener('DOMContentLoaded', initializeScript);
