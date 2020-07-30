// ==UserScript==
// @name         LSS-OSM-MapScale
// @version      1.0.0
// @author       Jan (jxn_30)
// @description  Kartenmaßstabsanzeige für OSM
// @include      /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @run-at       document-idle
// ==/UserScript==

const position = 'bottomright'; // Mögliche Werte:
/*                                   'bottomleft' => Unten links
**                                   'bottomright' => Unten rechts
**                                   'topleft' => Oben links
**                                   'topright' => Oben rechts
*/

typeof mapkit === "undefined" && L.control.scale({position}).addTo(map);
