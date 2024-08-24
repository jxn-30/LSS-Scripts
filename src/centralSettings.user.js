// ==UserScript==
// @name            [LSS] Central Settings
// @name:de         [LSS] Zentrale Einstellungen
// @namespace       https://jxn.lss-manager.de
// @version         2024.08.24+1324
// @author          Jan (jxn_30)
// @description     Keeps settings for buildings (sharing cells and beds) and vehicles (automatic transport and towing vehicles) in one place.
// @description:de  Hält Einstellungen für Gebäude (Zellen- und Bettenfreigabe) und Fahrzeuge (automatische Transporte und Zugfahrzeuge) an einem Ort.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/centralSettings.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/centralSettings.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/26968-script-zentrale-einstellungen-endlich-wieder-krankenh%C3%A4user-zellen-elw-1-seg-und/
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
// @grant           GM_setValue
// @grant           GM_getValue
// ==/UserScript==

/**
 * @name Central Settings
 * @name:de Zentrale Einstellungen
 * @description Keeps settings for buildings (sharing cells and beds) and vehicles (automatic transport and towing vehicles) in one place.
 * @description:de Hält Einstellungen für Gebäude (Zellen- und Bettenfreigabe) und Fahrzeuge (automatische Transporte und Zugfahrzeuge) an einem Ort.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/26968-script-zentrale-einstellungen-endlich-wieder-krankenh%C3%A4user-zellen-elw-1-seg-und/
 * @match /
 * @// icon taken from https://icons8.com/icon/o4J5uguoduDW/share-settings
 * @resource icon /resources/centralSettings.user.js/icon.png
 * @grant GM_addStyle
 * @grant GM_getResourceURL
 * @grant GM_setValue
 * @grant GM_getValue
 */

/* global I18n, user_id, $ */

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

/**
 * @typedef {Object} Building A partial building as returned by the API
 *  @property {number} id
 *  @property {number} building_type
 *  @property {boolean} [is_alliance_shared]
 *  @property {number} [alliance_share_credits_percentage]
 */

/**
 * @typedef {Object} APICache
 * @property {Vehicle[]} [vehicles]
 * @property {Building[]} [buildings]
 * @property {Building[]} [allianceBuildings]
 */

/**
 * @type {APICache}
 */
const cache = {};

const getVehicles = () =>
    cache.vehicles ??
    fetch('/api/vehicles')
        .then(res => res.json())
        .then(
            v =>
                (cache.vehicles = v.toSorted((a, b) =>
                    a.caption.localeCompare(b.caption)
                ))
        );
const reGetVehicles = () => {
    delete cache.vehicles;
    return getVehicles();
};

const getBuildings = () =>
    cache.buildings ??
    fetch('/api/buildings')
        .then(res => res.json())
        .then(
            b =>
                (cache.buildings = b.toSorted((a, b) =>
                    a.caption.localeCompare(b.caption)
                ))
        );
const reGetBuildings = () => {
    delete cache.buildings;
    return getBuildings();
};

const getAllianceBuildings = () =>
    cache.allianceBuildings ??
    fetch('/api/alliance_buildings')
        .then(res => res.json())
        .then(
            b =>
                (cache.allianceBuildings = b.toSorted((a, b) =>
                    a.caption.localeCompare(b.caption)
                ))
        );
const reGetAllianceBuildings = () => {
    delete cache.allianceBuildings;
    return getAllianceBuildings();
};

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

#${modalId}:has(.list-group-item .progress-bar.active) .close {
    display: none;
}

body.dark #${modalId} .list-group-item {
    background-image: linear-gradient(to bottom, #505050 0, #000 100%);
    border-color: black;
    color: white;
}

body.dark #${modalId} .list-group-item.list-group-item-danger {
    background-image: unset;
    background-color: rgb(67, 26, 26);
}
`);

const createListGroupWrapper = () => {
    const listWrapper = document.createElement('div');
    listWrapper.classList.add('flex-row');
    listWrapper.style.setProperty('column-gap', '1em');
    return listWrapper;
};

const currentWrongList = new Map();

const createListGroup = () => {
    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group', 'flex-grow-1');
    return listGroup;
};

const addListGroupItem = (listGroup, ...content) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    const badge = document.createElement('span');
    badge.classList.add('badge', 'hidden');
    item.append(badge);
    item.append(...content);
    listGroup.append(item);

    return { item, badge };
};

const createListGroupSummary = (listGroup, title) => {
    const summary = document.createElement('li');
    summary.classList.add('list-group-item');
    summary.textContent = title.replace(
        '%s',
        listGroup.children.length.toLocaleString()
    );
    listGroup.prepend(summary);
    return summary;
};

const usedTowingVehicles = new Set();

const getTowingVehicle = (trailer, towingType) => {
    const romanNum = trailer.caption.match(/[^IVXLCDM][IVXLCDM]+$/)?.[0] ?? '';
    const arabicNum = trailer.caption.match(/\D\d+$/)?.[0] ?? '';
    const fitsFormal = v =>
        !usedTowingVehicles.has(v.id) && // not used yet
        v.vehicle_type === towingType && // correct vehicle type
        v.building_id === trailer.building_id; // same building
    const vehicle =
        cache.vehicles.find(
            v =>
                fitsFormal(v) && // formal aspects
                (romanNum ? v.caption.endsWith(romanNum) : true) && // same roman number (if any)
                (arabicNum ? v.caption.endsWith(arabicNum) : true) // same arabic number (if any)
        ) ?? cache.vehicles.find(fitsFormal); // If no vehicle was found with the same number, just take the first one that fits
    if (vehicle) usedTowingVehicles.add(vehicle.id);
    return vehicle;
};

const createLink = (href, text) => {
    const link = document.createElement('a');
    link.classList.add('lightbox-open');
    link.href = href;
    link.textContent = text;
    return link;
};

const doTimedRequest = request =>
    Promise.all([
        ...(Array.isArray(request) ? request : [request]),
        new Promise(resolve => setTimeout(resolve, 100)),
    ]).then(([res]) => res);

const modifyForm = async (url, modifier) => {
    const form = await doTimedRequest(fetch(url))
        .then(res => res.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'))
        .then(doc => doc.querySelector('form'));
    const formData = new FormData(form);
    modifier(formData);
    return doTimedRequest(
        fetch(form.action, { method: form.method, body: formData })
    );
};

const editVehicle = async (id, data) =>
    modifyForm(`/vehicles/${id}/edit`, formData => {
        Object.entries(data).forEach(([key, value]) =>
            formData.set(key, value.toString())
        );
    });

const editBuilding = async (id, { toggleShare, tax }) => {
    const requests = [];
    if (toggleShare) {
        requests.push(
            fetch(`/buildings/${id}/alliance`, {
                credentials: 'include',
                method: 'GET',
                mode: 'cors',
            })
        );
    }

    requests.push(
        fetch(`/buildings/${id}/alliance_costs/${tax / 10}`, {
            credentials: 'include',
            method: 'GET',
            mode: 'cors',
        })
    );

    return doTimedRequest(requests);
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

    $(tabA).on('shown.bs.tab', () =>
        tabPane
            .querySelector('.form-control-static')
            ?.dispatchEvent(new Event('change'))
    );

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

const createCheckbox = (text, id) => {
    const label = document.createElement('label');
    label.classList.add('flex-grow-1', 'form-check-label', 'text-right');
    label.style.setProperty('flex-basis', '0');
    label.textContent = `\xa0${text}`;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = GM_getValue(id, false);
    checkbox.addEventListener('change', () =>
        GM_setValue(id, checkbox.checked)
    );
    checkbox.classList.add('form-check-input');
    label.prepend(checkbox);
    return { label, checkbox };
};

const createSelect = (id, title, options = []) => {
    const select = document.createElement('select');
    select.classList.add('flex-grow-1', 'form-control');
    select.style.setProperty('flex-basis', '0');
    const savedValue = id ? GM_getValue(id, '-1') : '-1';
    const firstTime = savedValue === '-1';
    const titleOption = new Option(title, '-1', firstTime, firstTime);
    titleOption.disabled = true;
    select.append(titleOption);
    options.forEach(option =>
        select.append(
            typeof option === 'object' ?
                new Option(
                    option.text,
                    option.value,
                    savedValue === option.value,
                    savedValue === option.value
                )
            :   new Option(
                    option,
                    option,
                    savedValue === option.toString(),
                    savedValue === option.toString()
                )
        )
    );
    select.addEventListener('change', () => GM_setValue(id, select.value));
    return [select, titleOption];
};

const createTaxGroup = id => {
    const taxGroup = document.createElement('div');
    taxGroup.classList.add('btn-group');
    const stored = GM_getValue(id, 0);
    taxGroup.dataset.value = stored.toString();
    for (let i = 0; i <= 50; i += 10) {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-xs');
        btn.dataset.tax = i.toString();
        if (i === stored) btn.classList.add('btn-success');
        else btn.classList.add('btn-default');
        btn.textContent = i ? percent(i / 100) : 'Kostenlos';
        taxGroup.append(btn);
    }

    taxGroup.addEventListener('click', event => {
        event.preventDefault();
        const newBtn = event.target.closest('.btn');
        if (event.target.closest('.btn.btn-success') || !newBtn) return;
        taxGroup
            .querySelector('.btn-success')
            ?.classList.replace('btn-success', 'btn-default');
        newBtn?.classList.replace('btn-default', 'btn-success');
        taxGroup.dataset.value = newBtn?.dataset?.tax ?? '0';
        GM_setValue(id, parseInt(taxGroup.dataset.value));
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
    updateCallback,
    updatesAfterFix = []
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

        currentWrongList.clear();
        updateCallback(correctList, wrongList);

        const correctSummary = createListGroupSummary(
            correctList,
            correctSummaryText
        );
        const wrongSummary = createListGroupSummary(
            wrongList,
            wrongSummaryText
        );
        const processBtn = document.createElement('button');
        processBtn.classList.add('btn', 'btn-success', 'btn-xs', 'pull-right');
        processBtn.disabled = !currentWrongList.size;
        processBtn.textContent = 'Einstellungen übernehmen';

        const progressWrapper = document.createElement('div');
        progressWrapper.classList.add('progress');
        progressWrapper.style.setProperty('margin-bottom', '0');
        const progressBar = document.createElement('div');
        progressBar.classList.add(
            'progress-bar',
            'progress-bar-striped',
            'active'
        );
        progressBar.style.setProperty('width', '0%');
        progressWrapper.append(progressBar);

        processBtn.addEventListener('click', async e => {
            e.preventDefault();
            let aborted = false;
            const abortBtn = document.createElement('button');
            abortBtn.classList.add('btn', 'btn-danger', 'btn-xs', 'pull-right');
            abortBtn.textContent = 'Abbrechen';
            abortBtn.addEventListener('click', e => {
                e.preventDefault();
                abortBtn.disabled = true;
                aborted = true;
            });
            correctSummary.append(abortBtn);

            const tablistPlaceholders = [];
            const tablists = Array.from(
                form
                    .closest('.modal-body')
                    ?.querySelectorAll('ul[role=tablist]') ?? []
            );
            tablists.forEach(list => {
                const placeholder = document.createElement('div');
                list.replaceWith(placeholder);
                tablistPlaceholders.push(placeholder);
            });
            const formPlaceholder = document.createElement('div');
            form.replaceWith(formPlaceholder);

            wrongSummary.textContent = '';
            wrongSummary.replaceChildren(progressWrapper);
            const startTime = Date.now();
            let width = 0;
            const step = 100 / currentWrongList.size;
            for (const [_, { item, badge, updateFn }] of currentWrongList) {
                if (aborted) break;
                badge.textContent = '⏳️';
                badge.classList.remove('hidden');
                try {
                    await updateFn();
                    badge.textContent = '✅';
                    correctSummary.after(item);
                } catch {
                    badge.textContent = '❌';
                }
                width += step;
                progressBar.style.setProperty('width', `${width}%`);
                const elapsedTime = Date.now() - startTime;
                const totalTime = (elapsedTime / width) * 100;
                const remainingTime = totalTime - elapsedTime;
                const endDate = new Date(Date.now() + remainingTime);
                progressBar.textContent = [
                    percent(width / 100),
                    `${Math.ceil(remainingTime / 1000).toLocaleString('de')}\xa0s`,
                    `ETA:\xa0${endDate.toLocaleTimeString('de')}`,
                ].join(' / ');
            }
            setTimeout(
                () =>
                    Promise.all(updatesAfterFix.map(fn => fn())).then(() => {
                        formPlaceholder.replaceWith(form);
                        tablistPlaceholders.forEach((placeholder, i) =>
                            placeholder.replaceWith(tablists[i])
                        );
                        update();
                    }),
                1000
            );
        });

        wrongSummary.append(processBtn);
    };

    form.addEventListener('change', update);

    return [form, listWrapper];
};

const fillModal = body => {
    const tabList = document.createElement('ul');
    tabList.classList.add('nav', 'nav-tabs');
    tabList.setAttribute('role', 'tablist');

    const tabContent = document.createElement('div');
    tabContent.classList.add('tab-content');

    const selectionHint = document.createElement('div');
    selectionHint.classList.add('w-100');
    selectionHint.textContent =
        'Bitte wähle in allen Auswahlfeldern eine Option aus.';

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
        createCheckbox('Betten freigeben?', 'shareBeds');
    shareBedsCheckbox.checked = true;
    const ownBedsTaxGroup = createTaxGroup('ownBedsTax');
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
            const currentContent =
                hospital.is_alliance_shared ?
                    hospital.alliance_share_credits_percentage ?
                        percent(
                            hospital.alliance_share_credits_percentage / 100
                        )
                    :   'Kostenlos'
                :   'nicht geteilt';
            const item = addListGroupItem(
                isCorrect ? correctList : wrongList,
                link,
                ': ',
                ...(isCorrect ? [] : [currentContent, ' ➡️ ']),
                targetContent
            );
            if (!isCorrect) {
                currentWrongList.set(hospital.id, {
                    ...item,
                    updateFn: () =>
                        editBuilding(hospital.id, {
                            toggleShare:
                                hospital.is_alliance_shared !==
                                shareBedsCheckbox.checked,
                            tax,
                        }),
                });
            }
        });
    };

    const [ownBedsForm, ownBedsListWrapper] = createTabPaneContent(
        'Passend eingestellte Krankenhäuser: %s',
        'Falsch eingestellte Krankenhäuser: %s',
        [shareBedsLabel, ownBedsTaxGroup],
        (correctList, wrongList) =>
            createHospitalsLists(
                cache.buildings,
                parseInt(ownBedsTaxGroup.dataset.value),
                correctList,
                wrongList
            ),
        [reGetBuildings]
    );

    ownBedsPane.append(ownBedsForm, ownBedsListWrapper);

    ownBedsForm.dispatchEvent(new Event('change'));

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

        const allianceBedsTaxGroup = createTaxGroup('allianceBedsTax');
        const [allianceBedsForm, allianceBedsListWrapper] =
            createTabPaneContent(
                'Passend eingestellte Krankenhäuser: %s',
                'Falsch eingestellte Krankenhäuser: %s',
                [allianceBedsTaxGroup],
                (correctList, wrongList) =>
                    createHospitalsLists(
                        cache.allianceBuildings,
                        parseInt(allianceBedsTaxGroup.dataset.value),
                        correctList,
                        wrongList
                    ),
                [reGetAllianceBuildings]
            );

        allianceBedsPane.append(allianceBedsForm, allianceBedsListWrapper);

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
        createCheckbox('Zellen freigeben?', 'shareCells');
    shareCellsCheckbox.checked = true;
    const ownCellsTaxGroup = createTaxGroup('ownCellsTax');
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
                shareCellsCheckbox.checked ?
                    cellBuilding.is_alliance_shared &&
                    cellBuilding.alliance_share_credits_percentage === tax
                :   !cellBuilding.is_alliance_shared;
            const targetContent =
                shareCellsCheckbox.checked ?
                    tax ? percent(tax / 100)
                    :   'Kostenlos'
                :   'nicht geteilt';
            const currentContent =
                cellBuilding.is_alliance_shared ?
                    cellBuilding.alliance_share_credits_percentage ?
                        percent(
                            cellBuilding.alliance_share_credits_percentage / 100
                        )
                    :   'Kostenlos'
                :   'nicht geteilt';
            const item = addListGroupItem(
                isCorrect ? correctList : wrongList,
                link,
                ': ',
                ...(isCorrect ? [] : [currentContent, ' ➡️ ']),
                targetContent
            );
            if (!isCorrect) {
                currentWrongList.set(cellBuilding.id, {
                    ...item,
                    updateFn: () =>
                        editBuilding(cellBuilding.id, {
                            toggleShare:
                                cellBuilding.is_alliance_shared !==
                                shareCellsCheckbox.checked,
                            tax,
                        }),
                });
            }
        });
    };

    const [ownCellsForm, ownCellsListWrapper] = createTabPaneContent(
        'Passend eingestellte Gebäude: %s',
        'Falsch eingestellte Gebäude: %s',
        [shareCellsLabel, ownCellsTaxGroup],
        (correctList, wrongList) =>
            createCellsLists(
                cache.buildings,
                parseInt(ownCellsTaxGroup.dataset.value),
                correctList,
                wrongList
            ),
        [reGetBuildings]
    );

    ownCellsPane.append(ownCellsForm, ownCellsListWrapper);

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

        const allianceCellsTaxGroup = createTaxGroup('allianceCellsTax');
        const [allianceCellsForm, allianceCellsListWrapper] =
            createTabPaneContent(
                'Passend eingestellte Gebäude: %s',
                'Falsch eingestellte Gebäude: %s',
                [allianceCellsTaxGroup],
                (correctList, wrongList) =>
                    createCellsLists(
                        cache.allianceBuildings,
                        parseInt(allianceCellsTaxGroup.dataset.value),
                        correctList,
                        wrongList
                    ),
                [reGetAllianceBuildings]
            );

        allianceCellsPane.append(allianceCellsForm, allianceCellsListWrapper);

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
        createCheckbox('Sprechwünsche automatisch bearbeiten?', 'elw1Enabled');
    elw1EnabledCheckbox.checked = true;
    const { label: elw1OwnLabel, checkbox: elw1OwnCheckbox } = createCheckbox(
        'Nur eigene Krankenhäuser?',
        'elw1Own'
    );
    const { label: elw1ExtensionLabel, checkbox: elw1ExtensionCheckbox } =
        createCheckbox(
            'Nur Krankenhäuser mit passender Erweiterung?',
            'elw1Extension'
        );
    const [elw1TaxSelect] = createSelect(
        'elw1Tax',
        'Maximale Verbandsabgabe',
        new Array(6).fill(1).map((_, i) => ({
            value: (i * 10).toString(),
            text: i ? percent(i / 10) : 'Kostenlos',
        }))
    );
    const [elw1DistanceSelect] = createSelect(
        'elw1Distance',
        'Maximale Entfernung',
        [1, 5, 20, 50, 100, 200].map(i => ({
            value: i.toString(),
            text: `${i}\xa0km`,
        }))
    );
    const [elw1FreeSelect] = createSelect(
        'elw1Free',
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
        (correctList, wrongList) => {
            if (
                elw1EnabledCheckbox.checked &&
                (elw1TaxSelect.value === '-1' ||
                    elw1DistanceSelect.value === '-1' ||
                    elw1FreeSelect.value === '-1')
            ) {
                return elw1ListWrapper.after(selectionHint);
            }
            selectionHint.remove();

            const elw1Vehicles = cache.vehicles.filter(
                ({ vehicle_type }) => vehicle_type === 59
            );

            elw1Vehicles.forEach(vehicle => {
                const link = createLink(
                    `/vehicles/${vehicle.id}`,
                    vehicle.caption
                );

                const item = addListGroupItem(
                    wrongList,
                    link,
                    ': ➡️ ',
                    [
                        elw1EnabledCheckbox,
                        elw1OwnCheckbox,
                        elw1ExtensionCheckbox,
                    ]
                        .map(c => (c.checked ? '✅' : '❌'))
                        .join(''),
                    ` ${elw1TaxSelect.value}\xa0%; ${elw1DistanceSelect.value}\xa0km; ${elw1FreeSelect.value}\xa0Plätze`
                );

                currentWrongList.set(vehicle.id, {
                    ...item,
                    updateFn: () =>
                        editVehicle(vehicle.id, {
                            'vehicle[hospital_automatic]': Number(
                                elw1EnabledCheckbox.checked
                            ),
                            'vehicle[hospital_own]': Number(
                                elw1OwnCheckbox.checked
                            ),
                            'vehicle[hospital_right_building_extension]':
                                Number(elw1ExtensionCheckbox.checked),
                            'vehicle[hospital_max_price]': Number(
                                elw1TaxSelect.value
                            ),
                            'vehicle[hospital_max_distance]': Number(
                                elw1DistanceSelect.value
                            ),
                            'vehicle[hospital_free_space]': Number(
                                elw1FreeSelect.value
                            ),
                        }),
                });
            });
        },
        [reGetVehicles]
    );

    elw1TabPane.append(
        elw1Form,
        'Leider ist aktuell nicht feststellbar, welche Fahrzeuge neu konfiguriert werden müssen, daher werden alle Fahrzeuge konfiguriert und unter falsch gelistet.',
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
        createCheckbox(
            'Sprechwünsche automatisch bearbeiten?',
            'fustwDglEnabled'
        );
    fustwDglEnabledCheckbox.checked = true;
    const { label: fustwDglOwnLabel, checkbox: fustwDglOwnCheckbox } =
        createCheckbox('Nur eigene Zellen?', 'fustwDglOwn');
    const [fustwDglTaxSelect] = createSelect(
        'fustwDglTax',
        'Maximale Verbandsabgabe',
        new Array(6).fill(1).map((_, i) => ({
            value: (i * 10).toString(),
            text: i ? percent(i / 10) : 'Kostenlos',
        }))
    );
    const [fustwDglDistanceSelect] = createSelect(
        'fustwDglDistance',
        'Maximale Entfernung',
        [1, 5, 20, 50, 100, 200].map(i => ({
            value: i.toString(),
            text: `${i}\xa0km`,
        }))
    );
    const [fustwDglFreeSelect] = createSelect(
        'fustwDglFree',
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
        (correctList, wrongList) => {
            if (
                fustwDglEnabledCheckbox.checked &&
                (fustwDglTaxSelect.value === '-1' ||
                    fustwDglDistanceSelect.value === '-1' ||
                    fustwDglFreeSelect.value === '-1')
            ) {
                return fustwDglListWrapper.after(selectionHint);
            }
            selectionHint.remove();

            const fustwDglVehicles = cache.vehicles.filter(
                ({ vehicle_type }) => vehicle_type === 103
            );

            fustwDglVehicles.forEach(vehicle => {
                const link = createLink(
                    `/vehicles/${vehicle.id}`,
                    vehicle.caption
                );

                const item = addListGroupItem(
                    wrongList,
                    link,
                    ': ➡️ ',
                    [fustwDglEnabledCheckbox, fustwDglOwnCheckbox]
                        .map(c => (c.checked ? '✅' : '❌'))
                        .join(''),
                    ` ${fustwDglTaxSelect.value}\xa0%; ${fustwDglDistanceSelect.value}\xa0km; ${fustwDglFreeSelect.value}\xa0Plätze; `,
                    fustwDglDelay.value === '' ?
                        'Standard-Verzögerung'
                    :   `${fustwDglDelay.value}\xa0min`
                );

                currentWrongList.set(vehicle.id, {
                    ...item,
                    updateFn: () =>
                        editVehicle(vehicle.id, {
                            'vehicle[vehicle_extra_information_attributes][police_cell_automatic]':
                                Number(fustwDglEnabledCheckbox.checked),
                            'vehicle[vehicle_extra_information_attributes][police_cell_own]':
                                Number(fustwDglOwnCheckbox.checked),
                            'vehicle[vehicle_extra_information_attributes][police_cell_max_price]':
                                Number(fustwDglTaxSelect.value),
                            'vehicle[vehicle_extra_information_attributes][police_cell_max_distance]':
                                Number(fustwDglDistanceSelect.value),
                            'vehicle[vehicle_extra_information_attributes][police_cell_free_space]':
                                Number(fustwDglFreeSelect.value),
                            'vehicle[prisoner_transportation_delay]': Number(
                                fustwDglDelay.value
                            ),
                        }),
                });
            });
        },
        [reGetVehicles]
    );

    fustwTabPane.append(
        fustwDglForm,
        'Leider ist aktuell nicht feststellbar, welche Fahrzeuge neu konfiguriert werden müssen, daher werden alle Fahrzeuge konfiguriert und unter falsch gelistet.',
        fustwDglListWrapper
    );
    tabContent.append(fustwTabPane);
    // endregion

    // region GRTW
    const { tab: grtwTab, tabPane: grtwTabPane } = createTab('GRTW', 'grtw');
    tabList.append(grtwTab);

    const grtwModes = {
        0: 'Max. 7 leichtverletzte Patienten',
        1: 'Max. 3 Patienten (auch Schwerverletzte), Notarzt als Besatzung nötig',
    };

    const [grtwModeSelect] = createSelect('grtwMode', 'Modus auswählen', [
        {
            value: 0,
            text: grtwModes[0],
        },
        {
            value: 1,
            text: grtwModes[1],
        },
    ]);

    const [grtwForm, grtwListWrapper] = createTabPaneContent(
        'Korrekt konfigurierte GRTW: %s Fahrzeuge',
        'Falsch konfigurierte GRTW: %s Fahrzeuge',
        [grtwModeSelect],
        (correctList, wrongList) => {
            if (grtwModeSelect.value === '-1') {
                return grtwModeSelect.after(selectionHint);
            }
            selectionHint.remove();

            const grtwVehicles = cache.vehicles.filter(
                ({ vehicle_type }) => vehicle_type === 73
            );

            grtwVehicles.forEach(vehicle => {
                const link = createLink(
                    `/vehicles/${vehicle.id}`,
                    vehicle.caption
                );

                const item = addListGroupItem(
                    wrongList,
                    link,
                    ': ➡️ ',
                    grtwModes[grtwModeSelect.value]
                );

                currentWrongList.set(vehicle.id, {
                    ...item,
                    updateFn: () =>
                        editVehicle(vehicle.id, {
                            'vehicle[vehicle_mode]': Number(
                                grtwModeSelect.value
                            ),
                        }),
                });
            });
        },
        [reGetVehicles]
    );

    grtwTabPane.append(
        grtwForm,
        'Leider ist aktuell nicht feststellbar, welche Fahrzeuge neu konfiguriert werden müssen, daher werden alle Fahrzeuge konfiguriert und unter falsch gelistet.',
        grtwListWrapper
    );
    tabContent.append(grtwTabPane);
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
        '',
        'Anhänger auswählen',
        trailers.map(v => ({
            value: v,
            text: vehicleTypes[v].caption,
        }))
    );

    const { label: randomTowingLabel, checkbox: randomTowingCheckbox } =
        createCheckbox('Zufälliges Zugfahrzeug?', 'randomTowing');
    randomTowingCheckbox.addEventListener('change', () => {
        towingSelect.disabled = randomTowingCheckbox.checked;
    });

    const [towingSelect, towingOption] = createSelect(
        '',
        'Zugfahrzeug auswählen'
    );
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
                return towingListWrapper.after(selectionHint);
            }
            selectionHint.remove();

            const trailers = cache.vehicles.filter(
                ({ vehicle_type }) =>
                    vehicle_type === Number(trailerSelect.value)
            );
            usedTowingVehicles.clear();
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
                    :   !vehicle.tractive_random &&
                        vehicle.tractive_vehicle_id === towingVehicle?.id;
                const targetContent =
                    randomTowingCheckbox.checked ? '🎲' : (
                        createLink(
                            `/vehicles/${towingVehicle?.id}`,
                            towingVehicle?.caption
                        )
                    );
                const currentContent =
                    vehicle.tractive_random ? '🎲' : (
                        createLink(
                            `/vehicles/${vehicle.tractive_vehicle_id}`,
                            cache.vehicles.find(
                                ({ id }) => id === vehicle.tractive_vehicle_id
                            )?.caption
                        )
                    );

                const incorrectButNoTowing =
                    !randomTowingCheckbox.checked &&
                    !isCorrect &&
                    !towingVehicle;

                const item = addListGroupItem(
                    isCorrect ? correctList : wrongList,
                    link,
                    ': ',
                    ...(isCorrect ? [] : [currentContent, ' ➡️ ']),
                    incorrectButNoTowing ?
                        '⚠️ Kein passendes Zugfahrzeug gefunden!'
                    :   targetContent
                );

                if (!isCorrect && !incorrectButNoTowing) {
                    const data = {
                        'vehicle[tractive_random]': Number(
                            randomTowingCheckbox.checked
                        ),
                    };
                    if (towingVehicle) {
                        data['vehicle[tractive_vehicle_id]'] = towingVehicle.id;
                    }
                    currentWrongList.set(vehicle.id, {
                        ...item,
                        updateFn: () => editVehicle(vehicle.id, data),
                    });
                } else if (!isCorrect && incorrectButNoTowing) {
                    item.badge.textContent = '❌';
                    item.badge.classList.remove('hidden');
                    item.item.classList.add('list-group-item-danger');
                }
            });
        },
        [reGetVehicles]
    );

    towingTabPane.append(
        towingForm,
        'Die Zugfahrzeugerkennung arbeitet aktuell sehr primitiv und arbeitet größtenteils mit den Namen und vergleicht, ob Anhänger & Zugfahrzeug auf die gleiche (römische oder arabische) Zahl enden. Wenn nein, wird stattdessen das erste Fahrzeug des Types, welches noch nicht verwendet wurde, auf dieser Wache gewählt.',
        towingListWrapper
    );
    // endregion

    const reloadHint = document.createElement('li');
    reloadHint.style.setProperty('padding', '10px');
    reloadHint.textContent =
        'Wenn Werte offensichtlich falsch sind, kann es helfen, das Spiel einmal neu zu laden.';
    tabList.append(reloadHint);
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
