// ==UserScript==
// @name         LSS-Mission-Vehicle-Name-Highlight
// @version      1.0.0
// @description  Highlights vehicles in alarm window
// @author       Jan (KBOE2)
// @include      https://www.leitstellenspiel.de/missions/*
// @include      *://missionchief.co.uk/missions/*
// @include      *://www.missionchief.co.uk/missions/*
// @include      *://missionchief.com/missions/*
// @include      *://www.missionchief.com/missions/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    const give_alert = true;
    const colors = {
        'Benz': '#f00',
    };
    let types = Object.keys(colors);
    $('#mission_vehicle_at_mission tbody tr[id^="vehicle_row"], #mission_vehicle_driving tbody tr[id^="vehicle_row"]').each((_, row) => {
        let vehicle = row.querySelector('td:nth-of-type(2)').innerText;
        types.forEach(type => {
            if (vehicle.toLowerCase().match(type.toLowerCase())) $(row).css('background-color', colors[type])
        });
    });
})();
