// ==UserScript==
// @name            [LSS] Central Settings
// @name:de         [LSS] Zentrale Einstellungen
// @namespace       https://jxn.lss-manager.de
// @version         2024.02.14+1250
// @author          Jan (jxn_30)
// @description     Keeps settings for buildings (sharing cells and beds) and vehicles (automatic transport and towing vehicles) in one place.
// @description:de  Hält Einstellungen für Gebäude (Zellen- und Bettenfreigabe) und Fahrzeuge (automatische Transporte und Zugfahrzeuge) an einem Ort.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/centralSettings.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/centralSettings.user.js
// @supportURL      https://github.com/jxn-30/LSS-Scripts
// @match           https://www.operacni-stredisko.cz/
// @match           https://policie.operacni-stredisko.cz/
// @match           https://www.alarmcentral-spil.dk/
// @match           https://politi.alarmcentral-spil.dk/
// @match           https://www.leitstellenspiel.de/
// @match           https://polizei.leitstellenspiel.de/
// @match           https://www.missionchief-australia.com/
// @match           https://police.missionchief-australia.com/
// @match           https://www.missionchief.co.uk/
// @match           https://police.missionchief.co.uk/
// @match           https://www.missionchief.com/
// @match           https://police.missionchief.com/
// @match           https://www.centro-de-mando.es/
// @match           https://www.centro-de-mando.mx/
// @match           https://www.hatakeskuspeli.com/
// @match           https://poliisi.hatakeskuspeli.com/
// @match           https://www.operateur112.fr/
// @match           https://police.operateur112.fr/
// @match           https://www.operatore112.it/
// @match           https://polizia.operatore112.it/
// @match           https://www.missionchief-japan.com/
// @match           https://www.missionchief-korea.com/
// @match           https://www.nodsentralspillet.com/
// @match           https://politiet.nodsentralspillet.com/
// @match           https://www.meldkamerspel.com/
// @match           https://politie.meldkamerspel.com/
// @match           https://www.operatorratunkowy.pl/
// @match           https://policja.operatorratunkowy.pl/
// @match           https://www.operador193.com/
// @match           https://www.jogo-operador112.com/
// @match           https://policia.jogo-operador112.com/
// @match           https://www.jocdispecerat112.com/
// @match           https://www.dispetcher112.ru/
// @match           https://www.dispecerske-centrum.com/
// @match           https://www.larmcentralen-spelet.se/
// @match           https://polis.larmcentralen-spelet.se/
// @match           https://www.112-merkez.com/
// @match           https://www.dyspetcher101-game.com/
// @resource        icon https://github.com/jxn-30/LSS-Scripts/raw/1290a2d9f3/resources/centralSettings.user.js/icon.png#sha256=8ee94edd89e6546b5cd1681ed5a22e4566334a4336fbc9e60673ddb33aafa493
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_getResourceURL
// ==/UserScript==

/**
 * @name Central Settings
 * @name:de Zentrale Einstellungen
 * @description Keeps settings for buildings (sharing cells and beds) and vehicles (automatic transport and towing vehicles) in one place.
 * @description:de Hält Einstellungen für Gebäude (Zellen- und Bettenfreigabe) und Fahrzeuge (automatische Transporte und Zugfahrzeuge) an einem Ort.
 * @//forum https://forum.leitstellenspiel.de/index.php?thread/25128-script-aao-alle-fahrzeugtypen-ausw%C3%A4hlbar/
 * @match /
 * @// icon taken from https://icons8.com/icon/o4J5uguoduDW/share-settings
 * @resource icon /resources/centralSettings.user.js/icon.png
 * @grant GM_addStyle
 * @grant GM_getResourceURL
 */

/* global I18n, user_id */

const modalId = 'jxn-centralSettings-modal';

/**
 * @typedef {Object} VehicleType A partial building type as returned by the LSSM API
 * @property {string} caption
 * @property {true} [isTrailer]
 * @property {number[]} [tractiveVehicles]
 */

/** @type {Record<number, VehicleType>} */
let vehicleTypes;
/**
 * fetches all vehicle types from LSSM API
 * @returns {Record<number, VehicleType> | Promise<Record<number, VehicleType>>}
 */
const getVehicleTypes = () =>
    vehicleTypes ??
    fetch(`https://api.lss-manager.de/${I18n.locale}/vehicles`)
        .then(res => res.json())
        .then(vehicles => (vehicleTypes = vehicles));

/**
 * @typedef {Object} Vehicle A partial vehicle as returned by the API
 *  @property {number} id
 *  @property {number} vehicle_type
 *  @property {number} building_id
 *  @property {string} caption
 *  @property {boolean} tractive_random
 *  @property {number} tractive_vehicle_id
 */

/** @type {Vehicle[]} */
let vehicles;
const getVehicles = () =>
    vehicles ??
    fetch('/api/vehicles')
        .then(res => res.json())
        .then(v => (vehicles = v));

let roleFlags;
const getRoleFlags = () =>
    roleFlags ??
    fetch('/api/allianceinfo')
        .then(res => (res.ok ? res.json() : Promise.reject()))
        .then(
            allianceInfo =>
                (roleFlags =
                    allianceInfo?.users?.find(({ id }) => id === user_id)
                        ?.role_flags ?? {})
        )
        .catch(() => (roleFlags = {}));

const hasFinanceRights = () =>
    roleFlags?.owner ||
    roleFlags?.admin ||
    roleFlags?.coadmin ||
    roleFlags?.finance;

// add some stiles that are used in the modal
GM_addStyle(`
#${modalId} {
    z-index: 3000; /* This is to fix Ausbildungsfinder appearing below navbar and the panel-windows in window-design */
}

#${modalId} .modal-dialog {
    min-width: min(1250px, 90%);
    max-width: min(1250px, 90%);
}

#${modalId} .modal-body {
    overflow: auto;
    box-sizing: content-box;
    max-height: calc(100vh - 2 * 30px - 2 * 15px);
}

#${modalId} .close {
    position: sticky;
    top: 0;
    right: 0;
    z-index: 2;
}

body.dark #${modalId} .list-group-item {
    background: linear-gradient(to bottom, #505050 0, #000 100%);
    border-color: black;
    color: white;
}
`);

const createListGroupWrapper = () => {
    const listWrapper = document.createElement('div');
    listWrapper.classList.add('flex-row');
    listWrapper.style.setProperty('column-gap', '1em');
    return listWrapper;
};

const createListGroup = () => {
    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group', 'flex-grow-1');
    return listGroup;
};

const addListGroupItem = (listGroup, badge, ...content) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    const badgeSpan = document.createElement('span');
    badgeSpan.classList.add('badge');
    badgeSpan.textContent = badge;
    item.append(badgeSpan);
    if (!badge) badgeSpan.classList.add('hidden');
    item.append(...content);
    listGroup.append(item);

    return { item, badge: badgeSpan };
};

const createListGroupSummary = (listGroup, title) => {
    const summary = document.createElement('li');
    summary.classList.add('list-group-item');
    summary.textContent = title.replace(
        '%s',
        listGroup.children.length.toLocaleString()
    );
    listGroup.prepend(summary);
};

const getTowingVehicle = (trailer, towingType) => {
    const romanNum = trailer.caption.match(/ [IVXLCDM]+$/)?.[0] ?? '';
    return vehicles.find(
        v =>
            v.vehicle_type === towingType && // correct vehicle type
            v.building_id === trailer.building_id && // same building
            (romanNum ? v.caption.endsWith(romanNum) : true) // same roman number (if any)
    );
};

/**
 * @param {string} title
 * @param {string|number} id
 */
const createTab = (title, id) => {
    const tab = document.createElement('li');
    tab.setAttribute('role', 'presentation');
    const tabA = document.createElement('a');
    tabA.setAttribute('role', 'tab');
    tabA.setAttribute('data-toggle', 'tab');
    tabA.textContent = title;
    tab.appendChild(tabA);

    const tabPane = document.createElement('div');
    tabPane.classList.add('tab-pane');
    tabPane.setAttribute('role', 'tabpanel');
    tabPane.id = `${modalId}-tab-${id}`;
    tabA.href = `#${tabPane.id}`;
    tabA.setAttribute('aria-controls', tabPane.id);

    return { tab, tabPane };
};

// create a modal
const createModal = () => {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = modalId;

    const dialog = document.createElement('div');
    dialog.classList.add('modal-dialog');

    const content = document.createElement('div');
    content.classList.add('modal-content');

    const body = document.createElement('div');
    body.classList.add('modal-body');

    const close = document.createElement('span');
    close.classList.add('close');
    close.textContent = '×';

    const closeModal = () => {
        modal.classList.remove('in');
        modal.style.setProperty('display', 'none');
        modal.remove();
    };

    close.addEventListener('click', event => {
        event.preventDefault();
        closeModal();
    });
    content.append(body);
    dialog.append(content);
    modal.append(dialog);
    document.body.append(modal);

    body.append(close);

    modal.classList.add('in');
    modal.style.setProperty('display', 'block');

    const loadingSpan = document.createElement('span');
    loadingSpan.textContent = 'Loading...';
    body.append(loadingSpan);

    return { body, finish: () => loadingSpan.remove() };
};

const fillModal = body => {
    const tabList = document.createElement('ul');
    tabList.classList.add('nav', 'nav-tabs');
    tabList.setAttribute('role', 'tablist');

    const tabContent = document.createElement('div');
    tabContent.classList.add('tab-content');

    // region Beds
    const { tab: bedsTab, tabPane: bedsTabPane } = createTab(
        'Krankenhäuser',
        'beds'
    );
    bedsTab.classList.add('active');
    bedsTabPane.classList.add('active');
    tabList.append(bedsTab);
    const { tab: ownBedsTab, tabPane: ownBedsPane } = createTab(
        'Eigene Krankenhäuser',
        'beds_own'
    );
    ownBedsPane.append('Noch nicht verfügbar :)');
    if (hasFinanceRights()) {
        ownBedsTab.classList.add('active');
        ownBedsPane.classList.add('active');
        const bedsTabList = document.createElement('ul');
        bedsTabList.classList.add('nav', 'nav-tabs');
        bedsTabList.setAttribute('role', 'tablist');
        const bedsContent = document.createElement('div');
        bedsContent.classList.add('tab-content');
        bedsTabPane.append(bedsTabList, bedsContent);

        const { tab: allianceBedsTab, tabPane: allianceBedsPane } = createTab(
            'Verbands-Krankenhäuser',
            'beds_alliance'
        );
        allianceBedsPane.append('Noch nicht verfügbar :)');

        bedsTabList.append(ownBedsTab, allianceBedsTab);
        bedsContent.append(ownBedsPane, allianceBedsPane);
    } else {
        bedsTabPane.append(ownBedsPane);
    }
    tabContent.append(bedsTabPane);
    // endregion

    // region Cells
    const { tab: cellsTab, tabPane: cellsTabPane } = createTab(
        'Zellen',
        'cells'
    );
    tabList.append(cellsTab);
    const { tab: ownCellsTab, tabPane: ownCellsPane } = createTab(
        'Eigene Zellen',
        'cells_own'
    );
    ownCellsPane.append('Noch nicht verfügbar :)');
    if (hasFinanceRights()) {
        const cellsTabList = document.createElement('ul');
        cellsTabList.classList.add('nav', 'nav-tabs');
        cellsTabList.setAttribute('role', 'tablist');
        const cellsContent = document.createElement('div');
        cellsContent.classList.add('tab-content');
        cellsTabPane.append(cellsTabList, cellsContent);

        const { tab: allianceCellsTab, tabPane: allianceCellsPane } = createTab(
            'Verbands-Zellen',
            'cells_alliance'
        );
        allianceCellsPane.append('Noch nicht verfügbar :)');

        cellsTabList.append(ownCellsTab, allianceCellsTab);
        cellsContent.append(ownCellsPane, allianceCellsPane);
    } else {
        cellsTabPane.append(ownCellsPane);
    }
    tabContent.append(cellsTabPane);
    // endregion

    // region ELW 1 (SEG)
    const { tab: elw1Tab, tabPane: elw1TabPane } = createTab(
        'ELW 1 (SEG)',
        'elw1'
    );
    tabList.append(elw1Tab);
    elw1TabPane.append('Noch nicht verfügbar :)');
    tabContent.append(elw1TabPane);
    // endregion

    // region FuStW (DGL)
    const { tab: fustwTab, tabPane: fustwTabPane } = createTab(
        'FuStW (DGL)',
        'fustw'
    );
    tabList.append(fustwTab);
    fustwTabPane.append('Noch nicht verfügbar :)');
    tabContent.append(fustwTabPane);
    // endregion

    // region Zugfahrzeuge
    const { tab: towingTab, tabPane: towingTabPane } = createTab(
        'Zugfahrzeuge',
        'towing'
    );
    tabList.append(towingTab);
    tabContent.append(towingTabPane);

    const trailers = Object.keys(vehicleTypes).filter(
        v => vehicleTypes[v].isTrailer
    );

    const towingForm = document.createElement('div');
    towingForm.classList.add(
        'flex-row',
        'justify-between',
        'align-items-center',
        'form-control-static'
    );
    towingForm.style.setProperty('column-gap', '1em');
    const trailerSelect = document.createElement('select');
    trailerSelect.style.setProperty('flex-basis', '0');
    trailerSelect.classList.add('flex-grow-1', 'form-control');
    const option = new Option('Anhänger auswählen', '-1', true, true);
    option.disabled = true;
    trailerSelect.append(option);
    trailers.forEach(v =>
        trailerSelect.append(new Option(vehicleTypes[v].caption, v))
    );

    const randomTowingLabel = document.createElement('label');
    randomTowingLabel.classList.add(
        'flex-grow-1',
        'form-check-label',
        'text-right'
    );
    randomTowingLabel.style.setProperty('flex-basis', '0');
    randomTowingLabel.textContent = '\xa0Zufälliges Zugfahrzeug?';
    const randomTowingCheckbox = document.createElement('input');
    randomTowingCheckbox.type = 'checkbox';
    randomTowingCheckbox.classList.add('form-check-input');
    randomTowingCheckbox.addEventListener('change', () => {
        towingSelect.disabled = randomTowingCheckbox.checked;
    });
    randomTowingLabel.prepend(randomTowingCheckbox);
    towingForm.append(randomTowingLabel);

    const towingSelect = document.createElement('select');
    towingSelect.classList.add('flex-grow-1', 'form-control');
    towingSelect.style.setProperty('flex-basis', '0');
    const towingOption = new Option('Zugfahrzeug auswählen', '-1', true, true);
    towingOption.disabled = true;
    towingSelect.append(towingOption);
    trailerSelect.addEventListener('change', () => {
        towingSelect.replaceChildren();
        towingSelect.append(towingOption);
        if (trailerSelect.value === '-1') return;
        const trailer = vehicleTypes[trailerSelect.value];
        trailer.tractiveVehicles?.forEach(v =>
            towingSelect.append(
                new Option(vehicleTypes[v].caption, v.toString())
            )
        );
    });

    const updateTowingList = () => {
        const correctList = createListGroup();
        const wrongList = createListGroup();
        listWrapper.replaceChildren(correctList, wrongList);

        if (
            trailerSelect.value === '-1' ||
            (!randomTowingCheckbox.checked && towingSelect.value === '-1')
        ) {
            return;
        }

        const trailers = vehicles.filter(
            ({ vehicle_type }) => vehicle_type === Number(trailerSelect.value)
        );
        trailers.forEach(vehicle => {
            const link = document.createElement('a');
            link.href = `/vehicles/${vehicle.id}`;
            link.textContent = vehicle.caption;
            const towingVehicle = getTowingVehicle(
                vehicle,
                Number(towingSelect.value)
            );
            const isCorrect =
                randomTowingCheckbox.checked ?
                    vehicle.tractive_random
                :   vehicle.tractive_vehicle_id === towingVehicle?.id;
            const targetContent =
                randomTowingCheckbox.checked ? '🎲' : (
                    (() => {
                        const towingLink = document.createElement('a');
                        towingLink.href = `/vehicles/${towingVehicle?.id}`;
                        towingLink.textContent = towingVehicle?.caption;
                        return towingLink;
                    })()
                );
            addListGroupItem(
                isCorrect ? correctList : wrongList,
                '',
                link,
                '\xa0➡️\xa0',
                targetContent
            );
        });

        createListGroupSummary(
            correctList,
            'Korrektes Zugfahrzeug: %s Fahrzeuge'
        );
        createListGroupSummary(wrongList, 'Falsches Zugfahrzeug: %s Fahrzeuge');
    };

    towingForm.addEventListener('change', updateTowingList);

    const listWrapper = createListGroupWrapper();
    towingTabPane.append(listWrapper);

    towingForm.append(trailerSelect, randomTowingLabel, towingSelect);
    towingTabPane.append(
        towingForm,
        'Irgendwann wird man hier sicherlich auch noch das Einstellen der Zugfahrzeuge durchführen lassen können :)',
        listWrapper
    );
    // endregion

    body.append(tabList, tabContent);
};

// create a trigger-element
const triggerLi = document.createElement('li');
const triggerA = document.createElement('a');
const triggerImg = document.createElement('img');
triggerImg.src = GM_getResourceURL('icon');
triggerImg.width = 24;
triggerImg.height = 24;
triggerA.href = '#';
triggerA.append(triggerImg, '\xa0Zentrale Einstellungen');
triggerLi.append(triggerA);

triggerLi.addEventListener('click', event => {
    event.preventDefault();
    const { body, finish } = createModal();

    Promise.all([getVehicleTypes(), getVehicles(), getRoleFlags()]).then(() => {
        fillModal(body);
        finish();
    });
});

// insert the trigger-element to the DOM
/** @type {HTMLLIElement | undefined} */
document
    .querySelector('#menu_profile + .dropdown-menu > li.divider')
    ?.before(triggerLi);
