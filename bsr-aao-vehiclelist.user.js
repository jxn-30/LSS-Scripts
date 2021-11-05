// ==UserScript==
// @name        LSS BSR AAO über Fahrzeugliste
// @version     1.0.0
// @description Macht die AAO über die Fahrzeugliste in Bereitstellungsräumen
// @author      Jan (jxn_30)
// @include     /^https?:\/\/[www.]*(?:leitstellenspiel\.de|meldkamerspel\.com|missionchief\.com|missionchief\.co.uk|missionchief-australia\.com|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com|jocdispecerat112\.com|missionchief-korea\.com)\/buildings/\d+\/?$/
// @grant       none
// ==/UserScript==

document.querySelector('form[action^="/buildings/"][action$="/bereitstellungaufloesen"]')?.before(document.getElementById('mission-aao-group')?.parentElement?.parentElement)
