// ==UserScript==
// @name            [LSS] Faster ARR Availability Check
// @name:de         [LSS] Schnellere AAO-Verfügbarkeitsprüfung
// @namespace       https://jxn.lss-manager.de
// @version         2024.08.20+1905
// @author          Jan (jxn_30)
// @description     This script speeds up the availability check of AAOs and vehicle groups.
// @description:de  Dieses Skript beschleunigt die Verfügbarkeitsprüfung von AAOs und Zügen.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/fasterAAOAvailabilityCheck.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/fasterAAOAvailabilityCheck.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/22896-aaos-nur-pro-kategorie-laden/
// @match           https://www.operacni-stredisko.cz/missions/*
// @match           https://policie.operacni-stredisko.cz/missions/*
// @match           https://www.alarmcentral-spil.dk/missions/*
// @match           https://politi.alarmcentral-spil.dk/missions/*
// @match           https://www.leitstellenspiel.de/missions/*
// @match           https://polizei.leitstellenspiel.de/missions/*
// @match           https://www.missionchief-australia.com/missions/*
// @match           https://police.missionchief-australia.com/missions/*
// @match           https://www.missionchief.co.uk/missions/*
// @match           https://police.missionchief.co.uk/missions/*
// @match           https://www.missionchief.com/missions/*
// @match           https://police.missionchief.com/missions/*
// @match           https://www.centro-de-mando.es/missions/*
// @match           https://www.centro-de-mando.mx/missions/*
// @match           https://www.hatakeskuspeli.com/missions/*
// @match           https://poliisi.hatakeskuspeli.com/missions/*
// @match           https://www.operateur112.fr/missions/*
// @match           https://police.operateur112.fr/missions/*
// @match           https://www.operatore112.it/missions/*
// @match           https://polizia.operatore112.it/missions/*
// @match           https://www.missionchief-japan.com/missions/*
// @match           https://www.missionchief-korea.com/missions/*
// @match           https://www.nodsentralspillet.com/missions/*
// @match           https://politiet.nodsentralspillet.com/missions/*
// @match           https://www.meldkamerspel.com/missions/*
// @match           https://politie.meldkamerspel.com/missions/*
// @match           https://www.operatorratunkowy.pl/missions/*
// @match           https://policja.operatorratunkowy.pl/missions/*
// @match           https://www.operador193.com/missions/*
// @match           https://www.jogo-operador112.com/missions/*
// @match           https://policia.jogo-operador112.com/missions/*
// @match           https://www.jocdispecerat112.com/missions/*
// @match           https://www.dispetcher112.ru/missions/*
// @match           https://www.dispecerske-centrum.com/missions/*
// @match           https://www.larmcentralen-spelet.se/missions/*
// @match           https://polis.larmcentralen-spelet.se/missions/*
// @match           https://www.112-merkez.com/missions/*
// @match           https://www.dyspetcher101-game.com/missions/*
// @run-at          document-idle
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name Faster ARR Availability Check
 * @name:de Schnellere AAO-Verfügbarkeitsprüfung
 * @description This script speeds up the availability check of AAOs and vehicle groups.
 * @description:de Dieses Skript beschleunigt die Verfügbarkeitsprüfung von AAOs und Zügen.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/22896-aaos-nur-pro-kategorie-laden/
 * @match /missions/*
 * @grant unsafeWindow
 */

/* global $, aao_available, vehicle_group_available */

// update the aaoCheckAvailable to only check visible AAOs and vehicle groups.
unsafeWindow.aaoCheckAvailable = (calculateTime = false) => {
    // mark all AAO-Tabs as unchecked
    document
        .querySelectorAll(
            '.tab-pane:not(.active)[data-aaos-availability-checked]'
        )
        .forEach(pane => delete pane.dataset.aaosAvailabilityChecked);

    // check availability of all AAOs without category and within current category
    document
        .querySelectorAll(
            ':where(#mission_aao_no_category, #aao_without_category, .tab-pane.active:not([data-aaos-availability-checked])) .aao_btn'
        )
        .forEach(btn =>
            aao_available(Number(btn.getAttribute('aao_id')), calculateTime)
        );
    // check availability of all vehicle groups within current category
    document
        .querySelectorAll(
            ':where(#mission_aao_no_category, #aao_without_category, .tab-pane.active:not([data-aaos-availability-checked])) .vehicle_group'
        )
        .forEach(btn =>
            vehicle_group_available(
                Number(btn.getAttribute('vehicle_group_id')),
                calculateTime
            )
        );

    // mark current category as checked
    document.querySelector('.tab-pane.active').dataset.aaosAvailabilityChecked =
        '';
};

// update the vehicle_group_available to be more performant
unsafeWindow.vehicle_group_available = (id, calculateTime = false) => {
    const groupEl = document.getElementById(`vehicle_group_${id}`);
    const vehicles = JSON.parse(groupEl.getAttribute('vehicles') ?? '[]');
    let maxTime = -1;
    let allOk = true;
    for (const [vehicleId] of vehicles) {
        const vehicleEl = document.getElementById(
            `vehicle_checkbox_${vehicleId}`
        );
        if (!vehicleEl || vehicleEl.disabled) {
            allOk = false;
            break;
        }
        if (!calculateTime) continue;
        const time = parseInt(
            document
                .getElementById(`vehicle_sort_${vehicleId}`)
                ?.getAttribute('timevalue')
        );
        if (!Number.isNaN(time)) {
            maxTime = window.aao_maxtime({ max_time: time });
        }
    }

    const availableEl = document.getElementById(`available_${id}`);
    availableEl?.classList.remove(
        'label-success',
        'label-default',
        'label-danger'
    );

    const availableSpan = document.createElement('span');
    availableSpan.classList.add('glyphicon');
    availableSpan.ariaHidden = 'true';
    availableEl?.replaceChildren(availableSpan);

    const timeEl =
        calculateTime ?
            document.getElementById(`vehicle_group_timer_${id}`)
        :   undefined;

    if (allOk) {
        availableEl?.classList.add('label-success');
        availableSpan.classList.add('glyphicon-ok');
        if (calculateTime && maxTime > 0) {
            timeEl?.replaceChildren(window.formatTime(maxTime));
        }
    } else {
        availableEl?.classList.add('label-danger');
        availableSpan.classList.add('glyphicon-remove');
        if (calculateTime) timeEl?.replaceChildren('-');
    }
};

const CALCULATE_TIME = !!document.querySelector('.aao_timer');

// This is ugly jQuery, but we can't do it without unfortunately
$('#aao-tabs').on('shown.bs.tab', () => {
    // check availability of all AAOs and vehicle groups within current category
    document
        .querySelectorAll(
            '.tab-pane.active:not([data-aaos-availability-checked]) .aao_btn'
        )
        .forEach(btn =>
            aao_available(Number(btn.getAttribute('aao_id')), CALCULATE_TIME)
        );
    document
        .querySelectorAll(
            '.tab-pane.active:not([data-aaos-availability-checked]) .vehicle_group'
        )
        .forEach(btn =>
            vehicle_group_available(
                Number(btn.getAttribute('vehicle_group_id')),
                CALCULATE_TIME
            )
        );
    // mark current category as checked
    document.querySelector('.tab-pane.active').dataset.aaosAvailabilityChecked =
        '';
});
