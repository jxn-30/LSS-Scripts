// ==UserScript==
// @name        LSS Fahrzeugmarkt Zeige Anzahl
// @version     1.0.3
// @description Zeigt im Fahrzeugmarkt wie viele Fahrzeuge auf der aktuell gebauten Wache bereits vorhanden sind vom jeweiligen Typ.
// @author      Jan (jxn_30)
// @match       https://www.operacni-stredisko.cz/buildings/*/vehicles/new
// @match       https://policie.operacni-stredisko.cz/buildings/*/vehicles/new
// @match       https://www.alarmcentral-spil.dk/buildings/*/vehicles/new
// @match       https://politi.alarmcentral-spil.dk/buildings/*/vehicles/new
// @match       https://www.leitstellenspiel.de/buildings/*/vehicles/new
// @match       https://polizei.leitstellenspiel.de/buildings/*/vehicles/new
// @match       https://www.missionchief-australia.com/buildings/*/vehicles/new
// @match       https://police.missionchief-australia.com/buildings/*/vehicles/new
// @match       https://www.missionchief.co.uk/buildings/*/vehicles/new
// @match       https://police.missionchief.co.uk/buildings/*/vehicles/new
// @match       https://www.missionchief.com/buildings/*/vehicles/new
// @match       https://police.missionchief.com/buildings/*/vehicles/new
// @match       https://www.centro-de-mando.es/buildings/*/vehicles/new
// @match       https://www.centro-de-mando.mx/buildings/*/vehicles/new
// @match       https://www.hatakeskuspeli.com/buildings/*/vehicles/new
// @match       https://poliisi.hatakeskuspeli.com/buildings/*/vehicles/new
// @match       https://www.operateur112.fr/buildings/*/vehicles/new
// @match       https://police.operateur112.fr/buildings/*/vehicles/new
// @match       https://www.operatore112.it/buildings/*/vehicles/new
// @match       https://polizia.operatore112.it/buildings/*/vehicles/new
// @match       https://www.missionchief-japan.com/buildings/*/vehicles/new
// @match       https://www.missionchief-korea.com/buildings/*/vehicles/new
// @match       https://www.nodsentralspillet.com/buildings/*/vehicles/new
// @match       https://politiet.nodsentralspillet.com/buildings/*/vehicles/new
// @match       https://www.meldkamerspel.com/buildings/*/vehicles/new
// @match       https://politie.meldkamerspel.com/buildings/*/vehicles/new
// @match       https://www.operatorratunkowy.pl/buildings/*/vehicles/new
// @match       https://policja.operatorratunkowy.pl/buildings/*/vehicles/new
// @match       https://www.operador193.com/buildings/*/vehicles/new
// @match       https://www.jogo-operador112.com/buildings/*/vehicles/new
// @match       https://policia.jogo-operador112.com/buildings/*/vehicles/new
// @match       https://www.jocdispecerat112.com/buildings/*/vehicles/new
// @match       https://www.dispetcher112.ru/buildings/*/vehicles/new
// @match       https://www.dispecerske-centrum.com/buildings/*/vehicles/new
// @match       https://www.larmcentralen-spelet.se/buildings/*/vehicles/new
// @match       https://polis.larmcentralen-spelet.se/buildings/*/vehicles/new
// @match       https://www.112-merkez.com/buildings/*/vehicles/new
// @match       https://www.dyspetcher101-game.com/buildings/*/vehicles/new
// @grant       none
// ==/UserScript==

(async () => {
    let aVehicles = JSON.parse(sessionStorage.aVehicles || '{value: []}').value;
    if(!sessionStorage.aVehicles || JSON.parse(sessionStorage.aVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.aVehicles).userId != window.user_id) {
        try {
            aVehicles = await window.$.getJSON('/api/vehicles');
            sessionStorage.setItem('aVehicles', JSON.stringify({
                lastUpdate: new Date().getTime(),
                value: aVehicles,
                userId: window.user_id
            }));
        } catch (e) {
            // vehicles are too great to store
        }
    }

    const buildingId = parseInt(window.location.pathname.split('/')[2]);

    const vehiclesOnBuilding = aVehicles.filter(({building_id}) => building_id === buildingId);

    document.querySelectorAll(`a[href^="/buildings/${buildingId}/vehicle/${buildingId}/"][href*="/credits?building=${buildingId}"]`).forEach(creditsBtn => {
        const vehicleType = parseInt(new URL(creditsBtn.href).pathname.split('/')[5]);
        const amountSpan = document.createElement('span');
        amountSpan.textContent = `Haben: ${vehiclesOnBuilding.filter(({vehicle_type}) => vehicle_type === vehicleType).length}`;
        amountSpan.classList.add('pull-right');
        creditsBtn.parentElement.prepend(amountSpan);
    });
})();
