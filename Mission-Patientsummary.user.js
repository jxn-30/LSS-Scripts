// ==UserScript==
// @name         LSS-Mission-Patientsummary
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Summarizes the current patients need.
// @author       Jan (jxn_30)
// @include      https://www.leitstellenspiel.de/missions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const patientIcon = document.querySelector(
        '.patientPrisonerIcon[src*="patient"]'
    );
    if (!patientIcon) return;

    const requirements = {};
    Array.from(document.querySelectorAll('.mission_patient .alert-danger'))
        .flatMap(alert =>
                 (alert.textContent?.replace(/^[^:]*:/, '').trim() || '')
                  .split(',')
                  .map(req => req.trim())
                 )
                  .filter(pat => pat)
                  .forEach(req => {
                  if (!requirements.hasOwnProperty(req)) requirements[req] = 0;
                  requirements[req]++;
                  });

                  const reqStr = Object.entries(requirements)
                  .map(([req, amount]) => `${req}: ${amount.toLocaleString()}`)
        .sort()
        .join(', ');

    patientIcon.insertAdjacentHTML(
        'afterend',
        `&nbsp;|&nbsp;${reqStr}`
    );
})();
