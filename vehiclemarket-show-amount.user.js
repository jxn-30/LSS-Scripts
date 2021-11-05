// ==UserScript==
// @name        LSS Fahrzeugmarkt Zeige Anzahl
// @version     1.0.0
// @description Zeigt im Fahrzeugmarkt wie viele Fahrzeuge auf der aktuell gebauten Wache bereits vorhanden sind vom jeweiligen Typ.
// @author      Jan (jxn_30)
// @include     /^https?:\/\/[www.]*(?:leitstellenspiel\.de|meldkamerspel\.com|missionchief\.com|missionchief\.co.uk|missionchief-australia\.com|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com|jocdispecerat112\.com|missionchief-korea\.com)\/buildings/\d+\/vehicles\/new\/?$/
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
