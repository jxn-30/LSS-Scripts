// ==UserScript==
// @name         LSS-Mission-Status-Highlight
// @version      1.0.1
// @description  Highlights rows by status in Mission
// @author       Jan (jxn_30)
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    const colors = [
        '#00F', // Status 1
        '#0F0', // Status 2
        '#FF0', // Status 3
        '#F00', // Status 4
        null,   // Status 5
    ];

    $('#mission_vehicle_at_mission tbody tr[id^="vehicle_row"] .building_list_fms, #mission_vehicle_driving tbody tr[id^="vehicle_row"] .building_list_fms').each((_, e) => {
        let status = parseInt(e.innerText);
        for (let i in colors) {
            status == parseInt(i) + 1 && (e.parentElement.parentElement.style.background = colors[i]);
        }
    });
})();
