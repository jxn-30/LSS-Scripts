// ==UserScript==
// @name            [LSS] Alarm-Icons
// @name:de         [LSS] Alarm-Icons
// @namespace       https://jxn.lss-manager.de
// @version         2023.06.03+1509
// @author          Jan (jxn_30)
// @description     Allows to show icons on the alarm button based on selected vehicle types
// @description:de  Zeigt Icons auf dem Alarmbutton basierend auf ausgewählten Fahrzeugtypen an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/alarmIcons.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/alarmIcons.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/18549-erledigt-symbol-beim-alamieren-von-rd/&postID=347223#post347223
// @match           https://www.operacni-stredisko.cz/*
// @match           https://policie.operacni-stredisko.cz/*
// @match           https://www.alarmcentral-spil.dk/*
// @match           https://politi.alarmcentral-spil.dk/*
// @match           https://www.leitstellenspiel.de/*
// @match           https://polizei.leitstellenspiel.de/*
// @match           https://www.missionchief-australia.com/*
// @match           https://police.missionchief-australia.com/*
// @match           https://www.missionchief.co.uk/*
// @match           https://police.missionchief.co.uk/*
// @match           https://www.missionchief.com/*
// @match           https://police.missionchief.com/*
// @match           https://www.centro-de-mando.es/*
// @match           https://www.centro-de-mando.mx/*
// @match           https://www.hatakeskuspeli.com/*
// @match           https://poliisi.hatakeskuspeli.com/*
// @match           https://www.operateur112.fr/*
// @match           https://police.operateur112.fr/*
// @match           https://www.operatore112.it/*
// @match           https://polizia.operatore112.it/*
// @match           https://www.missionchief-japan.com/*
// @match           https://www.missionchief-korea.com/*
// @match           https://www.nodsentralspillet.com/*
// @match           https://politiet.nodsentralspillet.com/*
// @match           https://www.meldkamerspel.com/*
// @match           https://politie.meldkamerspel.com/*
// @match           https://www.operatorratunkowy.pl/*
// @match           https://policja.operatorratunkowy.pl/*
// @match           https://www.operador193.com/*
// @match           https://www.jogo-operador112.com/*
// @match           https://policia.jogo-operador112.com/*
// @match           https://www.jocdispecerat112.com/*
// @match           https://www.dispetcher112.ru/*
// @match           https://www.dispecerske-centrum.com/*
// @match           https://www.larmcentralen-spelet.se/*
// @match           https://polis.larmcentralen-spelet.se/*
// @match           https://www.112-merkez.com/*
// @match           https://www.dyspetcher101-game.com/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Alarm-Icons
 * @name:de Alarm-Icons
 * @description Allows to show icons on the alarm button based on selected vehicle types
 * @description:de Zeigt Icons auf dem Alarmbutton basierend auf ausgewählten Fahrzeugtypen an
 * @forum https://forum.leitstellenspiel.de/index.php?thread/18549-erledigt-symbol-beim-alamieren-von-rd/&postID=347223#post347223
 */

/** @type {Record<string, Array<string|number>>} */
const icons = {
    // icons: https://getbootstrap.com/docs/3.3/components/#glyphicons-glyphs
    // vehicle-IDs: https://api.lss-manager.de/de_DE/vehicles
    // text → eigene Fahrzeugklasse bzw. Fahrzeugtyp ohne eigene Fahrzeugklasse
    // zahl → Fahrzeugtyp-ID, eigene Fahrzeugklassen inklusive
    plus: ['RTW', 'Super-Heli'], // Wenn ein RTW oder ein Fahrzeug mit der eigenen Fahrzeugklasse "Super-Heli" angewählt ist
    fire: ['LF 20', 5], // Wenn ein LF 20 ohne eigene Fahrzeugklasse oder ein GW-Atemschutz (5) mit eigener Fahrzeugklasse angewählt ist.
};

/** @type {Record<string, HTMLSpanElement>} */
const iconMap = Object.fromEntries(
    Object.keys(icons).map(icon => {
        const element = document.createElement('span');
        element.classList.add('glyphicon', 'hidden', `glyphicon-${icon}`);
        return [icon, element];
    })
);

const alarmBtn = document.querySelector('#mission_alarm_btn');
alarmBtn?.prepend(...Object.values(iconMap).reverse(), '\xa0');

document
    .querySelector('#vehicle_show_table_body_all')
    ?.addEventListener('change', () => {
        Object.values(iconMap).forEach(icon => icon.classList.add('hidden'));
        Array.from(
            document.querySelectorAll(
                '#vehicle_show_table_body_all .vehicle_select_table_tr'
            )
        )
            .filter(r => r.querySelector('.vehicle_checkbox:checked'))
            .flatMap(vehicle => [
                vehicle.getAttribute('vehicle_type'),
                vehicle
                    .querySelector('.vehicle_checkbox')
                    .getAttribute('vehicle_type_id'),
            ])
            .filter(x => x)
            .forEach(type =>
                Object.entries(icons)
                    .filter(icon => icon[1].includes(type))
                    .forEach(icon =>
                        iconMap[icon[0]].classList.remove('hidden')
                    )
            );
    });
