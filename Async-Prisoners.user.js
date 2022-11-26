// ==UserScript==
// @name            [LSS] Async Prisoners
// @name:de         [LSS] Asynchrone Gefangene
// @namespace       https://jxn.lss-manager.de
// @version         2022.11.26+1758
// @author          Jan (jxn_30)
// @description     [Currently DE only] transport prisoners without reloading the mission window
// @description:de  Verhindert das Neuladen der Einsatzseite beim Abtransportieren von Gefangenen
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/asyncPrisoners.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/asyncPrisoners.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/18769-gefangene-ohne-seite-neu-zu-laden-abschicken/
// @match           https://www.leitstellenspiel.de/missions/*
// @match           https://polizei.leitstellenspiel.de/missions/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Async Prisoners
 * @name:de Asynchrone Gefangene
 * @description [Currently DE only] transport prisoners without reloading the mission window
 * @description:de Verhindert das Neuladen der Einsatzseite beim Abtransportieren von Gefangenen
 * @forum https://forum.leitstellenspiel.de/index.php?thread/18769-gefangene-ohne-seite-neu-zu-laden-abschicken/
 * @locale de_DE
 * @match /missions/*
 * @old Async-Prisoners
 */

(function () {
    'use strict';

    if (document.querySelector('.vehicle_prisoner_select')) {
        const prisonersLabel = document.getElementById('h2_prisoners');
        let currentPrisoners = parseInt(
            prisonersLabel.textContent.trim().match(/^\d+/)[0] || '0'
        );
        if (prisonersLabel && currentPrisoners) {
            document
                .getElementById('mission_vehicle_at_mission')
                .addEventListener('click', e => {
                    const target = e.target;
                    if (
                        !target.matches(
                            'a.btn.btn-success[href^="/vehicles/"][href*="/gefangener/"], a.btn.btn-warning[href^="/vehicles/"][href*="/gefangener/"]'
                        ) ||
                        currentPrisoners <= 1
                    ) {
                        return;
                    }
                    e.preventDefault();
                    fetch(target.getAttribute('href')).then(() => {
                        const vehicleId =
                            target.parentElement.getAttribute('vehicle_id');
                        const amount = 1;
                        let remainingCells = -1;
                        const newTextContent =
                            target.textContent.trim().replace(
                                /(\(.*?: )(\d+)(, .*\)$)/,
                                (_, before, cells, after) =>
                                    `${before}${(() => {
                                        remainingCells =
                                            parseInt(cells) - amount;
                                        return remainingCells;
                                    })()}${after}`
                            ) || target.textContent;
                        Array.from(
                            document.querySelectorAll(
                                `.vehicle_prisoner_select a.btn[href$="/gefangener/${
                                    target
                                        .getAttribute('href')
                                        .match(/\d+$/)[0] || '-1'
                                }"]`
                            )
                        ).forEach(cell => {
                            cell.textContent = newTextContent;
                            if (remainingCells <= 0) {
                                cell.classList.replace(
                                    'btn-success',
                                    'btn-danger'
                                );
                                cell.classList.replace(
                                    'btn-warning',
                                    'btn-danger'
                                );
                            }
                        });

                        document
                            .getElementById(`vehicle_row_${vehicleId}`)
                            .remove();
                        target.parentElement.parentElement.remove();
                        currentPrisoners -= amount;
                        prisonersLabel.textContent =
                            prisonersLabel.textContent
                                .trim()
                                .replace(/^\d+/, currentPrisoners.toString()) ||
                            '';
                        if (!currentPrisoners) {
                            Array.from(
                                document.querySelectorAll(
                                    '.vehicle_prisoner_select'
                                )
                            ).forEach(p => p.remove());
                        }
                    });
                });
        }
    }
})();
