// ==UserScript==
// @name        LSS Fahrzeugmarkt Zeige Anzahl
// @version     1.0.1
// @description Zeigt im Fahrzeugmarkt wie viele Fahrzeuge auf der aktuell gebauten Wache bereits vorhanden sind vom jeweiligen Typ.
// @author      Jan (jxn_30)
// @match        https://www.operacni-stredisko.cz/vehicles/new
// @match        https://policie.operacni-stredisko.cz/vehicles/new
// @match        https://www.alarmcentral-spil.dk/vehicles/new
// @match        https://politi.alarmcentral-spil.dk/vehicles/new
// @match        https://www.leitstellenspiel.de/vehicles/new
// @match        https://polizei.leitstellenspiel.de/vehicles/new
// @match        https://www.missionchief-australia.com/vehicles/new
// @match        https://police.missionchief-australia.com/vehicles/new
// @match        https://www.missionchief.co.uk/vehicles/new
// @match        https://police.missionchief.co.uk/vehicles/new
// @match        https://www.missionchief.com/vehicles/new
// @match        https://police.missionchief.com/vehicles/new
// @match        https://www.centro-de-mando.es/vehicles/new
// @match        https://www.centro-de-mando.mx/vehicles/new
// @match        https://www.hatakeskuspeli.com/vehicles/new
// @match        https://poliisi.hatakeskuspeli.com/vehicles/new
// @match        https://www.operateur112.fr/vehicles/new
// @match        https://police.operateur112.fr/vehicles/new
// @match        https://www.operatore112.it/vehicles/new
// @match        https://polizia.operatore112.it/vehicles/new
// @match        https://www.missionchief-japan.com/vehicles/new
// @match        https://www.missionchief-korea.com/vehicles/new
// @match        https://www.nodsentralspillet.com/vehicles/new
// @match        https://politiet.nodsentralspillet.com/vehicles/new
// @match        https://www.meldkamerspel.com/vehicles/new
// @match        https://politie.meldkamerspel.com/vehicles/new
// @match        https://www.operatorratunkowy.pl/vehicles/new
// @match        https://policja.operatorratunkowy.pl/vehicles/new
// @match        https://www.operador193.com/vehicles/new
// @match        https://www.jogo-operador112.com/vehicles/new
// @match        https://policia.jogo-operador112.com/vehicles/new
// @match        https://www.jocdispecerat112.com/vehicles/new
// @match        https://www.dispetcher112.ru/vehicles/new
// @match        https://www.dispecerske-centrum.com/vehicles/new
// @match        https://www.larmcentralen-spelet.se/vehicles/new
// @match        https://polis.larmcentralen-spelet.se/vehicles/new
// @match        https://www.112-merkez.com/vehicles/new
// @match        https://www.dyspetcher101-game.com/vehicles/new
// @grant       none
// ==/UserScript==

(async () => {
    if(!sessionStorage.aVehicles || JSON.parse(sessionStorage.aVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.aVehicles).userId != window.user_id) {
        await window.$.getJSON('/api/vehicles').done(data => sessionStorage.setItem('aVehicles', JSON.stringify({lastUpdate: new Date().getTime(), value: data, userId: window.user_id})) );
    }
    const aVehicles = JSON.parse(sessionStorage.aVehicles).value;

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
