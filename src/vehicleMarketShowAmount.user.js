// ==UserScript==
// @name            [LSS] Vehicle market: Show amount
// @name:de         [LSS] Fahrzeugmarkt: Anzahl anzeigen
// @namespace       https://jxn.lss-manager.de
// @version         2023.08.19+1151
// @author          Jan (jxn_30)
// @description     Shows in the vehicle market how many vehicles of the respective type are already available on the currently built station.
// @description:de  Zeigt im Fahrzeugmarkt wie viele Fahrzeuge auf der aktuell gebauten Wache bereits vorhanden sind vom jeweiligen Typ.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/vehicleMarketShowAmount.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/vehicleMarketShowAmount.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/21816-fahrzeuganzahl-im-markt-anzeigen
// @match           https://www.operacni-stredisko.cz/buildings/*/vehicles/new
// @match           https://policie.operacni-stredisko.cz/buildings/*/vehicles/new
// @match           https://www.alarmcentral-spil.dk/buildings/*/vehicles/new
// @match           https://politi.alarmcentral-spil.dk/buildings/*/vehicles/new
// @match           https://www.leitstellenspiel.de/buildings/*/vehicles/new
// @match           https://polizei.leitstellenspiel.de/buildings/*/vehicles/new
// @match           https://www.missionchief-australia.com/buildings/*/vehicles/new
// @match           https://police.missionchief-australia.com/buildings/*/vehicles/new
// @match           https://www.missionchief.co.uk/buildings/*/vehicles/new
// @match           https://police.missionchief.co.uk/buildings/*/vehicles/new
// @match           https://www.missionchief.com/buildings/*/vehicles/new
// @match           https://police.missionchief.com/buildings/*/vehicles/new
// @match           https://www.centro-de-mando.es/buildings/*/vehicles/new
// @match           https://www.centro-de-mando.mx/buildings/*/vehicles/new
// @match           https://www.hatakeskuspeli.com/buildings/*/vehicles/new
// @match           https://poliisi.hatakeskuspeli.com/buildings/*/vehicles/new
// @match           https://www.operateur112.fr/buildings/*/vehicles/new
// @match           https://police.operateur112.fr/buildings/*/vehicles/new
// @match           https://www.operatore112.it/buildings/*/vehicles/new
// @match           https://polizia.operatore112.it/buildings/*/vehicles/new
// @match           https://www.missionchief-japan.com/buildings/*/vehicles/new
// @match           https://www.missionchief-korea.com/buildings/*/vehicles/new
// @match           https://www.nodsentralspillet.com/buildings/*/vehicles/new
// @match           https://politiet.nodsentralspillet.com/buildings/*/vehicles/new
// @match           https://www.meldkamerspel.com/buildings/*/vehicles/new
// @match           https://politie.meldkamerspel.com/buildings/*/vehicles/new
// @match           https://www.operatorratunkowy.pl/buildings/*/vehicles/new
// @match           https://policja.operatorratunkowy.pl/buildings/*/vehicles/new
// @match           https://www.operador193.com/buildings/*/vehicles/new
// @match           https://www.jogo-operador112.com/buildings/*/vehicles/new
// @match           https://policia.jogo-operador112.com/buildings/*/vehicles/new
// @match           https://www.jocdispecerat112.com/buildings/*/vehicles/new
// @match           https://www.dispetcher112.ru/buildings/*/vehicles/new
// @match           https://www.dispecerske-centrum.com/buildings/*/vehicles/new
// @match           https://www.larmcentralen-spelet.se/buildings/*/vehicles/new
// @match           https://polis.larmcentralen-spelet.se/buildings/*/vehicles/new
// @match           https://www.112-merkez.com/buildings/*/vehicles/new
// @match           https://www.dyspetcher101-game.com/buildings/*/vehicles/new
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Vehicle market: Show amount
 * @name:de Fahrzeugmarkt: Anzahl anzeigen
 * @description Shows in the vehicle market how many vehicles of the respective type are already available on the currently built station.
 * @description:de Zeigt im Fahrzeugmarkt wie viele Fahrzeuge auf der aktuell gebauten Wache bereits vorhanden sind vom jeweiligen Typ.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/21816-fahrzeuganzahl-im-markt-anzeigen
 * @match /buildings/*\/vehicles/new
 */

const buildingId = window.location.pathname.split('/')[2];

if (buildingId) {
    fetch(`/api/buildings/${buildingId}/vehicles`)
        .then(res => res.json())
        .then(vehicles =>
            document
                .querySelectorAll(
                    `a[href^="/buildings/${buildingId}/vehicle/${buildingId}/"][href*="/credits?building=${buildingId}"]`
                )
                .forEach(creditsBtn => {
                    const vehicleType = parseInt(
                        new URL(creditsBtn.href).pathname.split('/')[5]
                    );
                    const amountSpan = document.createElement('span');
                    amountSpan.textContent = `Haben: ${
                        vehicles.filter(
                            ({ vehicle_type }) => vehicle_type === vehicleType
                        ).length
                    }`;
                    amountSpan.classList.add('pull-right');
                    creditsBtn.parentElement.prepend(amountSpan);
                })
        );
}
