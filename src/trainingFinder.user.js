// ==UserScript==
// @name            [LSS] Training Finder
// @name:de         [LSS] Ausbildungsfinder
// @namespace       https://jxn.lss-manager.de
// @version         2024.01.19+1234
// @author          Jan (jxn_30)
// @description     Lists all buildings and amount of staff with a specific training
// @description:de  Listet alle Gebäude und die Anzahl an Personal mit einer bestimmten Ausbildung auf
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/trainingFinder.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/trainingFinder.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/25273-script-ausbildungsfinder/
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
// @resource        icon https://github.com/jxn-30/LSS-Scripts/raw/3bba6194f1/resources/trainingFinder.user.js/icon.png#sha256=d746f4a5a87115767f1a0759f80f710df3c1d116357f2e30f7bd2f53e2a53e95
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_getResourceURL
// ==/UserScript==

/**
 * @name Training Finder
 * @name:de Ausbildungsfinder
 * @description Lists all buildings and amount of staff with a specific training
 * @description:de Listet alle Gebäude und die Anzahl an Personal mit einer bestimmten Ausbildung auf
 * @forum https://forum.leitstellenspiel.de/index.php?thread/25273-script-ausbildungsfinder/
 * @match /
 * @// icon taken from https://icons8.com/icon/7BHYSrE6cAZk/library-building
 * @resource icon /resources/trainingFinder.user.js/icon.png
 * @grant GM_addStyle
 * @grant GM_getResourceURL
 */

/* global I18n */

/**
 * @typedef {Object} BuildingType A partial building type as returned by the LSSM API
 * @property {string} caption
 * @property {number[]} [schools]
 * @property {string} [school]
 * @property {boolean} [isDispatchCenter]
 */

/** @type {Record<number, BuildingType>} */
let buildingTypes;
/**
 * fetches all building types from LSSM API
 * @param {string} lang
 * @returns {Record<number, BuildingType> | Promise<Record<number, BuildingType>>}
 */
const getBuildingTypes = lang =>
    buildingTypes ??
    fetch(`https://api.lss-manager.de/${lang}/buildings`)
        .then(res => res.json())
        .then(buildings => (buildingTypes = buildings));

/**
 * @typedef {Object} SchoolingType A schooling type as returned by the LSSM API
 * @property {string} caption
 * @property {string} duration
 * @property {string} staffList
 * @property {string} key
 */

/** @type {Record<string, SchoolingType[]>} */
let schoolingTypes;
/**
 * fetches all building types from LSSM API
 * @param {string} lang
 * @returns {Record<string, SchoolingType[]> | Promise<Record<string, SchoolingType[]>>}
 */
const getSchoolingTypes = lang =>
    schoolingTypes ??
    fetch(`https://api.lss-manager.de/${lang}/schoolings`)
        .then(res => res.json())
        .then(schoolings => (schoolingTypes = schoolings));

/** @type {Record<number, number>} */
let smallBuildingTypes;

/**
 * fetches the mapping building => small building from LSSM API
 * @param {string} lang
 * @returns {Record<number, number> | Promise<Record<number, number>>}
 */
const getSmallBuildingTypes = lang =>
    smallBuildingTypes ??
    fetch(`https://api.lss-manager.de/${lang}/small_buildings`)
        .then(res => res.json())
        .then(smallBuildings => (smallBuildingTypes = smallBuildings));

/**
 *
 * @param {Building} building
 * @returns {number}
 */
const getBuildingType = building =>
    (building.small_building ?
        smallBuildingTypes[building.building_type]
    :   undefined) ?? building.building_type;

/**
 * @typedef {Object} Building A partial building as returned by the Game API
 * @property {number} id
 * @property {string} caption
 * @property {number} building_type
 * @property {number} personal_count
 * @property {number} leitstelle_building_id
 * @property {boolean} [small_building]
 */

/**
 * fetches all own buildings from the Game API
 * @returns {Promise<Building[]>}
 */
const getBuildings = () => fetch('/api/buildings').then(res => res.json());
/**
 * fetches all alliance buildings from the Game API
 * @returns {Promise<Building[]>}
 */
const getAllianceBuildings = () =>
    fetch('/api/alliance_buildings').then(res => res.json());

/*
 * create a select element with optional fake placeholder
 * @param {string} [placeholder]
 * @returns {HTMLSelectElement}
 */
const createSelect = (placeholder = '') => {
    const select = document.createElement('select');
    select.classList.add('form-control');
    select.style.setProperty('flex-basis', '200px');

    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = placeholder;
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.hidden = true;
    select.append(placeholderOption);

    return select;
};

/**
 * sets the text of a span and hides it if amount is 0
 * @param {HTMLSpanElement} span
 * @param {number} amount
 * @param {"total" | "current" | "finished"} type
 */
const setStaffSpan = (span, amount, type) => {
    const texts = {
        total: 'Angestellte',
        current: 'in Ausbildung',
        finished: 'ausgebildet',
    };

    span.textContent = `${amount.toLocaleString()}\xa0${texts[type]}`;
    if (amount) {
        span.classList.remove('hidden');
    } else {
        span.classList.add('hidden');
    }
};

const createFlexDiv = () => {
    const div = document.createElement('div');
    div.classList.add(
        'flex-row',
        'flex-nowrap',
        'justify-between',
        'align-items-center',
        flexRowClass
    );
    return div;
};

const createFlexSpacing = () => {
    const div = document.createElement('div');
    div.classList.add('flex-grow-1');
    return div;
};

// each request should take at least 100ms
const timeoutReq = promise =>
    Promise.all([
        promise,
        new Promise(resolve => setTimeout(() => resolve(), 100)),
    ]).then(([result]) => result);

const modalId = 'jxn-training_finder-modal';
const processedBuildingClass = 'building-processed';
const flexRowClass = 'flexed-row';

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

#${modalId} .scroll-to-top {
    position: fixed;
    bottom: 15px;
    right: 15px;
}

#${modalId} .nav-tabs.disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
}
    
#${modalId} .progress {
    margin: 0;
    position: fixed;
    width: calc(100% - 2 * 15px);
    bottom: 15px;
    z-index: 1;
}

#${modalId} .progress-bar[data-current][data-total]::before {
    content: attr(data-current)" / "attr(data-total);
}

#${modalId} th input {
    font-size:12px;
    border:1px solid #ccc;
    border-radius:4px
}

#${modalId} table tbody td:not(:first-child) {
    text-align: right;
}

#${modalId} tbody:has(.${processedBuildingClass}) tr:not(.${processedBuildingClass}) {
    opacity: 0.5;
}

#${modalId} .${flexRowClass} {
    gap: 10px;
}
`);

// These are the fallback schools for each schooling type. They are schools of LSSM Test alliance
const fallbackSchools = {
    Feuerwehr: 10733232,
    Polizei: 19706325,
    Rettungsdienst: 19706323,
    THW: 19706327,
};

/**
 * @typedef {Object} StorageEntry
 * @property {number} current
 * @property {number} finished
 */

/** @type {Record<string, Record<number, StorageEntry[]>>} */
const storage = {};
/** @type {Record<string, Record<number, Set<number>>>} */
const processedBuildings = {};

// create a modal and fill it with Data
const createModal = async () => {
    let fetchAborted = false;

    await getBuildingTypes(I18n.locale);
    await getSchoolingTypes(I18n.locale);
    await getSmallBuildingTypes(I18n.locale);

    const dispatchCenterTypes = Object.entries(buildingTypes)
        .filter(([, { isDispatchCenter }]) => isDispatchCenter)
        .map(([id]) => parseInt(id));

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
        fetchAborted = true;
    };

    close.addEventListener('click', event => {
        event.preventDefault();
        closeModal();
    });

    const progressWrapper = document.createElement('div');
    progressWrapper.classList.add('progress', 'hidden');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar', 'progress-bar-striped', 'active');
    progressBar.dataset.current = '0';
    progressBar.dataset.total = '0';
    progressWrapper.append(progressBar);

    const scrollToTop = document.createElement('button');
    scrollToTop.classList.add('btn', 'btn-default', 'btn-xs', 'scroll-to-top');
    scrollToTop.textContent = '↑';

    scrollToTop.addEventListener('click', () =>
        body.scrollTo({ top: 0, behavior: 'smooth' })
    );

    dialog.append(content);
    modal.append(dialog);
    document.body.append(modal);

    modal.classList.add('in');
    modal.style.setProperty('display', 'block');

    const buildings = await getBuildings();
    const allianceBuildings = await getAllianceBuildings();

    const tabList = document.createElement('ul');
    tabList.classList.add('nav', 'nav-tabs');
    tabList.setAttribute('role', 'tablist');

    const tabContent = document.createElement('div');
    tabContent.classList.add('tab-content');

    body.append(close, tabList, tabContent, progressWrapper, scrollToTop);

    Object.keys(schoolingTypes)
        .sort()
        .forEach((schoolingType, index) => {
            const schoolBuildingType = Object.keys(buildingTypes).find(
                id => buildingTypes[id]?.school === schoolingType
            );
            if (!schoolBuildingType) return;

            storage[schoolingType] ??= {};
            processedBuildings[schoolingType] ??= {};

            const relevantBuildingTypes = Object.keys(buildingTypes)
                .filter(id =>
                    buildingTypes[id]?.schools?.includes(
                        parseInt(schoolBuildingType)
                    )
                )
                .sort((a, b) =>
                    buildingTypes[a].caption.localeCompare(
                        buildingTypes[b].caption
                    )
                );

            const tab = document.createElement('li');
            tab.setAttribute('role', 'presentation');
            const tabA = document.createElement('a');
            tabA.setAttribute('role', 'tab');
            tabA.setAttribute('data-toggle', 'tab');
            tabA.textContent = schoolingType;
            tab.appendChild(tabA);
            tabList.appendChild(tab);

            const tabPane = document.createElement('div');
            tabPane.classList.add('tab-pane');
            tabPane.setAttribute('role', 'tabpanel');
            tabPane.id = `${modalId}-tab-${index}`;
            tabA.href = `#${tabPane.id}`;
            tabA.setAttribute('aria-controls', tabPane.id);
            tabContent.append(tabPane);

            if (index === 0) {
                tab.classList.add('active');
                tabPane.classList.add('active');
            }

            const anyFittingSchoolId =
                buildings.find(
                    building =>
                        getBuildingType(building) ===
                        parseInt(schoolBuildingType)
                )?.id ??
                allianceBuildings.find(
                    building =>
                        getBuildingType(building) ===
                        parseInt(schoolBuildingType)
                )?.id ??
                fallbackSchools[schoolingType];

            const schoolSelect = createSelect('Lehrgang auswählen');
            schoolSelect.classList.add('flex-grow-1');

            schoolingTypes[schoolingType].forEach((schooling, index) => {
                const option = document.createElement('option');
                option.textContent = schooling.caption;
                option.value = index.toString();
                schoolSelect.append(option);
            });

            const buildingTypeSelect = createSelect('Gebäudeart auswählen');
            buildingTypeSelect.classList.add('flex-grow-1');

            relevantBuildingTypes.forEach(buildingTypeId => {
                const option = document.createElement('option');
                option.textContent = buildingTypes[buildingTypeId].caption;
                option.value = buildingTypeId;
                buildingTypeSelect.append(option);
            });

            const dispatchCenterSelect = createSelect();
            dispatchCenterSelect.classList.add('flex-grow-1');

            const allDispatchCentersOption = document.createElement('option');
            allDispatchCentersOption.textContent = '[Alle Leitstellen]';
            allDispatchCentersOption.value = '';
            allDispatchCentersOption.selected = true;

            const noDispatchCenterOption = document.createElement('option');
            noDispatchCenterOption.textContent = '[Keine Leitstelle]';
            noDispatchCenterOption.value = '-1';

            dispatchCenterSelect.append(
                allDispatchCentersOption,
                noDispatchCenterOption
            );

            buildings
                .filter(building =>
                    dispatchCenterTypes.includes(getBuildingType(building))
                )
                .sort((a, b) => a.caption.localeCompare(b.caption))
                .forEach(building => {
                    const option = document.createElement('option');
                    option.textContent = building.caption;
                    option.value = building.id.toString();
                    dispatchCenterSelect.append(option);
                });

            const infoSpan = document.createElement('span');
            infoSpan.textContent =
                'Bitte wähle einen Lehrgang und eine Gebäudeart aus.';

            const calcBtn = document.createElement('button');
            calcBtn.classList.add('btn', 'btn-success', 'btn-sm');
            calcBtn.style.setProperty('margin-left', '10px');
            calcBtn.style.setProperty('margin-right', '5px');
            calcBtn.textContent = 'Angestellte finden';
            calcBtn.disabled = true;

            const abortBtn = document.createElement('button');
            abortBtn.classList.add('btn', 'btn-danger', 'btn-sm', 'hidden');
            abortBtn.style.setProperty('margin-left', '5px');
            abortBtn.style.setProperty('margin-right', '10px');
            abortBtn.textContent = 'Abbrechen';
            abortBtn.disabled = true;

            abortBtn.addEventListener('click', () => (fetchAborted = true));

            const table = document.createElement('table');
            table.classList.add('table', 'table-striped', 'table-hover');
            table.style.setProperty('margin-top', '10px');

            const thead = table.createTHead();
            const theadTr = thead.insertRow();
            const theadName = document.createElement('th');
            const theadNameFlex = createFlexDiv();
            theadName.append(theadNameFlex);
            const theadAmount = document.createElement('th');
            const theadAmountFlex = createFlexDiv();
            theadAmount.append(theadAmountFlex);
            const theadTotal = document.createElement('th');
            theadTotal.style.setProperty('width', '0');
            theadTr.append(theadName, theadAmount, theadTotal);

            const tbody = table.createTBody();

            /** @type {Building[]} */
            let selectedBuildings = [];
            /** @type {Building[]} */
            let filteredBuildings = [];

            let totalStaff = 0;
            let totalStaffCurrent = 0;
            let totalStaffFinished = 0;

            const searchInput = document.createElement('input');
            searchInput.classList.add('search_input_field');
            searchInput.type = 'search';
            searchInput.placeholder = 'Gebäude suchen...';
            theadNameFlex.append('Gebäude', createFlexSpacing(), searchInput);

            const getSearchInput = () => searchInput.value.toLowerCase();

            let searchTimeout;
            const updateSearch = () => {
                if (searchTimeout) clearTimeout(searchTimeout);
                searchTimeout = setTimeout(updateTable, 100);
            };

            const minTrainingInput = document.createElement('input');
            minTrainingInput.type = 'number';
            minTrainingInput.min = '0';
            minTrainingInput.placeholder = 'insg. min ausgebildet';

            const maxTrainingInput = document.createElement('input');
            maxTrainingInput.type = 'number';
            maxTrainingInput.min = '0';
            maxTrainingInput.placeholder = 'insg. max ausgebildet';
            theadAmountFlex.append(
                'Personal',
                createFlexSpacing(),
                minTrainingInput,
                maxTrainingInput
            );

            const maxStaffInput = document.createElement('input');
            maxStaffInput.classList.add('pull-right');
            maxStaffInput.type = 'number';
            maxStaffInput.min = '0';
            maxStaffInput.placeholder = 'max Angestellt';
            theadTotal.append(maxStaffInput);

            const setInfoText = () => {
                if (
                    schoolSelect.value === '' &&
                    buildingTypeSelect.value === ''
                ) {
                    infoSpan.textContent =
                        'Bitte wähle einen Lehrgangstyp und eine Gebäudeart aus.';
                    return;
                }
                if (schoolSelect.value === '') {
                    infoSpan.textContent =
                        'Bitte wähle einen Lehrgangstyp aus.';
                    return;
                }
                if (buildingTypeSelect.value === '') {
                    infoSpan.textContent = 'Bitte wähle eine Gebäudeart aus.';
                    return;
                }

                /** @type {string[]} */
                const texts = [];

                if (selectedBuildings.length === filteredBuildings.length) {
                    texts.push(
                        `Angezeigte Gebäude: ${selectedBuildings.length.toLocaleString()}`
                    );
                } else {
                    texts.push(
                        `Angezeigte Gebäude: ${filteredBuildings.length.toLocaleString()} (Gesamt: ${selectedBuildings.length.toLocaleString()})`
                    );
                }

                const processed =
                    processedBuildings[schoolingType][schoolSelect.value].size;
                if (processed > 0 && processed < filteredBuildings.length) {
                    texts.push(
                        'Nicht-abgefragte Gebäude sind halbtransparent.'
                    );
                }

                if (totalStaff) {
                    texts.push(`Personal: ${totalStaff.toLocaleString()}`);
                }

                if (totalStaffCurrent || totalStaffFinished) {
                    texts.push(
                        `Personal in Ausbildung: ${totalStaffCurrent.toLocaleString()}`,
                        `Personal ausgebildet: ${totalStaffFinished.toLocaleString()}`
                    );
                }

                infoSpan.textContent = texts.join(' | ');
            };
            setInfoText();

            const updateTable = () => {
                if (buildingTypeSelect.value === '') {
                    return;
                }

                selectedBuildings = buildings
                    .filter(
                        building =>
                            getBuildingType(building) ===
                            parseInt(buildingTypeSelect.value)
                    )
                    .sort((a, b) => a.caption.localeCompare(b.caption));

                filteredBuildings = selectedBuildings.filter(
                    ({ caption, leitstelle_building_id, personal_count, id }) =>
                        ((
                            dispatchCenterSelect.value // does the building belong to the selected dispatch center?
                        ) ?
                            leitstelle_building_id ===
                            parseInt(dispatchCenterSelect.value)
                        :   true) &&
                        caption.toLowerCase().includes(getSearchInput()) && // does the building name match the search input?
                        ((
                            maxStaffInput.value // is the max staff input set and is staff at the building not greater?
                        ) ?
                            parseInt(maxStaffInput.value) >= personal_count
                        :   true) &&
                        ((
                            minTrainingInput.value // is the min training input set and is trained staff at the building not smaller?
                        ) ?
                            parseInt(minTrainingInput.value) <=
                            (storage[schoolingType][id]?.[schoolSelect.value]
                                ?.current ?? 0) +
                                (storage[schoolingType][id]?.[
                                    schoolSelect.value
                                ]?.finished ?? 0)
                        :   true) &&
                        ((
                            maxTrainingInput.value // is the max training input set and is trained staff at the building not greater?
                        ) ?
                            parseInt(maxTrainingInput.value) >=
                            (storage[schoolingType][id]?.[schoolSelect.value]
                                ?.current ?? 0) +
                                (storage[schoolingType][id]?.[
                                    schoolSelect.value
                                ]?.finished ?? 0)
                        :   true)
                );

                calcBtn.disabled = schoolSelect.value === '';

                // empty the table body
                tbody.replaceChildren();

                totalStaff = 0;
                totalStaffCurrent = 0;
                totalStaffFinished = 0;

                filteredBuildings.forEach(
                    ({
                        caption,
                        id,
                        personal_count,
                        leitstelle_building_id,
                    }) => {
                        const tr = tbody.insertRow();
                        tr.dataset.buildingId = id.toString();
                        tr.dataset.buildingCaption = caption.toLowerCase();
                        tr.dataset.dispatchCenter = (
                            leitstelle_building_id ?? -1
                        ).toString();

                        processedBuildings[schoolingType][
                            schoolSelect.value
                        ] ??= new Set();

                        if (
                            processedBuildings[schoolingType][
                                schoolSelect.value
                            ].has(id)
                        ) {
                            tr.classList.add(processedBuildingClass);
                        }

                        const name = tr.insertCell();
                        const link = document.createElement('a');
                        link.classList.add('lightbox-open');
                        link.href = `/buildings/${id}`;
                        link.textContent = caption;
                        name.append(link);

                        const amount = tr.insertCell();

                        const staffLink = document.createElement('a');
                        staffLink.classList.add(
                            'lightbox-open',
                            'btn',
                            'btn-xs',
                            'btn-default'
                        );
                        staffLink.href = `/buildings/${id}/personals`;
                        const staffIcon = document.createElement('span');
                        staffIcon.classList.add('glyphicon', 'glyphicon-user');
                        staffLink.append(staffIcon);

                        const currentSpan = document.createElement('span');
                        currentSpan.classList.add(
                            'label',
                            'label-info',
                            'hidden'
                        );

                        const current =
                            storage[schoolingType][id]?.[schoolSelect.value]
                                ?.current ?? 0;

                        setStaffSpan(currentSpan, current, 'current');

                        const finishedSpan = document.createElement('span');
                        finishedSpan.classList.add(
                            'label',
                            'label-success',
                            'hidden'
                        );

                        const finished =
                            storage[schoolingType][id]?.[schoolSelect.value]
                                ?.finished ?? 0;

                        setStaffSpan(finishedSpan, finished, 'finished');

                        const totalSpan = document.createElement('span');
                        totalSpan.classList.add('label', 'label-default');
                        setStaffSpan(totalSpan, personal_count, 'total');

                        totalStaff += personal_count;
                        totalStaffCurrent += current;
                        totalStaffFinished += finished;

                        const amountFlex = createFlexDiv();
                        amountFlex.append(
                            staffLink,
                            createFlexSpacing(),
                            currentSpan,
                            finishedSpan
                        );
                        amount.append(amountFlex);

                        const total = tr.insertCell();
                        total.append(totalSpan);
                    }
                );

                setInfoText();
            };

            schoolSelect.addEventListener('change', updateTable);
            buildingTypeSelect.addEventListener('change', updateTable);
            dispatchCenterSelect.addEventListener('change', updateTable);

            searchInput.addEventListener('input', updateSearch);
            searchInput.addEventListener('change', updateSearch);
            dispatchCenterSelect.addEventListener('change', updateSearch);

            const updateMinTraining = () => {
                maxTrainingInput.min = minTrainingInput.value ?? '0';
                if (minTrainingInput.value === '0') {
                    minTrainingInput.value = null;
                } else if (
                    parseInt(maxTrainingInput.value) < minTrainingInput.value
                ) {
                    maxTrainingInput.value = minTrainingInput.value;
                }
                updateSearch();
            };
            minTrainingInput.addEventListener('input', updateMinTraining);
            minTrainingInput.addEventListener('change', updateMinTraining);
            const updateMaxTraining = () => {
                minTrainingInput.max = maxTrainingInput.value ?? '0';

                if (maxTrainingInput.value === '0') {
                    maxTrainingInput.value = null;
                }

                updateSearch();
            };
            maxTrainingInput.addEventListener('input', updateMaxTraining);
            maxTrainingInput.addEventListener('change', updateMaxTraining);
            const updateMaxStaff = () => {
                if (maxStaffInput.value === '0') {
                    maxStaffInput.value = null;
                }
                updateSearch();
            };
            maxStaffInput.addEventListener('input', updateMaxStaff);
            maxStaffInput.addEventListener('change', updateMaxStaff);

            calcBtn.addEventListener('click', async () => {
                body.style.setProperty('overflow', 'hidden');
                tabList.classList.add('disabled');
                progressWrapper.classList.remove('hidden');
                schoolSelect.disabled = true;
                buildingTypeSelect.disabled = true;
                dispatchCenterSelect.disabled = true;
                calcBtn.disabled = true;
                calcBtn.classList.add('hidden');
                abortBtn.disabled = false;
                abortBtn.classList.remove('hidden');

                searchInput.disabled = true;
                minTrainingInput.disabled = true;
                maxTrainingInput.disabled = true;
                maxStaffInput.disabled = true;

                let counter = 0;
                progressBar.dataset.total =
                    filteredBuildings.length.toLocaleString();

                totalStaffCurrent = 0;
                totalStaffFinished = 0;

                processedBuildings[schoolingType][schoolSelect.value].clear();

                infoSpan.textContent =
                    'Bitte warten, die Daten werden abgerufen...';

                table
                    .querySelectorAll(`tr.${processedBuildingClass}`)
                    .forEach(row =>
                        row.classList.remove(processedBuildingClass)
                    );

                let currentBuilding;

                for (currentBuilding of filteredBuildings) {
                    if (fetchAborted) break;

                    const answer = await timeoutReq(
                        fetch(
                            `/buildings/${anyFittingSchoolId}/schoolingEducationCheck?education=${schoolSelect.value}&only_building_id=${currentBuilding.id}`
                        )
                            .then(res => res.text())
                            .then(html =>
                                new DOMParser().parseFromString(
                                    html,
                                    'text/html'
                                )
                            )
                    );
                    const current = parseInt(
                        answer
                            .querySelector('span.label-info')
                            ?.textContent?.trim() ?? '0'
                    );
                    totalStaffCurrent += current;
                    const finished = parseInt(
                        answer
                            .querySelector('span.label-success')
                            ?.textContent?.trim() ?? '0'
                    );
                    totalStaffFinished += finished;

                    const row = table.querySelector(
                        `tr[data-building-id="${currentBuilding.id}"]`
                    );

                    row?.classList.add(processedBuildingClass);
                    processedBuildings[schoolingType][schoolSelect.value].add(
                        currentBuilding.id
                    );

                    const currentSpan = row?.querySelector('span.label-info');

                    setStaffSpan(currentSpan, current, 'current');

                    const finishedSpan =
                        row?.querySelector('span.label-success');

                    setStaffSpan(finishedSpan, finished, 'finished');

                    storage[schoolingType][currentBuilding.id] ??= [];
                    storage[schoolingType][currentBuilding.id][
                        schoolSelect.value
                    ] = { current, finished };

                    counter++;

                    progressBar.dataset.current = counter.toLocaleString();
                    progressBar.style.setProperty(
                        'width',
                        `${(
                            (counter / filteredBuildings.length) *
                            100
                        ).toString()}%`
                    );
                }

                updateTable();

                fetchAborted = false;

                body.style.removeProperty('overflow');
                tabList.classList.remove('disabled');
                progressWrapper.classList.add('hidden');
                schoolSelect.disabled = false;
                buildingTypeSelect.disabled = false;
                dispatchCenterSelect.disabled = false;
                calcBtn.disabled = false;
                calcBtn.classList.remove('hidden');
                abortBtn.disabled = true;
                abortBtn.classList.add('hidden');

                searchInput.disabled = false;
                minTrainingInput.disabled = false;
                maxTrainingInput.disabled = false;
                maxStaffInput.disabled = false;
            });

            if (relevantBuildingTypes.length === 1) {
                buildingTypeSelect.value = relevantBuildingTypes[0];
                buildingTypeSelect.classList.add('hidden');
                updateTable();
            }

            const selectWrapper = document.createElement('div');
            selectWrapper.classList.add(
                'flex-row',
                'justify-between',
                'align-items-center'
            );
            selectWrapper.style.setProperty('margin-top', '10px');
            selectWrapper.style.setProperty('margin-bottom', '10px');
            selectWrapper.style.setProperty('gap', '10px');
            selectWrapper.style.setProperty('flex-wrap', 'wrap');
            selectWrapper.append(
                schoolSelect,
                buildingTypeSelect,
                dispatchCenterSelect
            );

            tabPane.append(selectWrapper, infoSpan, calcBtn, abortBtn, table);
        });

    content.append(body);
};

// create a trigger-element
const triggerLi = document.createElement('li');
const triggerA = document.createElement('a');
const triggerImg = document.createElement('img');
triggerImg.src = GM_getResourceURL('icon');
triggerImg.width = 24;
triggerImg.height = 24;
triggerA.href = '#';
triggerA.append(triggerImg, '\xa0Ausbildungsfinder');
triggerLi.append(triggerA);

triggerLi.addEventListener('click', event => {
    event.preventDefault();
    createModal().then();
});

// insert the trigger-element to the DOM
/** @type {HTMLLIElement | undefined} */
document
    .querySelector('#menu_profile + .dropdown-menu > li.divider')
    ?.before(triggerLi);
