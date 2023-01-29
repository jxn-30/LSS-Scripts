// ==UserScript==
// @name            [LSS] Reload missions list
// @name:de         [LSS] Einsatzliste neu laden
// @namespace       https://jxn.lss-manager.de
// @version         2023.01.29+1235
// @author          Jan (jxn_30)
// @description     Adds a button that allows reloading the missions list separately
// @description:de  Fügt einen Knopf hinzu, der die Einsatzliste separat neu laden lässt
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/reloadMissions.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/reloadMissions.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/22974-scriptwunsch-separat-neu-ladbare-einsatzliste-und-chat/
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
 * @name Reload missions list
 * @name:de Einsatzliste neu laden
 * @description Adds a button that allows reloading the missions list separately
 * @description:de Fügt einen Knopf hinzu, der die Einsatzliste separat neu laden lässt
 * @forum https://forum.leitstellenspiel.de/index.php?thread/22974-scriptwunsch-separat-neu-ladbare-einsatzliste-und-chat/
 * @match /
 * @grant unsafeWindow
 */

// add the reload btn
const reloadBtn = document.createElement('button');
reloadBtn.classList.add('btn', 'btn-xs', 'btn-warning');
const reloadIcon = document.createElement('span');
reloadIcon.classList.add('glyphicon', 'glyphicon-refresh');
reloadBtn.append(reloadIcon);
document.querySelector('#btn-group-mission-select')?.prepend(reloadBtn);

reloadBtn.addEventListener('click', () => {
    reloadBtn.disabled = true;
    fetch('/')
        .then(res => res.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'))
        .then(doc => [
            Array.from(doc.scripts)
                .flatMap(script =>
                    script.textContent?.match(
                        /(?<=(mission|patient)MarkerAdd\()\s*\{(?:"[^"]*":(?:-?\d+(?:\.\d+)?|".*?"|true|false|null),?)+\}(?=\);)/gu
                    )
                )
                .filter(m => !!m)
                .map(m => JSON.parse(m)),
            Array.from(doc.scripts)
                .flatMap(script =>
                    script.textContent?.match(
                        /(?<=mission_participation_add\()\d+(?=\);)/gu
                    )
                )
                .filter(m => !!m)
                .map(m => parseInt(m)),
        ])
        .then(([markers, involved]) => {
            markers.forEach(marker => {
                if ('mtid' in marker) unsafeWindow.missionDelete(marker.id);
                else unsafeWindow.patientDelete(marker.id);
            });
            document
                .querySelectorAll(
                    '#missions-panel-body > [id^="mission_list"] > .missionSideBarEntry'
                )
                ?.forEach(el => el.remove());
            markers.forEach(marker => {
                if ('mtid' in marker) unsafeWindow.missionMarkerAdd(marker);
                else unsafeWindow.patientMarkerAdd(marker);
            });
            involved.forEach(id => {
                unsafeWindow.mission_participation_add(id);
                unsafeWindow.missionInvolved(id, true);
            });
        })
        .then(() => (reloadBtn.disabled = false));
});
