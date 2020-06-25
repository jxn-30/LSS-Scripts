// ==UserScript==
// @name         LSS-Mission-Less-ELW-Highlight
// @version      1.0.3
// @description  Highlights missions in missionlist with less than required ELWs
// @author       Jan (jxn_30)
// @include      https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    fetch('/einsaetze.json')
        .then(res => res.json())
        .then(data => {
        const colorize = missionId => {
            const panel = document.getElementById(`mission_${missionId}`);
            const missionType = parseInt(
                panel.getAttribute('mission_type_id')
            );
            const specs = data.find(m => m.id === missionType);
            const mission = document.getElementById(`mission_missing_${missionId}`);
            if (Number.isNaN(missionType) || !specs || !mission) return;
            const reqElw1 = specs.requirements.battalion_chief_vehicles || 0;
            const reqElw2 = specs.requirements.mobile_command_vehicles || 0;
            const elws = mission.textContent
            .replace(/^\D+: /, '')
            .split(/[.,]/)
            .filter(r => r.match(/\d+ ELW [12]/));
            const elw = {
                1: 0,
                2: 0,
            };
            elws.forEach(
                type =>
                (elw[type.match(/\d+$/)] = parseInt(
                    type.trim().match(/^\d+/)[0]
                ))

            );
            if (elw[1] < reqElw1 || elw[2] < reqElw2)
                panel.querySelector('.panel-heading').style.background =
                    'blue';
            else panel.querySelector('.panel-heading').style.background = null;
        };
        Array.from(
            document.querySelectorAll(
                ':not(#mission_list_sicherheitswache) [id^="mission_missing_"].alert'
            )
        ).forEach(({id}) => colorize(id.replace(/\D*/, '')));
        const missionMarkerAddOrig = window.missionMarkerAdd;
        window.missionMarkerAdd = (...args) => {
            missionMarkerAddOrig(...args);
            colorize(args[0].id);
        };
    });
})();
