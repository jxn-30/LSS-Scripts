// ==UserScript==
// @name         LSS-Calendar-Gift-Highlight
// @version      1.0.0
// @author       Jan (jxn_30)
// @description  Färbt das Geschenk-Icon grün, wenn der tägliche Login noch nicht abgeholt wurde.
// @include      /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @run-at       document-idle
// ==/UserScript==

(() => {
    const dailyBonusIcon = document.querySelector('#daily-bonus .bonus-active');
    if (!dailyBonusIcon) return;
    document.querySelector('#menu_daily_rewards .glyphicon-gift')?.style.setProperty('color', '#44c746');
    new MutationObserver((_, observer) => {if (!dailyBonusIcon.classList.contains('bonus-active')){document.querySelector('#menu_daily_rewards .glyphicon-gift')?.style.removeProperty('color'); observer.disconnect();}}).observe(dailyBonusIcon, {attributeFilter: ['class']});
})();
