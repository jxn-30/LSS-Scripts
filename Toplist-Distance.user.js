// ==UserScript==
// @name         LSS-Toplist-Distance
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Zeigt die fehlenden verdienten Credits zum nächsten Spieler in der Toplist an
// @author       Jan (jxn_30)
// @grant        none
// @include      /^https?:\/\/(?:w{3}\.)?(?:leitstellenspiel\.de|(?:meldkamerspel|missionchief|missionchief-australia|nodsentralspillet|112-merkez|jogo-operador112|operador193|dyspetcher101-game|missionchief-japan|jocdispecerat112|missionchief-korea|hatakeskuspeli|dispecerske-centrum)\.com|missionchief\.co\.uk|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|operacni-stredisko\.cz|centro-de-mando\.mx)\/toplist(\?.*)?$/
// ==/UserScript==

(async function() {
	'use strict';

    if (!window.sessionStorage.hasOwnProperty('aCredits') || JSON.parse(window.sessionStorage.aCredits).lastUpdate < (new Date().getTime() - 5 * 1000 * 60)) await fetch('/api/credits').then(res => res.json()).then(data => window.sessionStorage.setItem('aCredits', JSON.stringify({lastUpdate: new Date().getTime(), value: data})));

    let prevValue;

	document.querySelectorAll('tbody tr td:nth-of-type(2)').forEach(cell => {
        const credits = parseInt(cell.textContent.trim().match(/^\d{1,3}(?:[.,]\d{3})*/)[0].replace(/\D/g, ''));
        const distSpan = document.createElement('span');
        distSpan.innerText = (credits - (prevValue || credits)).toLocaleString();
        distSpan.style.color = 'red';
        distSpan.style.marginLeft = '1em';
        distSpan.setAttribute('title', `Zu mir selbst: ${(credits - JSON.parse(window.sessionStorage.aCredits).value.credits_user_total).toLocaleString()}`);
        cell.appendChild(distSpan);
        prevValue = credits;
    });
})();
