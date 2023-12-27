// ==UserScript==
// @name            [LSS] Limited Buildings (DE)
// @namespace       https://jxn.lss-manager.de
// @version         2023.12.27+1837
// @author          Jan (jxn_30)
// @description     This Script is for leitstellenspiel.de only!
// @description:de  Zeigt für limitierte Gebäude und Ausbauten (Heli-Standplätze, Großwachen, etc.) an, wie viele vorhanden und wie viele aktuell kaufbar sind.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/limitedBuildings.de.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/limitedBuildings.de.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/24446-script-limitedbuildings-schnelle-%C3%BCbersicht-wie-viele-limitierte-geb%C3%A4ude-ausbauen/
// @match           https://www.leitstellenspiel.de/
// @match           https://polizei.leitstellenspiel.de/
// @resource        icon https://github.com/jxn-30/LSS-Scripts/raw/d78e145611/resources/limitedBuildings.de.user.js/icon.png#sha256=8f16b24b2106050d6eb777b78b75b43453fa9c2919ad7a265b31f746a8be6b57
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_getResourceURL
// ==/UserScript==

/**
 * @name  Limited Buildings (DE)
 * @description This Script is for leitstellenspiel.de only!
 * @description:de Zeigt für limitierte Gebäude und Ausbauten (Heli-Standplätze, Großwachen, etc.) an, wie viele vorhanden und wie viele aktuell kaufbar sind.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/24446-script-limitedbuildings-schnelle-%C3%BCbersicht-wie-viele-limitierte-geb%C3%A4ude-ausbauen/
 * @locale de_DE
 * @match /
 * @// icon taken from https://icons8.com/icon/BZkd70RB5zN3/home-safety
 * @resource icon /resources/limitedBuildings.de.user.js/icon.png
 * @grant GM_addStyle
 * @grant GM_getResourceURL
 */

const limits = [
    {
        name: 'Leitstelle',
        current: buildings =>
            buildings.filter(({ building_type }) => building_type === 7).length,
        // one per 25 buildings but minimum 1
        limit: buildings => Math.max(1, Math.ceil(buildings.length / 25)),
        limitText: 'Pro 25 Gebäude eine Leitstelle.',
        next: (buildings, limit) => {
            const nextAt = limit * 25;
            const toNext = nextAt - buildings.length;
            return [
                'Nächste Leitstelle bei',
                nextAt,
                'Gebäuden, noch',
                toNext,
                'Gebäude bis dahin.',
            ];
        },
    },
    {
        name: 'RTH-Landeplatz',
        current: buildings =>
            buildings
                .filter(({ building_type }) => building_type === 5)
                .map(({ level }) => level + 1)
                .reduce((a, b) => a + b, 0),
        // one per 25 buildings but minimum 4
        limit: buildings => Math.max(4, Math.floor(buildings.length / 25)),
        limitText:
            'Pro 25 Gebäude ein RTH-Landeplatz, mindestens jedoch 4 Stück.',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * 25;
            const toNext = nextAt - buildings.length;
            return [
                'Nächster RTH-Landeplatz bei',
                nextAt,
                'Gebäuden, noch',
                toNext,
                'Gebäude bis dahin.',
            ];
        },
    },
    {
        name: 'Polizeihubschrauber-Landeplatz',
        current: buildings =>
            buildings
                .filter(({ building_type }) => building_type === 13)
                .map(({ level }) => level + 1)
                .reduce((a, b) => a + b, 0),
        // one per 25 buildings but minimum 4
        limit: buildings => Math.max(4, Math.floor(buildings.length / 25)),
        limitText:
            'Pro 25 Gebäude ein Polizeihubschrauber-Landeplatz, mindestens jedoch 4 Stück.',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * 25;
            const toNext = nextAt - buildings.length;
            return [
                'Nächster Polizeihubschrauber-Landeplatz bei',
                nextAt,
                'Gebäuden, noch',
                toNext,
                'Gebäude bis dahin.',
            ];
        },
    },
    {
        name: 'Feuerwache – Flughafenfeuerwehr',
        current: buildings =>
            buildings
                .map(
                    ({ building_type, extensions }) =>
                        building_type === 0 && // 0 = fire station & small fire station in API
                        extensions.some(({ type_id }) => type_id === 8)
                )
                .filter(Boolean).length,
        // one per 10 fire stations and small fire stations
        limit: buildings =>
            Math.floor(
                buildings.filter(({ building_type }) => building_type === 0)
                    .length / 10
            ),
        limitText: 'Pro 10 Feuerwachen und kleinen Feuerwachen einen Ausbau.',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * 10;
            const toNext =
                nextAt -
                buildings.filter(({ building_type }) => building_type === 0)
                    .length;
            return [
                'Nächster Ausbau bei',
                nextAt,
                'Feuerwachen und kleinen Feuerwachen, noch',
                toNext,
                'davon bis dahin.',
            ];
        },
    },
    {
        name: 'Feuerwache – Großwache',
        current: buildings =>
            buildings
                .map(
                    ({ building_type, extensions }) =>
                        building_type === 0 && // 0 = fire station & small fire station in API
                        extensions.some(({ type_id }) => type_id === 9)
                )
                .filter(Boolean).length,
        // one per 10 fire stations and small fire stations
        limit: buildings =>
            Math.floor(
                buildings.filter(({ building_type }) => building_type === 0)
                    .length / 10
            ),
        limitText: 'Pro 10 Feuerwachen und kleinen Feuerwachen einen Ausbau.',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * 10;
            const toNext =
                nextAt -
                buildings.filter(({ building_type }) => building_type === 0)
                    .length;
            return [
                'Nächster Ausbau bei',
                nextAt,
                'Feuerwachen und kleinen Feuerwachen, noch',
                toNext,
                'davon bis dahin.',
            ];
        },
    },
    {
        name: 'Rettungswache – Großwache',
        current: buildings =>
            buildings
                .map(
                    ({ building_type, extensions }) =>
                        building_type === 2 && // 2 = ambulance station & small ambulance station in API
                        extensions.some(({ type_id }) => type_id === 0)
                )
                .filter(Boolean).length,
        // one per 10 ambulance stations and small ambulance stations
        limit: buildings =>
            Math.floor(
                buildings.filter(({ building_type }) => building_type === 2)
                    .length / 10
            ),
        limitText:
            'Pro 10 Rettungswachen und kleinen Rettungswachen einen Ausbau.',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * 10;
            const toNext =
                nextAt -
                buildings.filter(({ building_type }) => building_type === 2)
                    .length;
            return [
                'Nächster Ausbau bei',
                nextAt,
                'Rettungswachen und kleinen Rettungswachen, noch',
                toNext,
                'davon bis dahin.',
            ];
        },
    },
    {
        name: 'Krankenhaus – Großkrankenhaus',
        current: buildings =>
            buildings
                .map(
                    ({ building_type, extensions }) =>
                        building_type === 4 && // 4 = hospital
                        extensions.some(({ type_id }) => type_id === 9)
                )
                .filter(Boolean).length,
        // one per 5 hospitals
        limit: buildings =>
            Math.floor(
                buildings.filter(({ building_type }) => building_type === 4)
                    .length / 5
            ),
        limitText: 'Pro 5 Krankenhäuser einen Ausbau.',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * 5;
            const toNext =
                nextAt -
                buildings.filter(({ building_type }) => building_type === 4)
                    .length;
            return [
                'Nächster Ausbau bei',
                nextAt,
                'Krankenhäusern, noch',
                toNext,
                'davon bis dahin.',
            ];
        },
    },
    {
        name: 'Polizeiwache – Großwache',
        current: buildings =>
            buildings
                .map(
                    ({ building_type, extensions }) =>
                        building_type === 6 && // 6 = police station & small police station in API
                        extensions.some(({ type_id }) => type_id === 14)
                )
                .filter(Boolean).length,
        // one per 10 police stations and small police stations
        limit: buildings =>
            Math.floor(
                buildings.filter(({ building_type }) => building_type === 6)
                    .length / 10
            ),
        limitText:
            'Pro 10 Polizeiwachen und kleinen Polizeiwachen einen Ausbau.',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * 10;
            const toNext =
                nextAt -
                buildings.filter(({ building_type }) => building_type === 6)
                    .length;
            return [
                'Nächster Ausbau bei',
                nextAt,
                'Polizeiwachen und kleinen Polizeiwachen, noch',
                toNext,
                'davon bis dahin.',
            ];
        },
    },
    {
        name: 'Polizeiwache – Großgewahrsam',
        current: buildings =>
            buildings
                .map(
                    ({ building_type, extensions }) =>
                        building_type === 6 && // 6 = police station & small police station in API
                        extensions.some(({ type_id }) => type_id === 15)
                )
                .filter(Boolean).length,
        // one per 10 police stations and small police stations
        limit: buildings =>
            Math.floor(
                buildings.filter(({ building_type }) => building_type === 6)
                    .length / 10
            ),
        limitText:
            'Pro 10 Polizeiwachen und kleinen Polizeiwachen einen Ausbau.',
        next: (buildings, limit) => {
            const nextAt = (limit + 1) * 10;
            const toNext =
                nextAt -
                buildings.filter(({ building_type }) => building_type === 6)
                    .length;
            return [
                'Nächster Ausbau bei',
                nextAt,
                'Polizeiwachen und kleinen Polizeiwachen, noch',
                toNext,
                'davon bis dahin.',
            ];
        },
    },
];

const modalId = 'jxn-limited_buildings-modal';

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
    let buildings;

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
    typeTh.textContent = 'Gebäudetyp / Ausbau';
    const currentTh = document.createElement('th');
    currentTh.textContent = 'Aktuell';
    const availableTh = document.createElement('th');
    availableTh.textContent = 'Kaufbar';
    const nextTh = document.createElement('th');
    nextTh.textContent = 'Nächstes Gebäude / Nächster Ausbau';
    headRow.append(typeTh, currentTh, availableTh, nextTh);

    const tbody = document.createElement('tbody');

    const calcBtns = [];

    limits
        .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB))
        .forEach(({ name, current, limit, limitText, next }) => {
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
                getBuildings().then(buildings => {
                    currentTd.textContent = current(buildings).toLocaleString();
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

                    calcBtns.forEach(btn => btn.classList.remove('disabled'));
                });
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
triggerA.append(triggerImg, '\xa0Limited Buildings');
triggerLi.append(triggerA);

triggerLi.addEventListener('click', event => {
    event.preventDefault();
    createModal();
});

// insert the trigger-element to the DOM
/** @type {HTMLLIElement | undefined} */
document
    .querySelector('#menu_profile + .dropdown-menu > li.divider')
    ?.before(triggerLi);
