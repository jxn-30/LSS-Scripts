// ==UserScript==
// @name         LSS-Freischalt-Counter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Jan (KBOE2)
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict'

    $('#build_new_building').click(e => {
        checkLstFn();
    });

    let checkLstFn = function() {
        if (!$('#building_building_type')[0]) return window.setTimeout(checkLstFn, 1000);
        $('#building_building_type').change(e => {
            let select = e.currentTarget
            let warningBox = $('#detail_7 .alert-danger:visible');
            if (select.value !== '7' || !warningBox[0]) return;
            $.get('/api/buildings', buildings => {
                warningBox.append(`<br>${buildings.length%25}/25 Gebäude zum Freischalten der nächsten Leitstelle`);
            });
        });
    }

    let vehicleBoxes = $('.vehicle_type.well');
    let can_grtw_naw;
    let grtw_box;
    let naw_box;
    for (let i = 0; i < vehicleBoxes.length; i++) {
        let vehicleBox = vehicleBoxes[i];
        if (vehicleBox.innerText.match(/GRTW/)) {
            can_grtw_naw = true;
            grtw_box = vehicleBox
        }
        if (vehicleBox.innerText.match(/NAW/)) {
            can_grtw_naw = true;
            naw_box = vehicleBox
        }
    }
    if (can_grtw_naw) {
        $.get('/api/buildings', buildings => {
            $.get('/api/vehicles', vehicles => {
                for (let j = 0; j < buildings.length; j++) {
                    if (buildings[j].building_type === 2) buildings[j].can_grtw_naw = true;
                    if (buildings[j].building_type === 0) {
                        for (let k = 0; k < buildings[j].extensions.length; k++) {
                            if (buildings[j].extensions[k].caption === "Rettungsdienst-Erweiterung" && buildings[j].extensions[k].available) buildings[j].can_grtw_naw = true;
                        }
                    }
                }
                let grtw_naw_buildings = buildings.filter(building => building.can_grtw_naw).length
                let grtw = vehicles.filter(vehicle => vehicle.vehicle_type === 73).length;
                let naw = vehicles.filter(vehicle => vehicle.vehicle_type === 74).length;
                /*
                    // Wird aktiviert, sobald eine Möglichkeit besteht, Premium abzufragen.
                    $(grtw_box).append(`<div class="alert alert-info">Du hast aktuell ${grtw} GRTWs von maximal ${Math.floor(grtw_naw_buildings/(user_premium ? 15 : 20))}. ${grtw_naw_buildings%(user_premium ? 15 : 20)}/${user_premium ? '15' : '20'} Rettungswachen bis zum Freischalten des nächsten GRTW</div>`);
                */
                $(naw_box).append(`<div class="alert alert-info">Du hast aktuell ${naw} NAWs von maximal ${grtw_naw_buildings}</div>`);
            });
        });
    }
})();
