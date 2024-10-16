// ==UserScript==
// @name            [LSS] Limited Vehicles (DE)
// @namespace       https://jxn.lss-manager.de
// @version         2024.10.13+1400
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
// @resource        icon https://github.com/jxn-30/LSS-Scripts/raw/d78e145611/resources/limitedVehicles.de.user.js/icon.png#sha256=d646596a61e833db3b2315a4705058de678705cb15aa4788f4f6a32ed447bd88
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_getResourceURL
// ==/UserScript==

/**
 * @name  Limited Vehicles (DE)
 * @description This Script is for leitstellenspiel.de only!
 * @description:de Zeigt für limitierte Fahrzeuge (NAW, ITW, etc.) an, wie viele vorhanden und wie viele aktuell kaufbar sind.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/24131-script-limitedvehicles-schnelle-%C3%BCbersicht-wie-viele-limitierte-fahrzeuge-man-hat/
 * @locale de_DE
 * @match /
 * @// icon taken from https://icons8.com/icon/xxIxkJ2lO-YR/steering-lock-warning
 * @resource icon /resources/limitedVehicles.de.user.js/icon.png
 * @grant GM_addStyle
 * @grant GM_getResourceURL
 */

/* global user_premium, I18n */

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
                ).length / (user_premium ? 15 : 20)
            ),
        limitText:
            'Pro 20 (15 mit Premium) Rettungswachen und aktiven RD-Erweiterungen ein GRTW',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * (user_premium ? 15 : 20);
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
                ).length / (user_premium ? 10 : 15)
            ),
        limitText:
            'Pro 15 (10 mit Premium) Rettungswachen und aktiven RD-Erweiterungen ein ITW',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * (user_premium ? 10 : 15);
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

#${modalId} .modal-body details {
    summary {
        display: list-item;
    }
    
    li:not(:first-of-type) {
        list-style: disc !important;
        display: inline list-item;
    }
}
`);

let vehicleTypes;
const fetchVehicleTypes = () =>
    vehicleTypes ?
        Promise.resolve()
    :   fetch(`https://api.lss-manager.de/${I18n.locale}/vehicles`)
            .then(res => res.json())
            .then(res => (vehicleTypes = res));

// create a modal
const createModal = () => {
    let vehicles;
    let buildings;
    /** @type {Map<number, Map<string, Set>>} */
    const vehiclesByTypeByBuilding = new Map();
    /** @type {Map<number, Set>} */
    const buildingsByType = new Map();

    const getVehicles = () =>
        vehicles ?
            Promise.resolve(vehicles)
        :   fetch('/api/vehicles')
                .then(res => res.json())
                .then(v => (vehicles = v))
                .then(v => {
                    vehiclesByTypeByBuilding.clear();
                    v.forEach(vehicle => {
                        const { building_id, vehicle_type } = vehicle;
                        const type = vehicle_type.toString();
                        if (!vehiclesByTypeByBuilding.has(building_id)) {
                            vehiclesByTypeByBuilding.set(
                                building_id,
                                new Map()
                            );
                        }
                        const vehiclesByType =
                            vehiclesByTypeByBuilding.get(building_id);

                        if (!vehiclesByType.has(type)) {
                            vehiclesByType.set(type, new Set());
                        }
                        vehiclesByType.get(type).add(vehicle);
                    });
                    return v;
                });

    const getBuildings = () =>
        buildings ?
            Promise.resolve(buildings)
        :   fetch('/api/buildings')
                .then(res => res.json())
                .then(b => (buildings = b))
                .then(b => {
                    buildingsByType.clear();
                    b.forEach(building => {
                        const { building_type } = building;
                        if (!buildingsByType.has(building_type)) {
                            buildingsByType.set(building_type, new Set());
                        }
                        buildingsByType.get(building_type).add(building);
                    });
                    return b;
                });

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
    const buildingsWithTh = document.createElement('th');
    buildingsWithTh.textContent = 'Gebäude mit';
    const buildingsWithoutTh = document.createElement('th');
    buildingsWithoutTh.textContent = 'Gebäude mit ohne';
    headRow.append(
        typeTh,
        currentTh,
        availableTh,
        nextTh,
        buildingsWithTh,
        buildingsWithoutTh
    );

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
            const withTd = row.insertCell();
            const withoutTd = row.insertCell();

            const calculateBtn = document.createElement('button');
            calcBtns.push(calculateBtn);
            calculateBtn.classList.add('btn', 'btn-xs', 'btn-default');
            calculateBtn.textContent = 'Berechnen';
            calculateBtn.addEventListener('click', event => {
                event.preventDefault();
                calcBtns.forEach(btn => btn.classList.add('disabled'));

                /** @type {number[]} */
                const buildingTypes =
                    vehicleTypes[vehicleTypeId].possibleBuildings;

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

                        const possibleBuildings = buildingTypes.reduce(
                            (acc, type) =>
                                (acc ?? new Set()).union(
                                    buildingsByType.get(type) ?? new Set()
                                ),
                            new Set()
                        );

                        const buildingsWith = new Set();
                        const buildingsWithout = new Set();
                        possibleBuildings.forEach(building => {
                            const { id } = building;
                            if (
                                vehiclesByTypeByBuilding
                                    .get(id)
                                    ?.has(vehicleTypeId)
                            ) {
                                buildingsWith.add(building);
                            } else {
                                buildingsWithout.add(building);
                            }
                        });

                        const withDetails = document.createElement('details');
                        const withSummary = document.createElement('summary');
                        withSummary.textContent = `${buildingsWith.size.toLocaleString()} Gebäude`;
                        const withList = document.createElement('ul');
                        withList.classList.add('list-inline');
                        withList.append(
                            ...Array.from(buildingsWith)
                                .sort((a, b) =>
                                    a.caption.localeCompare(b.caption)
                                )
                                .map(({ id, caption }) => {
                                    const li = document.createElement('li');
                                    const anchor = document.createElement('a');
                                    anchor.href = `/buildings/${id}`;
                                    anchor.classList.add('lightbox-open');
                                    anchor.textContent = caption;
                                    const amountSpan =
                                        document.createElement('em');
                                    amountSpan.textContent = ` (${vehiclesByTypeByBuilding.get(id).get(vehicleTypeId).size.toLocaleString()})`;
                                    li.append(anchor, amountSpan);
                                    return li;
                                })
                        );
                        withDetails.append(withSummary, withList);
                        withTd.append(withDetails);

                        const withoutDetails =
                            document.createElement('details');
                        const withoutSummary =
                            document.createElement('summary');
                        withoutSummary.textContent = `${buildingsWithout.size.toLocaleString()} Gebäude`;
                        const withoutList = document.createElement('ul');
                        withoutList.classList.add('list-inline');
                        withoutList.append(
                            ...Array.from(buildingsWithout)
                                .sort((a, b) =>
                                    a.caption.localeCompare(b.caption)
                                )
                                .map(({ id, caption }) => {
                                    const li = document.createElement('li');
                                    const anchor = document.createElement('a');
                                    anchor.href = `/buildings/${id}`;
                                    anchor.classList.add('lightbox-open');
                                    anchor.textContent = caption;
                                    li.append(anchor);
                                    return li;
                                })
                        );
                        withoutDetails.append(withoutSummary, withoutList);
                        withoutTd.append(withoutDetails);

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
const triggerImg = document.createElement('img');
triggerImg.src = GM_getResourceURL('icon');
triggerImg.width = 24;
triggerImg.height = 24;
triggerA.href = '#';
triggerA.append(triggerImg, '\xa0Limited Vehicles');
triggerLi.append(triggerA);

triggerLi.addEventListener('click', event => {
    event.preventDefault();
    fetchVehicleTypes().then(createModal);
});

// insert the trigger-element to the DOM
/** @type {HTMLLIElement | undefined} */
document
    .querySelector('#menu_profile + .dropdown-menu > li.divider')
    ?.before(triggerLi);
