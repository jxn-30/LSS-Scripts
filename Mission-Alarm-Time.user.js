// ==UserScript==
// @name         LSS-Mission-Alarm-Time
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Shows the maximum time of all selected vehicles.
// @author       Jan (KBOE2)
// @include      /^https?:\/\/[www.]*(?:leitstellenspiel\.de|missionchief\.co\.uk|missionchief\.com|meldkamerspel\.com|centro-de-mando\.es|missionchief-australia\.com|larmcentralen-spelet\.se|operatorratunkowy\.pl|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|nodsentralspillet\.com|operacni-stredisko\.cz|112-merkez\.com|jogo-operador112\.com|operador193\.com|centro-de-mando\.mx|dyspetcher101-game\.com|missionchief-japan\.com|hatakeskuspeli\.com|missionchief-korea\.com|jocdispecerat112\.com|dispecerske-centrum\.com)\/missions\/.*$/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('#mission_alarm_btn').append(`&nbsp;<spann class="mission_alarm_time"></span>`);

    const observer = new MutationObserver((mutations, observer) => {
        $('.mission_alarm_time').text($("#mission-form .vehicle_checkbox:checked:last").parent().parent().find('td[class^="alarm_distance"]').text());
        observer.disconnect();
    });

    $("body").on("change", ".vehicle_checkbox", function() {
        let distanceTime = $("#mission-form .vehicle_checkbox:checked:last").parent().parent().find('td[class^="alarm_distance"]');
        $('.mission_alarm_time').text(distanceTime.text());
        if (distanceTime.length) {
            distanceTime.find('.calculateTime').click();
            observer.observe(distanceTime[0], { childList: true });
        }
    });
})();
