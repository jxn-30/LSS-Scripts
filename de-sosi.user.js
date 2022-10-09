// ==UserScript==
// @name         LSS SoSi-Switch
// @version      1.0.0
// @description  Show the SoSi-Switch in Alarmwindows
// @author       Jan (jxn_30)
// @namespace    https://jxn.lss-manager.de/
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const switchBtn = document.createElement('a');
    switchBtn.id = 'sonderrechte_switch';
    switchBtn.textContent = 'SoSi an';
    switchBtn.classList.add('btn', 'btn-success', 'btn-xs');

    const sosiInput = document.createElement('input');
    sosiInput.name = 'sonderrechte';
    sosiInput.value = '1';
    sosiInput.type = 'hidden';

    switchBtn.addEventListener('click', e => {
        e.preventDefault();
        if (switchBtn.classList.contains('btn-success')) {
            switchBtn.textContent = 'SoSi aus';
            switchBtn.classList.replace('btn-success', 'btn-warning');
            sosiInput.value = '0';
        } else {
            switchBtn.textContent = 'SoSi an';
            switchBtn.classList.replace('btn-warning', 'btn-success');
            sosiInput.value = '1';
        }
    });

    document.getElementById('h2_free_vehicles')?.prepend(switchBtn, sosiInput);
})();
