// ==UserScript==
// @name         LSS-Mission-Alarm-Time
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Shows the maximum time of all selected vehicles.
// @author       Jan (KBOE2)
// @include      https://www.leitstellenspiel.de/missions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('#mission_alarm_btn').append(`&nbsp;<spann id="mission_alarm_time"></span>`);

    $("body").on("change", ".vehicle_checkbox", function() {
        $('#mission_alarm_time').text($("#mission-form .vehicle_checkbox:checked:last").parent().parent().find('td[class^="alarm_distance"]').text());
    });
})();
