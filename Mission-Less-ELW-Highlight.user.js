// ==UserScript==
// @name         LSS-Mission-Less-ELW-Highlight
// @version      1.0.1
// @description  Highlights missions in missionlist with less than required ELWs
// @author       Jan (jxn_30)
// @include      https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    fetch('https://lssm.ledbrain.de/api/missions.php')
        .then(res => res.json())
        .then(data => {
            Array.from(
                document.querySelectorAll(
                    ':not(#mission_list_sicherheitswache) [id^="mission_missing_"].alert'
                )
            ).forEach(mission => {
                const missionId = mission.id.replace(/\D*/, '');
                const panel = document.getElementById(`mission_${missionId}`);
                const missionType = parseInt(
                    panel.getAttribute('mission_type_id')
                );
                if (Number.isNaN(missionType)) return;
                const reqElw1 = data[missionType].vehicles.elw1;
                const reqElw2 = data[missionType].vehicles.elw2;
                if (!reqElw1 && !reqElw2) return;
                const elws = mission.textContent
                    .replace(/^\D+: /, '')
                    .split(/[.,]/)
                    .filter(r => r.match(/\d+ ELW [12]/));
                const elw = {};
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
            });
            const missionMarkerAddOrig = window.missionMarkerAdd;
            window.missionMarkerAdd = (...args) => {
                missionMarkerAddOrig(...args);
                const mission = args[0];
                const panel = document.getElementById(`mission_${mission.id}`);
                const missionType = mission.mtid;
                if (Number.isNaN(missionType)) return;
                const reqElw1 = data[missionType].vehicles.elw1;
                const reqElw2 = data[missionType].vehicles.elw2;
                if ((!reqElw1 && !reqElw2) || !mission.missing_text) return;
                const elws = mission.missing_text
                    .replace(/^\D+: /, '')
                    .split(/[.,]/)
                    .filter(r => r.match(/\d+ ELW [12]/));
                const elw = {};
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
        });
})();
