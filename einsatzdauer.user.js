// ==UserScript==
// @name         LSS-Einsatzdauer
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Zeigt die Einsatzdauer in der Einsatzliste an
// @author       Jan (jxn_30)
// @grant        none
// @match        https://www.operacni-stredisko.cz/
// @match        https://policie.operacni-stredisko.cz/
// @match        https://www.alarmcentral-spil.dk/
// @match        https://politi.alarmcentral-spil.dk/
// @match        https://www.leitstellenspiel.de/
// @match        https://polizei.leitstellenspiel.de/
// @match        https://www.missionchief-australia.com/
// @match        https://police.missionchief-australia.com/
// @match        https://www.missionchief.co.uk/
// @match        https://police.missionchief.co.uk/
// @match        https://www.missionchief.com/
// @match        https://police.missionchief.com/
// @match        https://www.centro-de-mando.es/
// @match        https://www.centro-de-mando.mx/
// @match        https://www.hatakeskuspeli.com/
// @match        https://poliisi.hatakeskuspeli.com/
// @match        https://www.operateur112.fr/
// @match        https://police.operateur112.fr/
// @match        https://www.operatore112.it/
// @match        https://polizia.operatore112.it/
// @match        https://www.missionchief-japan.com/
// @match        https://www.missionchief-korea.com/
// @match        https://www.nodsentralspillet.com/
// @match        https://politiet.nodsentralspillet.com/
// @match        https://www.meldkamerspel.com/
// @match        https://politie.meldkamerspel.com/
// @match        https://www.operatorratunkowy.pl/
// @match        https://policja.operatorratunkowy.pl/
// @match        https://www.operador193.com/
// @match        https://www.jogo-operador112.com/
// @match        https://policia.jogo-operador112.com/
// @match        https://www.jocdispecerat112.com/
// @match        https://www.dispetcher112.ru/
// @match        https://www.dispecerske-centrum.com/
// @match        https://www.larmcentralen-spelet.se/
// @match        https://polis.larmcentralen-spelet.se/
// @match        https://www.112-merkez.com/
// @match        https://www.dyspetcher101-game.com/
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
