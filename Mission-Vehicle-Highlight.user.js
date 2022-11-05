// ==UserScript==
// @name         LSS-Mission-Vehicle-Highlight
// @version      1.1.2
// @description  Highlights vehicles in alarm window
// @author       Jan (jxn_30)
// @match        https://www.operacni-stredisko.cz/missions/*
// @match        https://policie.operacni-stredisko.cz/missions/*
// @match        https://www.alarmcentral-spil.dk/missions/*
// @match        https://politi.alarmcentral-spil.dk/missions/*
// @match        https://www.leitstellenspiel.de/missions/*
// @match        https://polizei.leitstellenspiel.de/missions/*
// @match        https://www.missionchief-australia.com/missions/*
// @match        https://police.missionchief-australia.com/missions/*
// @match        https://www.missionchief.co.uk/missions/*
// @match        https://police.missionchief.co.uk/missions/*
// @match        https://www.missionchief.com/missions/*
// @match        https://police.missionchief.com/missions/*
// @match        https://www.centro-de-mando.es/missions/*
// @match        https://www.centro-de-mando.mx/missions/*
// @match        https://www.hatakeskuspeli.com/missions/*
// @match        https://poliisi.hatakeskuspeli.com/missions/*
// @match        https://www.operateur112.fr/missions/*
// @match        https://police.operateur112.fr/missions/*
// @match        https://www.operatore112.it/missions/*
// @match        https://polizia.operatore112.it/missions/*
// @match        https://www.missionchief-japan.com/missions/*
// @match        https://www.missionchief-korea.com/missions/*
// @match        https://www.nodsentralspillet.com/missions/*
// @match        https://politiet.nodsentralspillet.com/missions/*
// @match        https://www.meldkamerspel.com/missions/*
// @match        https://politie.meldkamerspel.com/missions/*
// @match        https://www.operatorratunkowy.pl/missions/*
// @match        https://policja.operatorratunkowy.pl/missions/*
// @match        https://www.operador193.com/missions/*
// @match        https://www.jogo-operador112.com/missions/*
// @match        https://policia.jogo-operador112.com/missions/*
// @match        https://www.jocdispecerat112.com/missions/*
// @match        https://www.dispetcher112.ru/missions/*
// @match        https://www.dispecerske-centrum.com/missions/*
// @match        https://www.larmcentralen-spelet.se/missions/*
// @match        https://polis.larmcentralen-spelet.se/missions/*
// @match        https://www.112-merkez.com/missions/*
// @match        https://www.dyspetcher101-game.com/missions/*

// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    const give_alert = false;
    const colors = {
        'ELW 2': '#0f0',
        'FüKw': '#00f',
    };
    let types = Object.keys(colors);
    let hatFz = false;
    $('#mission_vehicle_at_mission tbody tr[id^="vehicle_row"], #mission_vehicle_driving tbody tr[id^="vehicle_row"]').each((_, row) => {
        let vehicleType = row.querySelector('small').innerText.replace(/^\(|\)$/g, '');
        types.forEach(type => {
            if (vehicleType.match(type)) $(row).css('background-color', colors[type]) && !hatFz && give_alert && alert("Brudaaa, farbiges Auto im Einsatz!");
        });
    });
})();
