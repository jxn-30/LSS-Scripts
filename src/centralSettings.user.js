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
        .then(
            v =>
                (vehicles = v.toSorted((a, b) =>
                    a.caption.localeCompare(b.caption)
                ))
        );

/**
 * @typedef {Object} Building A partial building as returned by the API
 *  @property {number} id
 *  @property {number} building_type
 *  @property {boolean} [is_alliance_shared]
 *  @property {number} [alliance_share_credits_percentage]
 */

/** @type {Building[]} */
let buildings;
const getBuildings = () =>
    buildings ??
    fetch('/api/buildings')
        .then(res => res.json())
        .then(
            b =>
                (buildings = b.toSorted((a, b) =>
                    a.caption.localeCompare(b.caption)
                ))
        );

/** @type {Building[]} */
let allianceBuildings;
const getAllianceBuildings = () =>
    allianceBuildings ??
    fetch('/api/alliance_buildings')
        .then(res => res.json())
        .then(
            b =>
                (allianceBuildings = b.toSorted((a, b) =>
                    a.caption.localeCompare(b.caption)
                ))
        );

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

const createLink = (href, text) => {
    const link = document.createElement('a');
    link.classList.add('lightbox-open');
    link.href = href;
    link.textContent = text;
    return link;
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

const percent = value => value.toLocaleString('de', { style: 'percent' });

const createCheckbox = text => {
    const label = document.createElement('label');
    label.classList.add('flex-grow-1', 'form-check-label', 'text-right');
    label.style.setProperty('flex-basis', '0');
    label.textContent = `\xa0${text}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('form-check-input');
    label.prepend(checkbox);
    return { label, checkbox };
};

const createSelect = (title, options = []) => {
    const select = document.createElement('select');
    select.classList.add('flex-grow-1', 'form-control');
    select.style.setProperty('flex-basis', '0');
    const titleOption = new Option(title, '-1', true, true);
    titleOption.disabled = true;
    select.append(titleOption);
    options.forEach(option =>
        select.append(
            typeof option === 'object' ?
                new Option(option.text, option.value)
            :   new Option(option, option)
        )
    );
    return [select, titleOption];
};

const createTaxGroup = () => {
    const taxGroup = document.createElement('div');
    taxGroup.classList.add('btn-group');
    taxGroup.dataset.value = '0';
    for (let i = 0; i <= 50; i += 10) {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-xs');
        btn.dataset.tax = i.toString();
        if (i) btn.classList.add('btn-default');
        else btn.classList.add('btn-success');
        btn.textContent = i ? percent(i / 100) : 'Kostenlos';
        taxGroup.append(btn);
    }

    taxGroup.addEventListener('click', event => {
        event.preventDefault();
        taxGroup
            .querySelector('.btn-success')
            ?.classList.replace('btn-success', 'btn-default');
        const newBtn = event.target.closest('.btn');
        newBtn?.classList.replace('btn-default', 'btn-success');
        taxGroup.dataset.value = newBtn.dataset?.tax ?? '0';
        taxGroup
            .closest('.form-control-static')
            ?.dispatchEvent(new Event('change'));
    });

    return taxGroup;
};

const createTabPaneContent = (
    correctSummaryText,
    wrongSummaryText,
    formElements,
    updateCallback
) => {
    const form = document.createElement('div');
    form.classList.add(
        'flex-row',
        'justify-between',
        'align-items-center',
        'form-control-static',
        'flex-wrap'
    );
    form.style.setProperty('column-gap', '1em');
    form.append(...formElements);

    const listWrapper = createListGroupWrapper();

    const update = () => {
        const correctList = createListGroup();
        const wrongList = createListGroup();
        listWrapper.replaceChildren(correctList, wrongList);

        updateCallback(correctList, wrongList);

        createListGroupSummary(correctList, correctSummaryText);
        createListGroupSummary(wrongList, wrongSummaryText);
    };

    form.addEventListener('change', update);
    update();

    return [form, listWrapper];
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
    const { label: shareBedsLabel, checkbox: shareBedsCheckbox } =
        createCheckbox('Betten freigeben?');
    shareBedsCheckbox.checked = true;
    const ownBedsTaxGroup = createTaxGroup();
    ownBedsTaxGroup.classList.add('flex-grow-1');
    shareBedsCheckbox.addEventListener('change', () =>
        ownBedsTaxGroup
            .querySelectorAll('button')
            .forEach(btn => (btn.disabled = !shareBedsCheckbox.checked))
    );

    const createHospitalsLists = (buildings, tax, correctList, wrongList) => {
        const hospitals = buildings.filter(b => b.building_type === 4);
        hospitals.forEach(hospital => {
            const link = createLink(
                `/buildings/${hospital.id}`,
                hospital.caption
            );
            const isCorrect =
                shareBedsCheckbox.checked ?
                    hospital.is_alliance_shared &&
                    hospital.alliance_share_credits_percentage === tax
                :   !hospital.is_alliance_shared;
            const targetContent =
                shareBedsCheckbox.checked ?
                    tax ? percent(tax / 100)
                    :   'Kostenlos'
                :   'nicht geteilt';
            addListGroupItem(
                isCorrect ? correctList : wrongList,
                '',
                link,
                ' ➡️ ',
                targetContent
            );
        });
    };

    const [ownBedsForm, ownBedsListWrapper] = createTabPaneContent(
        'Passend eingestellte Krankenhäuser: %s',
        'Falsch eingestellte Krankenhäuser: %s',
        [shareBedsLabel, ownBedsTaxGroup],
        (correctList, wrongList) =>
            createHospitalsLists(
                buildings,
                parseInt(ownBedsTaxGroup.dataset.value),
                correctList,
                wrongList
            )
    );

    ownBedsPane.append(
        ownBedsForm,
        'Bislang noch nicht fertig!',
        ownBedsListWrapper
    );

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

        const allianceBedsTaxGroup = createTaxGroup();
        const [allianceBedsForm, allianceBedsListWrapper] =
            createTabPaneContent(
                'Passend eingestellte Krankenhäuser: %s',
                'Falsch eingestellte Krankenhäuser: %s',
                [allianceBedsTaxGroup],
                (correctList, wrongList) =>
                    createHospitalsLists(
                        allianceBuildings,
                        parseInt(allianceBedsTaxGroup.dataset.value),
                        correctList,
                        wrongList
                    )
            );

        allianceBedsPane.append(
            allianceBedsForm,
            'Bislang noch nicht fertig!',
            allianceBedsListWrapper
        );

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
    const { label: shareCellsLabel, checkbox: shareCellsCheckbox } =
        createCheckbox('Zellen freigeben?');
    shareCellsCheckbox.checked = true;
    const ownCellsTaxGroup = createTaxGroup();
    ownCellsTaxGroup.classList.add('flex-grow-1');
    shareCellsCheckbox.addEventListener('change', () =>
        ownCellsTaxGroup
            .querySelectorAll('button')
            .forEach(btn => (btn.disabled = !shareCellsCheckbox.checked))
    );

    const createCellsLists = (buildings, tax, correctList, wrongList) => {
        const cellBuildings = buildings.filter(b =>
            [6, 16, 19].includes(b.building_type)
        );
        cellBuildings.forEach(cellBuilding => {
            const link = createLink(
                `/buildings/${cellBuilding.id}`,
                cellBuilding.caption
            );
            const isCorrect =
                shareBedsCheckbox.checked ?
                    cellBuilding.is_alliance_shared &&
                    cellBuilding.alliance_share_credits_percentage === tax
                :   !cellBuilding.is_alliance_shared;
            const targetContent =
                shareBedsCheckbox.checked ?
                    tax ? percent(tax / 100)
                    :   'Kostenlos'
                :   'nicht geteilt';
            addListGroupItem(
                isCorrect ? correctList : wrongList,
                '',
                link,
                ' ➡️ ',
                targetContent
            );
        });
    };

    const [ownCellsForm, ownCellsListWrapper] = createTabPaneContent(
        'Passend eingestellte Gebäude: %s',
        'Falsch eingestellte Gebäude: %s',
        [shareCellsLabel, ownCellsTaxGroup],
        (correctList, wrongList) =>
            createCellsLists(
                buildings,
                parseInt(ownCellsTaxGroup.dataset.value),
                correctList,
                wrongList
            )
    );

    ownCellsPane.append(
        ownCellsForm,
        'Bislang noch nicht fertig!',
        ownCellsListWrapper
    );

    if (hasFinanceRights()) {
        ownCellsTab.classList.add('active');
        ownCellsPane.classList.add('active');
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

        const allianceCellsTaxGroup = createTaxGroup();
        const [allianceCellsForm, allianceCellsListWrapper] =
            createTabPaneContent(
                'Passend eingestellte Gebäude: %s',
                'Falsch eingestellte Gebäude: %s',
                [allianceCellsTaxGroup],
                (correctList, wrongList) =>
                    createCellsLists(
                        allianceBuildings,
                        parseInt(allianceCellsTaxGroup.dataset.value),
                        correctList,
                        wrongList
                    )
            );

        allianceCellsPane.append(
            allianceCellsForm,
            'Bislang noch nicht fertig!',
            allianceCellsListWrapper
        );

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

    const { label: elw1EnabledLabel, checkbox: elw1EnabledCheckbox } =
        createCheckbox('Sprechwünsche automatisch bearbeiten?');
    elw1EnabledCheckbox.checked = true;
    const { label: elw1OwnLabel, checkbox: elw1OwnCheckbox } = createCheckbox(
        'Nur eigene Krankenhäuser?'
    );
    const { label: elw1ExtensionLabel, checkbox: elw1ExtensionCheckbox } =
        createCheckbox('Nur Krankenhäuser mit passender Erweiterung?');
    const [elw1TaxSelect] = createSelect(
        'Maximale Verbandsabgabe',
        new Array(5).fill(1).map((_, i) => ({
            value: (i * 10).toString(),
            text: i ? percent(i / 10) : 'Kostenlos',
        }))
    );
    const [elw1DistanceSelect] = createSelect(
        'Maximale Entfernung',
        [1, 5, 20, 50, 100, 200].map(i => ({
            value: i.toString(),
            text: `${i}\xa0km`,
        }))
    );
    const [elw1FreeSelect] = createSelect(
        'Plätze freilassen',
        [0, 1, 2, 3, 4, 5]
    );

    elw1EnabledCheckbox.addEventListener('change', () => {
        [
            elw1OwnCheckbox,
            elw1ExtensionCheckbox,
            elw1TaxSelect,
            elw1DistanceSelect,
            elw1FreeSelect,
        ].forEach(el => (el.disabled = !elw1EnabledCheckbox.checked));
    });

    const [elw1Form, elw1ListWrapper] = createTabPaneContent(
        'Korrekt konfigurierte ELW 1 (SEG): %s Fahrzeuge',
        'Falsch konfigurierte ELW 1 (SEG): %s Fahrzeuge',
        [
            elw1EnabledLabel,
            elw1OwnLabel,
            elw1ExtensionLabel,
            elw1TaxSelect,
            elw1DistanceSelect,
            elw1FreeSelect,
        ],
        () => void 0
    );

    elw1TabPane.append(
        elw1Form,
        'Leider ist aktuell nicht feststellbar, welche Fahrzeuge neu konfiguriert werden müssen, daher werden alle Fahrzeuge konfiguriert.',
        elw1ListWrapper
    );
    tabContent.append(elw1TabPane);
    // endregion

    // region FuStW (DGL)
    const { tab: fustwTab, tabPane: fustwTabPane } = createTab(
        'FuStW (DGL)',
        'fustw'
    );
    tabList.append(fustwTab);

    const { label: fustwDglEnabledLabel, checkbox: fustwDglEnabledCheckbox } =
        createCheckbox('Sprechwünsche automatisch bearbeiten?');
    fustwDglEnabledCheckbox.checked = true;
    const { label: fustwDglOwnLabel, checkbox: fustwDglOwnCheckbox } =
        createCheckbox('Nur eigene Zellen?');
    const [fustwDglTaxSelect] = createSelect(
        'Maximale Verbandsabgabe',
        new Array(5).fill(1).map((_, i) => ({
            value: (i * 10).toString(),
            text: i ? percent(i / 10) : 'Kostenlos',
        }))
    );
    const [fustwDglDistanceSelect] = createSelect(
        'Maximale Entfernung',
        [1, 5, 20, 50, 100, 200].map(i => ({
            value: i.toString(),
            text: `${i}\xa0km`,
        }))
    );
    const [fustwDglFreeSelect] = createSelect(
        'Plätze freilassen',
        [0, 1, 2, 3, 4, 5]
    );
    const fustwDglDelay = document.createElement('input');
    fustwDglDelay.type = 'number';
    fustwDglDelay.classList.add('flex-grow-1', 'form-control', 'w-100');
    fustwDglDelay.min = '0';
    fustwDglDelay.max = '240';
    fustwDglDelay.placeholder = fustwDglDelay.title =
        'Verzögerung in Minuten (leer = globaler Standardwert)';

    fustwDglEnabledCheckbox.addEventListener('change', () => {
        [
            fustwDglOwnCheckbox,
            fustwDglTaxSelect,
            fustwDglDistanceSelect,
            fustwDglFreeSelect,
            fustwDglDelay,
        ].forEach(el => (el.disabled = !fustwDglEnabledCheckbox.checked));
    });

    const [fustwDglForm, fustwDglListWrapper] = createTabPaneContent(
        'Korrekt konfigurierte FuStW (DGL): %s Fahrzeuge',
        'Falsch konfigurierte FuStW (DGL): %s Fahrzeuge',
        [
            fustwDglEnabledLabel,
            fustwDglOwnLabel,
            fustwDglTaxSelect,
            fustwDglDistanceSelect,
            fustwDglFreeSelect,
            fustwDglDelay,
        ],
        () => void 0
    );

    fustwTabPane.append(
        fustwDglForm,
        'Leider ist aktuell nicht feststellbar, welche Fahrzeuge neu konfiguriert werden müssen, daher werden alle Fahrzeuge konfiguriert.',
        fustwDglListWrapper
    );
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

    const [trailerSelect] = createSelect(
        'Anhänger auswählen',
        trailers.map(v => ({
            value: v,
            text: vehicleTypes[v].caption,
        }))
    );

    const { label: randomTowingLabel, checkbox: randomTowingCheckbox } =
        createCheckbox('Zufälliges Zugfahrzeug?');
    randomTowingCheckbox.addEventListener('change', () => {
        towingSelect.disabled = randomTowingCheckbox.checked;
    });

    const [towingSelect, towingOption] = createSelect('Zugfahrzeug auswählen');
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

    const [towingForm, towingListWrapper] = createTabPaneContent(
        'Korrektes Zugfahrzeug: %s Fahrzeuge',
        'Falsches Zugfahrzeug: %s Fahrzeuge',
        [trailerSelect, randomTowingLabel, towingSelect],
        (correctList, wrongList) => {
            if (
                trailerSelect.value === '-1' ||
                (!randomTowingCheckbox.checked && towingSelect.value === '-1')
            ) {
                return;
            }

            const trailers = vehicles.filter(
                ({ vehicle_type }) =>
                    vehicle_type === Number(trailerSelect.value)
            );
            trailers.forEach(vehicle => {
                const link = createLink(
                    `/vehicles/${vehicle.id}`,
                    vehicle.caption
                );
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
                        createLink(
                            `/vehicles/${towingVehicle?.id}`,
                            towingVehicle?.caption
                        )
                    );
                addListGroupItem(
                    isCorrect ? correctList : wrongList,
                    '',
                    link,
                    ' ➡️ ',
                    targetContent
                );
            });
        }
    );

    towingTabPane.append(
        towingForm,
        'Irgendwann wird man hier sicherlich auch noch das Einstellen der Zugfahrzeuge durchführen lassen können :)',
        towingListWrapper
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

    Promise.all([
        getVehicleTypes(),
        getVehicles(),
        getBuildings(),
        getAllianceBuildings(),
        getRoleFlags(),
    ]).then(() => {
        fillModal(body);
        finish();
    });
});

// insert the trigger-element to the DOM
/** @type {HTMLLIElement | undefined} */
document
    .querySelector('#menu_profile + .dropdown-menu > li.divider')
    ?.before(triggerLi);
