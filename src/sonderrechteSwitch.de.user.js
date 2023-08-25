// ==UserScript==
// @name            [LSS] SoSi-Switch (DE)
// @namespace       https://jxn.lss-manager.de
// @version         2023.08.25+1029
// @author          Jan (jxn_30)
// @description     This Script is for leitstellenspiel.de only!
// @description:de  Zeigt einen Knopf zum Umschalten der Sonderrechte im Einsatzfenster an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/sonderrechteSwitch.de.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/sonderrechteSwitch.de.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/13928-mit-und-ohne-sonderrechte/&postID=463217#post463217
// @match           https://www.leitstellenspiel.de/missions/*
// @match           https://polizei.leitstellenspiel.de/missions/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name SoSi-Switch (DE)
 * @description This Script is for leitstellenspiel.de only!
 * @description:de Zeigt einen Knopf zum Umschalten der Sonderrechte im Einsatzfenster an
 * @forum https://forum.leitstellenspiel.de/index.php?thread/13928-mit-und-ohne-sonderrechte/&postID=463217#post463217
 * @locale de_DE
 * @match /missions/*
 */

(function () {
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
