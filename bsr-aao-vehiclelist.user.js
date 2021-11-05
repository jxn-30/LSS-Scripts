// ==UserScript==
// @name        LSS BSR AAO über Fahrzeugliste
// @version     1.0.0
// @description Macht die AAO über die Fahrzeugliste in Bereitstellungsräumen
// @author      Jan (jxn_30)
// @include     /^https?:\/\/(?:w{3}\.)?(?:leitstellenspiel\.de|(?:meldkamerspel|missionchief|missionchief-australia|nodsentralspillet|112-merkez|jogo-operador112|operador193|dyspetcher101-game|missionchief-japan|jocdispecerat112|missionchief-korea|hatakeskuspeli|dispecerske-centrum)\.com|missionchief\.co\.uk|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|operacni-stredisko\.cz|centro-de-mando\.mx)\/missions/\d+$/
// @grant       none
// ==/UserScript==

document.querySelector('form[action^="/buildings/"][action$="/bereitstellungaufloesen"]')?.before(document.getElementById('mission-aao-group')?.parentElement?.parentElement)
