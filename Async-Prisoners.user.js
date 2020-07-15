// ==UserScript==
// @name         LSS-Async-Prisoners
// @version      1.0.1
// @description  Enables async prisoner transport in mission window
// @author       Jan (jxn_30)
// @include      https://www.leitstellenspiel.de/missions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector('.vehicle_prisoner_select')) {
        const prisonersLabel = document.getElementById('h2_prisoners');
        let currentPrisoners = parseInt(
            prisonersLabel.textContent.trim().match(/^\d+/)[0] || '0'
        );
        prisonersLabel &&
            currentPrisoners &&
            document
            .getElementById('mission_vehicle_at_mission')
            .addEventListener('click', e => {
            const target = e.target;
            if (!target.matches('a.btn.btn-success[href^="/vehicles/"][href*="/gefangener/"], a.btn.btn-warning[href^="/vehicles/"][href*="/gefangener/"]') || currentPrisoners <= 1)
                return;
            e.preventDefault();
            $.get(target.getAttribute('href'), () => {
                const vehicleId = target.parentElement.getAttribute(
                    'vehicle_id'
                );
                document
                    .getElementById(`vehicle_row_${vehicleId}`)
                    .remove();
                target.parentElement.parentElement.remove();
                currentPrisoners--;
                prisonersLabel.textContent =
                    prisonersLabel.textContent
                    .trim()
                    .replace(
                    /^\d+/,
                    currentPrisoners.toString()
                ) || '';
                if (!currentPrisoners)
                    Array.from(
                        document.querySelectorAll(
                            '.vehicle_prisoner_select'
                        )
                    ).forEach(p => p.remove());
            });
        });
    }
})();
