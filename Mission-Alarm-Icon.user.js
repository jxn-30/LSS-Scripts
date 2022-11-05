// ==UserScript==
// @name         LSS-Mission-Alarm-Icon
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Optionally add an Icon to alarm btn if specific vehicle type is selected
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

    const icons = {
        'plus': ['RTW', 'Super-Heli'], // Wenn ein RTW oder ein Fahrzeug mit der eigenen Fahrzeugklasse "Super-Heli" angewählt ist
        'fire': ['LF 20', 5] // Wenn ein LF 20 ohne eigene Fahrzeugklasse oder ein GW-Atemschutz (5) mit eigener Fahrzeugklasse angewählt ist.
    };

    const iconMap = Object.fromEntries(Object.keys(icons).map(icon => {
        const element = document.createElement('span');
        element.classList.add('glyphicon', 'hidden', `glyphicon-${icon}`)
        return [icon, element]
    }));
    const alarmBtn = document.getElementById('mission_alarm_btn')
    alarmBtn.insertAdjacentHTML('afterbegin', `&nbsp;`);
    Object.values(iconMap).reverse().forEach(icon => alarmBtn.insertAdjacentElement('afterbegin', icon));

    $("body").on("change", ".vehicle_checkbox", function() {
        Object.values(iconMap).forEach(icon => icon.classList.add('hidden'));
        Array.from(document.querySelectorAll('#vehicle_show_table_body_all .vehicle_select_table_tr')).filter(r => r.querySelector('.vehicle_checkbox:checked')).flatMap(vehicle => [vehicle.getAttribute('vehicle_type'), vehicle.querySelector('.vehicle_checkbox').getAttribute('vehicle_type_id')]).filter(x => x).forEach(type => Object.entries(icons).filter(icon => icon[1].includes(type)).forEach(icon => iconMap[icon[0]].classList.remove('hidden')));
    });
})();
