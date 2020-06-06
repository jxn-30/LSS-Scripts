// ==UserScript==
// @name         LSS-Mission-Alarm-Icon
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Optionally add an Icon to alarm btn if specific vehicle type is selected
// @author       Jan (KBOE2)
// @include      /^https?:\/\/(?:w{3}\.)?(?:leitstellenspiel\.de|(?:meldkamerspel|missionchief|missionchief-australia|nodsentralspillet|112-merkez|jogo-operador112|operador193|dyspetcher101-game|missionchief-japan|jocdispecerat112|missionchief-korea|hatakeskuspeli|dispecerske-centrum)\.com|missionchief\.co\.uk|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|operacni-stredisko\.cz|centro-de-mando\.mx)\/missions/\d+$/
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
