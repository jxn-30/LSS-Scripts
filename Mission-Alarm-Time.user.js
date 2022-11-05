// ==UserScript==
// @name         LSS-Mission-Alarm-Time
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Shows the maximum time of all selected vehicles.
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
        $('.customAllianceShareText:first-of-type').click();
    });
})();
