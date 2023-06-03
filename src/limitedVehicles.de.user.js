// ==UserScript==
// @name            [LSS] Limited Vehicles
// @namespace       https://jxn.lss-manager.de
// @version         2023.06.03+1443
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
// ==/UserScript==

/**
 * @name  Limited Vehicles (DE)
 * @description This Script is for leitstellenspiel.de only!
 * @description:de Zeigt für limitierte Fahrzeuge (NAW, ITW, etc.) an, wie viele vorhanden und wie viele aktuell kaufbar sind.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/24131-script-limitedvehicles-schnelle-%C3%BCbersicht-wie-viele-limitierte-fahrzeuge-man-hat/
 * @locale de_DE
 * @match /
 */

/* global premium */

const limits = {
    31: {
        name: 'RTH',
        // one per 25 buildings but minimum 4
        limit: buildings => Math.max(4, Math.floor(buildings.length / 25)),
    },
    61: {
        name: 'Polizeihubschrauber',
        // one per 25 buildings but minimum 4
        limit: buildings => Math.max(4, Math.floor(buildings.length / 25)),
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
    },
};

// create a modal
const createModal = () => {
    let vehicles;
    let buildings;

    const getVehicles = () =>
        vehicles
            ? Promise.resolve(vehicles)
            : fetch('/api/vehicles').then(res => res.json());

    const getBuildings = () =>
        buildings
            ? Promise.resolve(buildings)
            : fetch('/api/buildings').then(res => res.json());

    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');

    const dialog = document.createElement('div');
    dialog.classList.add('modal-dialog');

    const content = document.createElement('div');
    content.classList.add('modal-content');

    const body = document.createElement('div');
    body.classList.add('modal-body');

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
    headRow.append(typeTh, currentTh, availableTh);

    const tbody = document.createElement('tbody');

    Object.entries(limits)
        .sort(([, { name: nameA }], [, { name: nameB }]) =>
            nameA.localeCompare(nameB)
        )
        .forEach(([vehicleTypeId, { name, limit }]) => {
            const row = tbody.insertRow();
            row.insertCell().textContent = name;

            const currentTd = row.insertCell();
            const availableTd = row.insertCell();

            currentTd.setAttribute('colspan', '2');
            availableTd.style.setProperty('display', 'none');

            const calculateBtn = document.createElement('button');
            calculateBtn.classList.add('btn', 'btn-xs', 'btn-default');
            calculateBtn.textContent = 'Berechnen';
            calculateBtn.addEventListener('click', event => {
                event.preventDefault();
                calculateBtn.classList.add('disabled');
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
                        availableTd.style.removeProperty('display');

                        calculateBtn.remove();
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
