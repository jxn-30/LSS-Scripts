// ==UserScript==
// @name         LSS-Einsatzdauer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Zeigt die Einsatzdauer in der Einsatzliste an
// @author       KBOE2
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @include      https://www.leitstellenspiel.de/*
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
		}
		missionTimerOrig(t);
	};
})();
