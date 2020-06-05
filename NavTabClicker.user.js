// ==UserScript==
// @name         LSS-NavTabClicker
// @version      1.0.0
// @author       Jan (jxn_30)
// @description  Auto opens a tab if hash in URL
// @include      /^https?:\/\/(?:w{3}\.)?(?:leitstellenspiel\.de|(?:meldkamerspel|missionchief|missionchief-australia|nodsentralspillet|112-merkez|jogo-operador112|operador193|dyspetcher101-game|missionchief-japan|jocdispecerat112|missionchief-korea|hatakeskuspeli|dispecerske-centrum)\.com|missionchief\.co\.uk|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|operacni-stredisko\.cz|centro-de-mando\.mx)\/.*$/
// @run-at       document-idle
// ==/UserScript==
document.querySelector(`.nav-tabs a[href="${window.location.hash}"]`)?.click();
