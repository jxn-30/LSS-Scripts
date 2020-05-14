// ==UserScript==
// @name         LSS-Einsatzdauer
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Zeigt die Einsatzdauer in der Einsatzliste an
// @author       KBOE2
// @grant        none
// @include      /^https?:\/\/(?:w{3}\.)?(?:leitstellenspiel\.de|(?:meldkamerspel|missionchief|missionchief-australia|nodsentralspillet|112-merkez|jogo-operador112|operador193|dyspetcher101-game|missionchief-japan|jocdispecerat112|missionchief-korea|hatakeskuspeli|dispecerske-centrum)\.com|missionchief\.co\.uk|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|operacni-stredisko\.cz|centro-de-mando\.mx)\/.*$/
// ==/UserScript==

(function() {
	'use strict';

	let missionTimerOrig = missionTimer;

	missionTimer = function(t){
		var einsatzdauer = t.date_end * 1000 - new Date().getTime();
		if (einsatzdauer > 0) {
			var time = new Date(einsatzdauer - (1000 * 60 * 60));
			var timeFormated = "";
			if (time.getHours() != 0) {
				if (time.getHours() < 10) {
					timeFormated += "0";
				}
				timeFormated += time.getHours() + ':';
			}
			if (time.getMinutes() != 0) {
				if (time.getMinutes() < 10) {
					timeFormated += "0";
				}
				timeFormated += time.getMinutes() + ':';
			} else {
				timeFormated += "00:";
			}
			if (time.getSeconds() != 0) {
				if (time.getSeconds() < 10) {
					timeFormated += "0";
				}
				timeFormated += time.getSeconds();
			} else {
				timeFormated += "00";
			}
			$('#mission_overview_countdown_' + t.id).html(timeFormated);
            if ($('#mission_out_' + t.id)[0]) {
                if ($('#mission_out_' + t.id).find('.btn-danger')[0]) {
                    $('#mission_overview_countdown_' + t.id).appendTo('#mission_caption_' + t.id);
                } else {
                    $('#mission_overview_countdown_' + t.id).prependTo($('#mission_bar_outer_' + t.id).parent());
                }
            }
		}
		missionTimerOrig(t);
	};
})();
