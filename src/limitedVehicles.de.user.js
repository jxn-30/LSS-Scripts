// ==UserScript==
// @name            [LSS] Limited Vehicles
// @namespace       https://jxn.lss-manager.de
// @version         2023.08.10+1357
// @author          Jan (jxn_30)
// @description     This Script is for leitstellenspiel.de only!
// @description:de  Zeigt für limitierte Fahrzeuge (NAW, ITW, etc.) an, wie viele vorhanden und wie viele aktuell kaufbar sind.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/limitedVehicles.de.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/limitedVehicles.de.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/24131-script-limitedvehicles-schnelle-%C3%BCbersicht-wie-viele-limitierte-fahrzeuge-man-hat/
// @match           https://www.leitstellenspiel.de/
// @match           https://polizei.leitstellenspiel.de/
// @run-at          document-idle
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name  Limited Vehicles (DE)
 * @description This Script is for leitstellenspiel.de only!
 * @description:de Zeigt für limitierte Fahrzeuge (NAW, ITW, etc.) an, wie viele vorhanden und wie viele aktuell kaufbar sind.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/24131-script-limitedvehicles-schnelle-%C3%BCbersicht-wie-viele-limitierte-fahrzeuge-man-hat/
 * @locale de_DE
 * @match /
 * @grant GM_addStyle
 */

/* global premium */

const limits = {
    31: {
        name: 'RTH',
        // one per 25 buildings but minimum 4
        limit: buildings => Math.max(4, Math.floor(buildings.length / 25)),
        limitText: 'Pro 25 Gebäude ein RTH, mindestens jedoch 4 Stück',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * 25;
            const toNext = nextAt - buildings.length;
            return [
                'Nächster RTH bei',
                nextAt,
                'Gebäuden, noch',
                toNext,
                'Gebäude bis dahin.',
            ];
        },
    },
    61: {
        name: 'Polizeihubschrauber',
        // one per 25 buildings but minimum 4
        limit: buildings => Math.max(4, Math.floor(buildings.length / 25)),
        limitText:
            'Pro 25 Gebäude ein Polizeihubschrauber, mindestens jedoch 4 Stück',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * 25;
            const toNext = nextAt - buildings.length;
            return [
                'Nächster Polizeihubschrauber bei',
                nextAt,
                'Gebäuden, noch',
                toNext,
                'Gebäude bis dahin.',
            ];
        },
    },
    73: {
        name: 'GRTW',
        // one per 20 (15 with Premium) Rettungswachen and active RD-Erweiterungen
        limit: buildings =>
            Math.floor(
                buildings.filter(
                    ({ building_type, extensions }) =>
                        building_type === 2 ||
                        (building_type === 0 &&
                            extensions.some(
                                ({ available, enabled, type_id }) =>
                                    type_id === 0 && available && enabled
                            ))
                ).length / (premium ? 15 : 20)
            ),
        limitText:
            'Pro 20 (15 mit Premium) Rettungswachen und aktiven RD-Erweiterungen ein GRTW',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * (premium ? 15 : 20);
            const toNext =
                nextAt -
                buildings.filter(
                    ({ building_type, extensions }) =>
                        building_type === 2 ||
                        (building_type === 0 &&
                            extensions.some(
                                ({ available, enabled, type_id }) =>
                                    type_id === 0 && available && enabled
                            ))
                ).length;
            return [
                'Nächster GRTW bei',
                nextAt,
                'Rettungswachen / RD-Erweiterungen, noch',
                toNext,
                'Stück bis dahin.',
            ];
        },
    },
    74: {
        name: 'NAW',
        // one per each Rettungswache and active RD-Erweiterung
        limit: buildings =>
            buildings.filter(
                ({ building_type, extensions }) =>
                    building_type === 2 ||
                    (building_type === 0 &&
                        extensions.some(
                            ({ available, enabled, type_id }) =>
                                type_id === 0 && available && enabled
                        ))
            ).length,
        limitText: 'Pro Rettungswache und aktiver RD-Erweiterung ein NAW',
        next: (buildings, limit) => {
            const nextAt = limit + 1;
            const toNext = nextAt - limit;
            return [
                'Nächster NAW bei',
                nextAt,
                'Rettungswachen / RD-Erweiterungen, noch',
                toNext,
                'Stück bis dahin.',
            ];
        },
    },
    97: {
        name: 'ITW',
        // one per 15 (10 with Premium) Rettungswachen and active RD-Erweiterungen
        limit: buildings =>
            Math.floor(
                buildings.filter(
                    ({ building_type, extensions }) =>
                        building_type === 2 ||
                        (building_type === 0 &&
                            extensions.some(
                                ({ available, enabled, type_id }) =>
                                    type_id === 0 && available && enabled
                            ))
                ).length / (premium ? 10 : 15)
            ),
        limitText:
            'Pro 15 (10 mit Premium) Rettungswachen und aktiven RD-Erweiterungen ein ITW',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * (premium ? 10 : 15);
            const toNext =
                nextAt -
                buildings.filter(
                    ({ building_type, extensions }) =>
                        building_type === 2 ||
                        (building_type === 0 &&
                            extensions.some(
                                ({ available, enabled, type_id }) =>
                                    type_id === 0 && available && enabled
                            ))
                ).length;
            return [
                'Nächster ITW bei',
                nextAt,
                'Rettungswachen / RD-Erweiterungen, noch',
                toNext,
                'Stück bis dahin.',
            ];
        },
    },
    103: {
        name: 'FuStW (DGL)',
        // one per available DGL-Extension
        limit: buildings =>
            buildings.filter(
                ({ building_type, extensions }) =>
                    building_type === 6 &&
                    extensions.some(
                        ({ available, type_id }) => type_id === 12 && available
                    )
            ).length,
        limitText: 'Pro verfügbarer DGL-Erweiterung ein FuStW (DGL)',
        next: (buildings, limit) => {
            const nextAt = limit + 1;
            const toNext = nextAt - limit;
            return [
                'Nächster FuStW (DGL) bei',
                nextAt,
                'DGL-Erweiterungen, noch',
                toNext,
                'Stück bis dahin.',
            ];
        },
    },
};

const modalId = 'jxn-limited_vehicles-modal';

// remove modal style added by Traxx
GM_addStyle(`
#${modalId} {
    position: fixed;
    padding-top: 0;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 1050;
}
#${modalId} .modal-body {
    height: unset;
    overflow-y: unset;
}
`);

// create a modal
const createModal = () => {
    let vehicles;
    let buildings;

    const getVehicles = () =>
        vehicles
            ? Promise.resolve(vehicles)
            : fetch('/api/vehicles')
                  .then(res => res.json())
                  .then(v => (vehicles = v));

    const getBuildings = () =>
        buildings
            ? Promise.resolve(buildings)
            : fetch('/api/buildings')
                  .then(res => res.json())
                  .then(b => (buildings = b));

    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = modalId;

    const dialog = document.createElement('div');
    dialog.classList.add('modal-dialog');
    dialog.style.setProperty('width', 'fit-content');

    const content = document.createElement('div');
    content.classList.add('modal-content');

    const body = document.createElement('div');
    body.classList.add('modal-body');
    body.style.setProperty('overflow', 'auto');
    body.style.setProperty('box-sizing', 'content-box');

    const close = document.createElement('span');
    close.classList.add('close');
    close.textContent = '×';
    close.addEventListener('click', event => {
        event.preventDefault();
        modal.classList.remove('in');
        modal.style.setProperty('display', 'none');
        modal.remove();
    });

    const table = document.createElement('table');
    table.classList.add(
        'table',
        'table-striped',
        'table-hover',
        'table-responsive'
    );

    const thead = document.createElement('thead');
    const headRow = thead.insertRow();
    const typeTh = document.createElement('th');
    typeTh.textContent = 'Fahrzeugtyp';
    const currentTh = document.createElement('th');
    currentTh.textContent = 'Aktuell';
    const availableTh = document.createElement('th');
    availableTh.textContent = 'Kaufbar';
    const nextTh = document.createElement('th');
    nextTh.textContent = 'Nächstes Fahrzeug';
    headRow.append(typeTh, currentTh, availableTh, nextTh);

    const tbody = document.createElement('tbody');

    const calcBtns = [];

    Object.entries(limits)
        .sort(([, { name: nameA }], [, { name: nameB }]) =>
            nameA.localeCompare(nameB)
        )
        .forEach(([vehicleTypeId, { name, limit, limitText, next }]) => {
            const row = tbody.insertRow();
            row.insertCell().textContent = name;

            const currentTd = row.insertCell();
            const availableTd = row.insertCell();
            const nextTd = row.insertCell();

            currentTd.setAttribute('colspan', '3');
            availableTd.style.setProperty('display', 'none');
            nextTd.style.setProperty('display', 'none');

            const calculateBtn = document.createElement('button');
            calcBtns.push(calculateBtn);
            calculateBtn.classList.add('btn', 'btn-xs', 'btn-default');
            calculateBtn.textContent = 'Berechnen';
            calculateBtn.addEventListener('click', event => {
                event.preventDefault();
                calcBtns.forEach(btn => btn.classList.add('disabled'));
                Promise.all([getVehicles(), getBuildings()]).then(
                    ([vehicles, buildings]) => {
                        const current = vehicles.filter(
                            ({ vehicle_type }) =>
                                vehicle_type.toString() ===
                                vehicleTypeId.toString()
                        ).length;
                        currentTd.textContent = current.toLocaleString();
                        currentTd.removeAttribute('colspan');

                        const available = limit(buildings);
                        availableTd.textContent = available.toLocaleString();
                        const availableText = document.createElement('small');
                        availableText.textContent = limitText;
                        availableTd.append(
                            document.createElement('br'),
                            availableText
                        );
                        availableTd.style.removeProperty('display');

                        nextTd.append(
                            ...next(buildings, available).flatMap(text => {
                                if (typeof text !== 'number') {
                                    return [text, ' '];
                                }
                                const bold = document.createElement('strong');
                                bold.textContent = text.toLocaleString();
                                return [bold, ' '];
                            })
                        );
                        nextTd.style.removeProperty('display');

                        calculateBtn.remove();

                        calcBtns.forEach(btn =>
                            btn.classList.remove('disabled')
                        );
                    }
                );
            });

            currentTd.append(calculateBtn);
        });

    table.append(thead, tbody);
    body.append(close, table);
    content.append(body);
    dialog.append(content);
    modal.append(dialog);
    document.body.append(modal);

    modal.classList.add('in');
    modal.style.setProperty('display', 'block');
};

// create a trigger-element
const triggerLi = document.createElement('li');
const triggerA = document.createElement('a');
triggerA.href = '#';
triggerA.textContent = 'Limited Vehicles';
triggerLi.appendChild(triggerA);

triggerLi.addEventListener('click', event => {
    event.preventDefault();
    createModal();
});

// insert the trigger-element to the DOM
/** @type {HTMLLIElement | undefined} */
document
    .querySelector('#menu_profile + .dropdown-menu > li.divider')
    ?.before(triggerLi);
