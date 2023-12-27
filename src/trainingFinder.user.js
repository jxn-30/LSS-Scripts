// ==UserScript==
// @name            [LSS] Training Finder
// @name:de         [LSS] Ausbildungsfinder
// @namespace       https://jxn.lss-manager.de
// @version         2023.12.27+2309
// @author          Jan (jxn_30)
// @description     Lists all buildings and amount of staff with a specific training
// @description:de  Listet alle Gebäude und die Anzahl an Personal mit einer bestimmten Ausbildung auf
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/trainingFinder.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/trainingFinder.user.js
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
// @resource        icon https://github.com/jxn-30/LSS-Scripts/raw/3bba6194f1/resources/trainingFinder.user.js/icon.png#sha256=d4e98f21462a09cfc381aa3dfc6eeee6ada272ba900ce118dec70a6471b51e96
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_getResourceURL
// ==/UserScript==

/**
 * @name Training Finder
 * @name:de Ausbildungsfinder
 * @description Lists all buildings and amount of staff with a specific training
 * @description:de Listet alle Gebäude und die Anzahl an Personal mit einer bestimmten Ausbildung auf
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

/**
 * @typedef {Object} Building A partial building as returned by the Game API
 * @property {number} id
 * @property {string} caption
 * @property {number} building_type
 * @property {number} personal_count
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

const modalId = 'jxn-training_finder-modal';

/*
 * create a select element with optional fake placeholder
 * @param {string} [placeholder]
 * @returns {HTMLSelectElement}
 */
const createSelect = (placeholder = '') => {
    const select = document.createElement('select');
    select.classList.add('form-control');
    select.style.setProperty('margin-top', '10px');

    const placeholderOption = document.createElement('option');
    placeholderOption.textContent = placeholder;
    placeholderOption.value = '';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    placeholderOption.hidden = true;
    select.append(placeholderOption);

    return select;
};

// each request should take at least 100ms
const timeoutReq = promise =>
    Promise.all([
        promise,
        new Promise(resolve => setTimeout(() => resolve(), 100)),
    ]).then(([result]) => result);

// create a modal and fill it with Data
const createModal = async () => {
    let modalIsClosed = false;

    await getBuildingTypes(I18n.locale);
    await getSchoolingTypes(I18n.locale);

    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = modalId;

    const dialog = document.createElement('div');
    dialog.classList.add('modal-dialog');
    dialog.style.setProperty('width', 'fit-content');
    dialog.style.setProperty('min-width', 'min(calc(1200px + 10vw), 100%)');

    const content = document.createElement('div');
    content.classList.add('modal-content');
    content.style.setProperty('margin-left', '5vw');
    content.style.setProperty('margin-right', '5vw');

    const body = document.createElement('div');
    body.classList.add('modal-body');
    body.style.setProperty('overflow', 'auto');
    body.style.setProperty('box-sizing', 'content-box');

    const close = document.createElement('span');
    close.classList.add('close');
    close.textContent = '×';

    const closeModal = () => {
        modal.classList.remove('in');
        modal.style.setProperty('display', 'none');
        modal.remove();
        modalIsClosed = true;
    };

    close.addEventListener('click', event => {
        event.preventDefault();
        closeModal();
    });

    const footer = document.createElement('div');
    footer.classList.add('modal-footer');

    const progressWrapper = document.createElement('div');
    progressWrapper.classList.add('progress', 'hidden');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar', 'progress-bar-striped', 'active');
    progressBar.dataset.current = '0';
    progressBar.dataset.total = '0';
    progressWrapper.append(progressBar);

    const scrollToTop = document.createElement('button');
    scrollToTop.classList.add('btn', 'btn-default', 'btn-xs');
    scrollToTop.style.setProperty('position', 'absolute');
    scrollToTop.style.setProperty('bottom', '15px');
    scrollToTop.style.setProperty('right', '15px');
    scrollToTop.textContent = '↑';

    scrollToTop.addEventListener('click', () =>
        body.scrollTo({ top: 0, behavior: 'smooth' })
    );

    footer.append(progressWrapper, scrollToTop);

    GM_addStyle(`
#${modalId} .nav-tabs.disabled {
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
}
    
#${modalId} .progress {
    margin-bottom: 0;
}

#${modalId} .progress-bar[data-current][data-total]::before {
    content: attr(data-current)" / "attr(data-total);
}
`);

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

    body.append(close, tabList, tabContent);

    Object.keys(schoolingTypes)
        .sort()
        .forEach((schoolingType, index) => {
            const schoolBuildingType = Object.keys(buildingTypes).find(
                id => buildingTypes[id]?.school === schoolingType
            );
            if (!schoolBuildingType) return;

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

            const anyFittingSchool =
                buildings.find(
                    ({ building_type }) =>
                        building_type === parseInt(schoolBuildingType)
                ) ??
                allianceBuildings.find(
                    ({ building_type }) =>
                        building_type === parseInt(schoolBuildingType)
                );

            if (!anyFittingSchool) {
                const infoAlert = document.createElement('div');
                infoAlert.classList.add('alert', 'alert-info');
                // TODO:  manuell ID einer Schule eines Verbandsmitglieds nutzen?
                infoAlert.textContent =
                    'Mist, leider hast du keine passende Schule und auch dein Verband hat keine passende Schule aus der Verbandskasse gebaut. ' +
                    'Daher können die Informationen leider nicht ausgelesen werden. Sorry!';
                tabPane.append(infoAlert);
                return;
            }

            const schoolSelect = createSelect('Lehrgang auswählen');

            schoolingTypes[schoolingType].forEach((schooling, index) => {
                const option = document.createElement('option');
                option.textContent = schooling.caption;
                option.value = index.toString();
                schoolSelect.append(option);
            });

            const buildingTypeSelect = createSelect('Gebäudeart auswählen');
            buildingTypeSelect.style.setProperty('margin-bottom', '10px');

            relevantBuildingTypes.forEach(buildingTypeId => {
                const option = document.createElement('option');
                option.textContent = buildingTypes[buildingTypeId].caption;
                option.value = buildingTypeId;
                buildingTypeSelect.append(option);
            });

            const infoSpan = document.createElement('span');
            infoSpan.textContent =
                'Bitte wähle einen Lehrgang und eine Gebäudeart aus. Kleinwachen können momentan leider nicht von normalen Gebäuden unterschieden werden.';

            const calcBtn = document.createElement('button');
            calcBtn.classList.add('btn', 'btn-success', 'btn-sm');
            calcBtn.style.setProperty('margin-left', '10px');
            calcBtn.style.setProperty('margin-right', '10px');
            calcBtn.textContent = 'Angestellte finden';
            calcBtn.disabled = true;

            const table = document.createElement('table');
            table.classList.add('table', 'table-striped', 'table-hover');
            table.style.setProperty('margin-top', '10px');

            const thead = table.createTHead();
            const theadTr = thead.insertRow();
            const theadName = document.createElement('th');
            theadName.textContent = 'Gebäude';
            const theadAmount = document.createElement('th');
            theadAmount.textContent = 'Personal';
            theadTr.append(theadName, theadAmount);

            const tbody = table.createTBody();

            /** @type {Building[]} */
            let selectedBuildings = [];

            const updateTable = () => {
                if (
                    schoolSelect.value === '' ||
                    buildingTypeSelect.value === ''
                ) {
                    return;
                }

                selectedBuildings = buildings
                    .filter(
                        ({ building_type }) =>
                            building_type === parseInt(buildingTypeSelect.value)
                    )
                    .sort((a, b) => a.caption.localeCompare(b.caption));

                infoSpan.textContent = `Du hast ${selectedBuildings.length.toLocaleString()} dieser Gebäude.`;

                calcBtn.disabled = false;

                // empty the table body
                tbody.replaceChildren();

                selectedBuildings.forEach(({ caption, id, personal_count }) => {
                    const tr = tbody.insertRow();

                    const name = tr.insertCell();
                    const link = document.createElement('a');
                    link.classList.add('lightbox-open');
                    link.href = `/buildings/${id}`;
                    link.textContent = caption;

                    const staffLink = document.createElement('a');
                    staffLink.classList.add(
                        'lightbox-open',
                        'btn',
                        'btn-xs',
                        'btn-default',
                        'pull-right'
                    );
                    staffLink.href = `/buildings/${id}/personals`;
                    const staffIcon = document.createElement('span');
                    staffIcon.classList.add('glyphicon', 'glyphicon-user');
                    staffLink.append(staffIcon);

                    name.append(link, staffLink);

                    const amount = tr.insertCell();

                    const currentSpan = document.createElement('span');
                    currentSpan.classList.add('label', 'label-info', 'hidden');
                    currentSpan.dataset.buildingId = id.toString();

                    const finishedSpan = document.createElement('span');
                    finishedSpan.classList.add(
                        'label',
                        'label-success',
                        'hidden'
                    );
                    finishedSpan.dataset.buildingId = id.toString();

                    const totalSpan = document.createElement('span');
                    totalSpan.classList.add('label', 'label-default');
                    totalSpan.textContent = `${personal_count.toLocaleString()}\xa0Angestellte`;

                    amount.append(
                        currentSpan,
                        '\xa0',
                        finishedSpan,
                        '\xa0',
                        totalSpan
                    );
                    amount.style.setProperty('text-align', 'right');
                });
            };

            schoolSelect.addEventListener('change', updateTable);
            buildingTypeSelect.addEventListener('change', updateTable);

            calcBtn.addEventListener('click', async () => {
                tabList.classList.add('disabled');
                progressWrapper.classList.remove('hidden');
                schoolSelect.disabled = true;
                buildingTypeSelect.disabled = true;
                calcBtn.disabled = true;

                let counter = 0;
                progressBar.dataset.total =
                    selectedBuildings.length.toLocaleString();

                let totalCurrent = 0;
                let totalFinished = 0;

                for (const building of selectedBuildings) {
                    if (modalIsClosed) return;

                    const answer = await timeoutReq(
                        fetch(
                            `/buildings/${anyFittingSchool.id}/schoolingEducationCheck?education=${schoolSelect.value}&only_building_id=${building.id}`
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
                    totalCurrent += current;
                    const finished = parseInt(
                        answer
                            .querySelector('span.label-success')
                            ?.textContent?.trim() ?? '0'
                    );
                    totalFinished += finished;

                    const currentSpan = table.querySelector(
                        `span.label-info[data-building-id="${building.id}"]`
                    );

                    if (current && currentSpan) {
                        currentSpan.textContent = `${current.toLocaleString()}\xa0in Ausbildung`;
                        currentSpan.classList.remove('hidden');
                    } else {
                        currentSpan?.classList.add('hidden');
                    }

                    const finishedSpan = table.querySelector(
                        `span.label-success[data-building-id="${building.id}"]`
                    );

                    if (finished && finishedSpan) {
                        finishedSpan.textContent = `${finished.toLocaleString()}\xa0ausgebildet`;
                        finishedSpan.classList.remove('hidden');
                    } else {
                        finishedSpan?.classList.add('hidden');
                    }

                    counter++;

                    progressBar.dataset.current = counter.toLocaleString();
                    progressBar.style.setProperty(
                        'width',
                        `${(
                            (counter / selectedBuildings.length) *
                            100
                        ).toString()}%`
                    );
                }

                infoSpan.textContent = `Du hast ${selectedBuildings.length.toLocaleString()} dieser Gebäude.
                ${totalCurrent.toLocaleString()} Angestellte sind in Ausbildung zum gewählten Lehrgang und
                ${totalFinished.toLocaleString()} bereits ausgebildet.`;

                tabList.classList.remove('disabled');
                progressWrapper.classList.add('hidden');
                schoolSelect.disabled = false;
                buildingTypeSelect.disabled = false;
                calcBtn.disabled = false;
            });

            tabPane.append(
                schoolSelect,
                buildingTypeSelect,
                infoSpan,
                calcBtn,
                table
            );
        });

    content.append(body, footer);
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