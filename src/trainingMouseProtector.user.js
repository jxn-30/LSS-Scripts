// ==UserScript==
// @name            [LSS] Training Mouse Protector
// @name:de         [LSS] Ausbildungs-Mausschoner
// @namespace       https://jxn.lss-manager.de
// @version         2024.07.13+2114
// @author          Jan (jxn_30)
// @description     Protects your mouse by reducing the amount of unnecessary clicks to train much staff.
// @description:de  Schützt deine Maus, indem die Anzahl der unnötigen Klicks reduziert wird, um viel Personal auszubilden.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/trainingMouseProtector.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/trainingMouseProtector.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/25707-script-ausbildungs-mausschoner-endlich-machen-massen-ausbildungen-wieder-spa%C3%9F/
// @match           https://www.operacni-stredisko.cz/buildings/*
// @match           https://policie.operacni-stredisko.cz/buildings/*
// @match           https://www.alarmcentral-spil.dk/buildings/*
// @match           https://politi.alarmcentral-spil.dk/buildings/*
// @match           https://www.leitstellenspiel.de/buildings/*
// @match           https://polizei.leitstellenspiel.de/buildings/*
// @match           https://www.missionchief-australia.com/buildings/*
// @match           https://police.missionchief-australia.com/buildings/*
// @match           https://www.missionchief.co.uk/buildings/*
// @match           https://police.missionchief.co.uk/buildings/*
// @match           https://www.missionchief.com/buildings/*
// @match           https://police.missionchief.com/buildings/*
// @match           https://www.centro-de-mando.es/buildings/*
// @match           https://www.centro-de-mando.mx/buildings/*
// @match           https://www.hatakeskuspeli.com/buildings/*
// @match           https://poliisi.hatakeskuspeli.com/buildings/*
// @match           https://www.operateur112.fr/buildings/*
// @match           https://police.operateur112.fr/buildings/*
// @match           https://www.operatore112.it/buildings/*
// @match           https://polizia.operatore112.it/buildings/*
// @match           https://www.missionchief-japan.com/buildings/*
// @match           https://www.missionchief-korea.com/buildings/*
// @match           https://www.nodsentralspillet.com/buildings/*
// @match           https://politiet.nodsentralspillet.com/buildings/*
// @match           https://www.meldkamerspel.com/buildings/*
// @match           https://politie.meldkamerspel.com/buildings/*
// @match           https://www.operatorratunkowy.pl/buildings/*
// @match           https://policja.operatorratunkowy.pl/buildings/*
// @match           https://www.operador193.com/buildings/*
// @match           https://www.jogo-operador112.com/buildings/*
// @match           https://policia.jogo-operador112.com/buildings/*
// @match           https://www.jocdispecerat112.com/buildings/*
// @match           https://www.dispetcher112.ru/buildings/*
// @match           https://www.dispecerske-centrum.com/buildings/*
// @match           https://www.larmcentralen-spelet.se/buildings/*
// @match           https://polis.larmcentralen-spelet.se/buildings/*
// @match           https://www.112-merkez.com/buildings/*
// @match           https://www.dyspetcher101-game.com/buildings/*
// @run-at          document-idle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name Training Mouse Protector
 * @name:de Ausbildungs-Mausschoner
 * @description Protects your mouse by reducing the amount of unnecessary clicks to train much staff.
 * @description:de Schützt deine Maus, indem die Anzahl der unnötigen Klicks reduziert wird, um viel Personal auszubilden.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/25707-script-ausbildungs-mausschoner-endlich-machen-massen-ausbildungen-wieder-spa%C3%9F/
 * @match /buildings/*
 * @grant GM_getValue
 * @grant GM_setValue
 * @grant GM_addStyle
 * @grant unsafeWindow
 */

/* global $ */

// EINSTELLUNG: Soll ein Bestätigungsdialog vor dem Ausbilden angezeigt werden?
const SETTING_SHOW_CONFIRM_DIALOG = true; // true: Bestätigungsdialog vor dem Ausbilden anzeigen.
//                                           false: Keinen Bestätigungsdialog anzeigen, sondern direkt ausbilden.
// ENDE DER EINSTELLUNGEN! DA DRUNTER LIEBER NICHTS ÄNDERN!

const isAllianceSchool =
    document.querySelector('dl > dd > a[href^="/alliances/"]') !== null;
const buildingType = parseInt(
    document.querySelector('h1').getAttribute('building_type') ?? '-1'
);
const schoolBuildingId = parseInt(
    unsafeWindow.location.pathname.split('/')[2] ?? '-1'
);
const form = document.querySelector('form[action$="/education"]');

/** @type {HTMLSelectElement} */
const roomsSelection =
    document.querySelector('#building_rooms_use') ??
    document.createElement('select');

if (!roomsSelection.id) {
    roomsSelection.addEventListener(
        'change',
        unsafeWindow.update_personnel_counter_navbar
    );
}

roomsSelection.id ||= 'building_rooms_use';
roomsSelection.name ||= 'building_rooms_use';

// disable selection and show spinner until total available rooms are calculated
roomsSelection.disabled = true;
const spinner = document.createElement('img');
spinner.src = '/images/ajax-loader.gif';
spinner.style.setProperty('height', '1lh');

// checkbox to (dis-)allow opening empty schools
const allowEmptyLabel = document.createElement('label');
allowEmptyLabel.textContent = '\xa0Leere Klassenzimmer öffnen?';
const allowEmptyCheckbox = document.createElement('input');
allowEmptyCheckbox.type = 'checkbox';
allowEmptyCheckbox.id = allowEmptyLabel.htmlFor = 'allow_empty_schools';
allowEmptyCheckbox.dataset.storageKey = 'allowEmptySchools';
allowEmptyCheckbox.checked = GM_getValue(
    allowEmptyCheckbox.dataset.storageKey,
    false
);
allowEmptyCheckbox.addEventListener('change', () =>
    GM_setValue(
        allowEmptyCheckbox.dataset.storageKey,
        allowEmptyCheckbox.checked
    )
);
allowEmptyLabel.prepend(allowEmptyCheckbox);

// checkbox to toggle whether only specific schools should be used
const useSpecificSchoolsLabel = document.createElement('label');
useSpecificSchoolsLabel.textContent = '\xa0Nur spezielle Schulen nutzen?';
const useSpecificSchoolsCheckbox = document.createElement('input');
useSpecificSchoolsCheckbox.type = 'checkbox';
useSpecificSchoolsCheckbox.id = useSpecificSchoolsLabel.htmlFor =
    'use_specific_schools';
useSpecificSchoolsCheckbox.dataset.storageKey = 'useSpecificSchools';
useSpecificSchoolsCheckbox.checked = GM_getValue(
    useSpecificSchoolsCheckbox.dataset.storageKey,
    false
);
useSpecificSchoolsCheckbox.addEventListener('change', () =>
    GM_setValue(
        useSpecificSchoolsCheckbox.dataset.storageKey,
        useSpecificSchoolsCheckbox.checked
    )
);
useSpecificSchoolsLabel.prepend(useSpecificSchoolsCheckbox);

GM_addStyle(`
label:has(#${useSpecificSchoolsCheckbox.id}:not(:checked)) + select[multiple],
label:has(#${useSpecificSchoolsCheckbox.id}:not(:checked)) + select[multiple] + .help-block {
    display: none;
}`);

const specificSchoolSelection = document.createElement('select');
specificSchoolSelection.classList.add('form-control');
specificSchoolSelection.multiple = true;
specificSchoolSelection.size = 7;

const specificSchoolsHelp = document.createElement('p');
specificSchoolsHelp.classList.add('help-block');
specificSchoolsHelp.textContent =
    'Durch das Drücken von Strg können mehrere Schulen einzeln ausgewählt werden.';

form.querySelector(':scope > h3')?.before(roomsSelection);
roomsSelection.after(
    spinner,
    document.createElement('br'),
    allowEmptyLabel,
    ' | ',
    useSpecificSchoolsLabel,
    specificSchoolSelection,
    specificSchoolsHelp
);

// create a label if none exists
if (roomsSelection.labels.length === 0) {
    const label = document.createElement('label');
    label.htmlFor = roomsSelection.id;
    label.textContent =
        'Wie viele Räume sollen für diese Ausbildung genutzt werden?\xa0';
    roomsSelection.before(label);
}

/** @type {Set<{select: HTMLSelectElement, input: HTMLInputElement}>} */
const schoolingRoomSelections = new Set();

const roomsSelectionClass = 'jxn-training_mouse_protector-rooms_use';
const lastShownOptionClass = 'jxn-training_mouse_protector-last_shown';

const selectStyle = document.createElement('style');
form?.append(selectStyle);

const updateSelectStyle = () => {
    roomsSelection.disabled = allowEmptyCheckbox.checked;

    const remainingRooms =
        parseInt(roomsSelection.lastElementChild.value) -
        Array.from(schoolingRoomSelections.values()).reduce(
            (acc, { select }) => acc + parseInt(select.value),
            0
        );

    form?.querySelectorAll(
        `.${roomsSelectionClass} .${lastShownOptionClass}`
    ).forEach(option => option.classList.remove(lastShownOptionClass));

    schoolingRoomSelections.forEach(({ select }) => {
        select.disabled = !allowEmptyCheckbox.checked;
        const current = parseInt(select.value);
        select
            .querySelector(
                `option[value="${Math.max(remainingRooms + current, current)}"]`
            )
            ?.classList.add(lastShownOptionClass);
    });

    selectStyle.textContent = `
.${roomsSelectionClass} .${lastShownOptionClass} ~ option {
    display: none;
    pointer-events: none;
}

body:has(#${allowEmptyCheckbox.id}:checked) #accordion > .panel {
    opacity: 0.5;
    pointer-events: none;
}
`.trim();
};

form?.querySelectorAll('label[for^="education_"]').forEach(label => {
    /** @type {HTMLInputElement} */
    const input = document.getElementById(label.htmlFor);
    const select = document.createElement('select');
    select.disabled = true;
    select.classList.add(roomsSelectionClass);
    label.after(select);

    select.addEventListener('change', updateSelectStyle);

    schoolingRoomSelections.add({ select, input });
});

roomsSelection.addEventListener('change', updateSelectStyle);
allowEmptyCheckbox.addEventListener('change', updateSelectStyle);

/**
 * @typedef {Object} Schooling
 * @property {number} id
 * @property {number} education_id
 * @property {string} education
 * @property {string} education_start_time
 * @property {string} education_end_time
 */

/**
 * @typedef {Object} BuildingExtension
 * @property {string} caption
 * @property {boolean} available
 * @property {boolean} enabled
 * @property {number} type_id
 */

/**
 * @typedef {Object} Building
 * @property {number} id
 * @property {string} caption
 * @property {number} building_type
 * @property {number} personal_count
 * @property {Schooling[]} [schoolings]
 * @property {BuildingExtension[]} [extensions]
 */

/**
 * @typedef {Object} BuildingType
 * @property {string} caption
 * @property {number[]} [schools]
 */

/**
 * @param {Building} school
 * @returns {number}
 */
const getFreeRooms = school => {
    const total =
        1 + school.extensions?.filter(e => e.available && e.enabled).length;
    return total - (school.schoolings?.length ?? 0);
};

/**
 * @param {Building[]} schools
 */
const getUsableSchools = schools => {
    if (!useSpecificSchoolsCheckbox.checked) return schools;
    const selectedSchools = Array.from(
        specificSchoolSelection.selectedOptions
    ).map(option => option.value);
    return schools.filter(({ id }) => selectedSchools.includes(id.toString()));
};

/**
 * @param {Building[]} schools
 */
const setRoomSelection = schools => {
    const filteredSchools = getUsableSchools(schools);

    const totalFreeRooms = filteredSchools.reduce(
        (acc, school) => acc + getFreeRooms(school),
        0
    );

    // fill rooms selection with available rooms
    roomsSelection.replaceChildren();

    const zeroOption = document.createElement('option');
    zeroOption.value = '0';
    zeroOption.textContent = '0';
    schoolingRoomSelections.forEach(({ select }) =>
        select.replaceChildren(zeroOption.cloneNode(true))
    );

    for (let i = 1; i <= totalFreeRooms; i++) {
        const option = document.createElement('option');
        option.value = i.toString();
        option.textContent = i.toString();
        roomsSelection.append(option);
        schoolingRoomSelections.forEach(({ select }) =>
            select.append(option.cloneNode(true))
        );
    }

    roomsSelection.dispatchEvent(new InputEvent('change'));
};

const getTrainingDuration = () =>
    parseInt(
        document
            .querySelector(`label[for="education_${form.education.value}"]`)
            ?.textContent?.trim()
            .match(/(?<=\()\d+(?=[^)]*\)$)/u)?.[0] ?? '0'
    );

const confirmDialogId = 'jxn-training_mouse-protector_confirm-dialog';

// remove modal style added by Traxx
GM_addStyle(`
#${confirmDialogId} {
    position: fixed;
    padding-top: 0;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;
    z-index: 1050;
}
#${confirmDialogId} .modal-dialog {
    max-width: 500px;
}
#${confirmDialogId} .modal-body {
    height: unset;
    overflow-y: unset;
}

#${confirmDialogId} u {
    text-decoration-color: #aaa;
}

#${confirmDialogId} .buttons {
    text-align: center;
    margin: -15px;
    margin-top: 15px;
    border-top: 1px solid;
}

#${confirmDialogId} .buttons > a {
    width: 50%;
    display: inline-block;
    color: inherit;
    cursor: pointer;
    padding: 15px;
}

#${confirmDialogId} .buttons > a:hover {
    background-color: #aaa;
    text-decoration: none;
}

#${confirmDialogId} .buttons > a:not(:last-child) {
    border-right: 1px solid;
}
`);

/**
 * @param {string} educationName
 * @param {number} staffAmount
 * @param {number} schoolsAmount
 * @param {number} duration
 * @param {number} emptyRooms
 * @param {number} emptySchools
 * @param {number} pricePerSeatPerDay
 * @param {string} openDuration
 * @returns {Promise<boolean>}
 */
const confirmDialog = (
    educationName,
    staffAmount,
    schoolsAmount,
    duration,
    emptyRooms,
    emptySchools,
    pricePerSeatPerDay,
    openDuration
) => {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = confirmDialogId;

    const dialog = document.createElement('div');
    dialog.classList.add('modal-dialog');
    dialog.style.setProperty('width', 'fit-content');

    const content = document.createElement('div');
    content.classList.add('modal-content');

    const body = document.createElement('div');
    body.classList.add('modal-body');
    body.style.setProperty('overflow', 'auto');
    body.style.setProperty('box-sizing', 'content-box');

    /**
     * @param {number} num
     * @returns {string}
     */
    const str = num => num.toLocaleString('de');

    const trainingP = document.createElement('p');
    trainingP.innerHTML = `Ausbildung: <b>${educationName}</b>`;
    body.append(trainingP);

    if (staffAmount) {
        const staffAmountP = document.createElement('p');
        staffAmountP.innerHTML = `Es werden <b>${str(staffAmount)}&nbsp;Personen</b> in <b>${str(Math.ceil(staffAmount / 10))}&nbsp;Zimmern</b> (<b>${str(schoolsAmount)}&nbsp;Schulen</b>) ausgebildet.`; // <br/>Die Ausbildung dauert <b>${duration}&nbsp;Tage</b>.
        if (pricePerSeatPerDay && isAllianceSchool) {
            staffAmountP.innerHTML += `<br/>Die Kosten betragen <b>${str(pricePerSeatPerDay)}&nbsp;*&nbsp;${str(staffAmount)}&nbsp;*&nbsp;${duration}&nbsp;=&nbsp;<u>${str(pricePerSeatPerDay * staffAmount * duration)}&nbsp;Credits</u></b>.`;
        }
        body.append(staffAmountP);
    }
    if (emptyRooms) {
        const emptyRoomsP = document.createElement('p');
        emptyRoomsP.innerHTML = `Es werden <b>${str(emptyRooms)}&nbsp;leere&nbsp;Zimmer</b> in <b>${str(emptySchools)}&nbsp;Schulen</b> zum Preis von <b>${str(pricePerSeatPerDay)}&nbsp;Credits</b> pro Person pro Tag für die Dauer von <b>${openDuration}</b> im Verband freigegeben.`;
        body.append(emptyRoomsP);
    }

    const buttons = document.createElement('div');
    buttons.classList.add('buttons');
    const abortBtn = document.createElement('a');
    abortBtn.href = '#';
    abortBtn.textContent = 'Abbrechen';
    const confirmBtn = document.createElement('a');
    confirmBtn.textContent = 'Fortfahren';

    buttons.append(abortBtn, confirmBtn);
    body.append(buttons);
    content.append(body);
    dialog.append(content);
    modal.append(dialog);
    document.body.append(modal);

    modal.classList.add('in');
    modal.style.setProperty('display', 'block');

    return new Promise(resolve => {
        abortBtn.addEventListener('click', event => {
            event.preventDefault();
            modal.remove();
            resolve(false);
        });
        confirmBtn.addEventListener('click', event => {
            event.preventDefault();
            modal.remove();
            resolve(true);
        });
    });
};

let abortedDueToMultipleSchools = false;
const multipleSchoolsAlert = `
⚠️🚨 𝐀𝐜𝐡𝐭𝐮𝐧𝐠 𝐀𝐜𝐡𝐭𝐮𝐧𝐠. 𝐄𝐢𝐧𝐞 𝐰𝐢𝐜𝐡𝐭𝐢𝐠𝐞 𝐃𝐮𝐫𝐜𝐡𝐬𝐚𝐠𝐞! 🚨⚠️

Das Script "Ausbildungs-Mausschoner" ist NICHT mit dem Script "MultipleSchools" von Allure149 kompatibel. Bitte deaktiviere das Script "MultipleSchools", um dieses Script hier verwenden zu können.

Andernfalls kann es zu unerwartetem Verhalten kommen, für dieses übernimmt der Autor dieses Scriptes keine Haftung.

Viele Grüße
Euer Tutorial-Polizist mit dem langen Zeigefinger! 👮👆
`.trim();

const checkMultipleSchools = setInterval(() => {
    if (document.querySelector('#multipleClassesSelect')) {
        const pre = document.createElement('pre');
        pre.textContent = multipleSchoolsAlert;
        document.querySelector('#schooling')?.prepend(pre);
        alert(multipleSchoolsAlert);
        abortedDueToMultipleSchools = true;
        clearInterval(checkMultipleSchools);
    }
}, 1000);

new Promise((resolve, reject) => {
    // only continue if we're in a school and the school has free classrooms
    if (form) resolve();
    else reject();
})
    .then(() =>
        Promise.all([
            // fetch building types from LSSM API
            fetch(`https://api.lss-manager.de/de_DE/buildings`).then(res =>
                res.json()
            ),
            // fetch buildings from Game API
            ...(isAllianceSchool ?
                [
                    fetch('/api/alliance_buildings').then(res => res.json()),
                    fetch('/api/buildings').then(res => res.json()),
                ]
            :   [fetch('/api/buildings').then(res => res.json())]),
        ])
    )
    .then(
        ([
            buildingTypes,
            ownOrAllianceBuildings,
            buildings = ownOrAllianceBuildings,
        ]) => ({
            /** @type {Building[]} */
            buildings,
            /** @type {Building[]} */
            schools: ownOrAllianceBuildings
                .filter(b => b.building_type === buildingType)
                .toSorted((a, b) => a.id - b.id),
            /** @type {Record<number, BuildingType>} */
            buildingTypes,
        })
    )
    .then(({ buildings, schools, buildingTypes }) => {
        setRoomSelection(schools);

        // fill specific school selection with available schools
        specificSchoolSelection.replaceChildren();
        schools.forEach(school => {
            const freeRooms = getFreeRooms(school);
            if (!freeRooms) return;
            const option = document.createElement('option');
            option.value = school.id.toString();
            option.textContent = `${school.caption} (${freeRooms} Zimmer frei)`;
            specificSchoolSelection.append(option);
        });

        useSpecificSchoolsCheckbox.addEventListener('change', () =>
            setRoomSelection(schools)
        );

        let updateTimeout;
        specificSchoolSelection.addEventListener('change', () => {
            if (updateTimeout) clearTimeout(updateTimeout);
            setTimeout(() => setRoomSelection(schools), 500);
        });

        return { buildings, buildingTypes, schools };
    })
    .then(({ buildings, buildingTypes, schools }) => {
        // building and staff selection already exists -> no need to manually add it
        if (document.querySelector('.personal-select-heading')) return schools;

        unsafeWindow.loadedBuildings = [];

        const validBuildingTypeIds = Object.keys(buildingTypes)
            .filter(type =>
                buildingTypes[type]?.schools?.includes(buildingType)
            )
            .map(type => parseInt(type));

        // create the field where buildings are put into
        const staffSelectHeading = document.createElement('h3');
        staffSelectHeading.textContent = 'Personal auswählen';
        const accordion = document.createElement('div');
        accordion.id = 'accordion';
        buildings
            .filter(({ building_type }) =>
                validBuildingTypeIds.includes(building_type)
            )
            .toSorted((a, b) => a.caption.localeCompare(b.caption))
            .forEach(building => {
                const buildingDiv = document.createElement('div');
                buildingDiv.classList.add('panel', 'panel-default');

                const heading = document.createElement('div');
                heading.classList.add(
                    'panel-heading',
                    'personal-select-heading'
                );
                heading.setAttribute('building_id', building.id.toString());
                heading.setAttribute(
                    'href',
                    `/buildings/${building.id}/schooling_personal_select`
                );
                heading.textContent = building.caption;
                const headingRight = document.createElement('div');
                headingRight.classList.add('pull-right');
                const selectSpan = document.createElement('span');
                selectSpan.id = `personal-select-heading-building-${building.id}`;
                selectSpan.classList.add('personal-select-heading-building');
                selectSpan.setAttribute('building_id', building.id.toString());
                const currentLabel = document.createElement('span');
                currentLabel.classList.add('label', 'label-default');
                currentLabel.textContent = `${building.personal_count}\xa0Angestellte`;

                const body = document.createElement('div');
                body.classList.add('panel-body', 'hidden');
                body.setAttribute('building_id', building.id.toString());
                const loadingImg = document.createElement('img');
                loadingImg.classList.add('ajaxLoader');
                loadingImg.src = '/images/ajax-loader.gif';

                headingRight.append(selectSpan, currentLabel);
                heading.append(headingRight);
                body.append(loadingImg);
                buildingDiv.append(heading, body);
                accordion.append(buildingDiv);
            });

        document
            .querySelector('#alliance_cost')
            ?.after(staffSelectHeading, accordion);

        const educationCosts = document.createElement('span');
        educationCosts.classList.add('label', 'label-success');
        educationCosts.textContent = '0\xa0Credits';
        document
            .querySelector('#schooling_free')
            ?.after(' Gesamtkosten:\xa0', educationCosts);

        // add functions to imitate the behaviour of own schools
        // fetch amount of educated staff
        let scrollTimeout;
        const loadVisibleEducatedCounters = () =>
            document
                .querySelectorAll(
                    '.personal-select-heading-building:not([data-education-loaded])'
                )
                .forEach(building => {
                    const rect = building.getBoundingClientRect();
                    // this building is not visible => do not load it
                    if (
                        rect.top <= 0 ||
                        rect.bottom >=
                            (unsafeWindow.innerHeight ||
                                document.documentElement.clientHeight)
                    ) {
                        return;
                    }
                    const buildingId = building.getAttribute('building_id');
                    fetch(
                        `/buildings/${schoolBuildingId}/schoolingEducationCheck?education=${form.education.value}&only_building_id=${buildingId}`
                    )
                        .then(res =>
                            res.ok ? res.text() : Promise.reject(res)
                        )
                        .then(res => {
                            building.dataset.educationLoaded = 'true';
                            // the game uses eval and sends JS as response text 🥴
                            // eslint-disable-next-line no-eval
                            eval(res);
                        })
                        .catch(console.error);
                });
        const scrollEvent = () => {
            // if no education is selected, abort
            if (!form.education.value) return;
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(loadVisibleEducatedCounters, 100);
        };
        document
            .querySelector('#iframe-inside-container')
            ?.addEventListener('scroll', scrollEvent);
        unsafeWindow.addEventListener('scroll', scrollEvent);

        // create the `schooling_disable` function
        unsafeWindow.schooling_disable ??= educationKey => {
            document
                .querySelectorAll('.schooling_checkbox:disabled')
                .forEach(checkbox => (checkbox.disabled = false));

            document
                .querySelectorAll(`.schooling_checkbox[${educationKey}="true"]`)
                .forEach(checkbox => {
                    checkbox.checked = false;
                    checkbox.disabled = true;
                });
        };
        // create the `schooling_check_educated_counter` function
        unsafeWindow.schooling_check_educated_counter ??= () => {
            document
                .querySelectorAll('.personal-select-heading-building')
                .forEach(span => {
                    span.textContent = 'Lade...';
                    span.classList.remove('label', 'label-success');
                    delete span.dataset.educationLoaded;
                });
            loadVisibleEducatedCounters();
        };
        // create the `free_space_for_personnel_selection` function
        unsafeWindow.free_space_for_personnel_selection ??= () => {
            return 10 * parseInt(roomsSelection.value);
        };
        // create the `is_free_place_available` function
        unsafeWindow.is_free_place_available ??= () =>
            parseInt(
                document.querySelector('#schooling_free')?.textContent ?? '0'
            ) > 0;
        // create the `update_personnel_counter_navbar` function
        unsafeWindow.update_personnel_counter_navbar ??= () => {
            const max = unsafeWindow.free_space_for_personnel_selection();
            const selected = document.querySelectorAll(
                '.schooling_checkbox:checked'
            ).length;
            const free = max - selected;
            const freeSpan = document.querySelector('#schooling_free');
            if (freeSpan) {
                freeSpan.textContent = free.toString();
            }
            const duration = getTrainingDuration();
            educationCosts.textContent = `${(selected * parseInt(form['alliance[cost]'].value ?? '0') * duration).toLocaleString()}\xa0Credits`;
        };
        unsafeWindow.update_personnel_counter_navbar();
        // create the `selectAvailable` function
        unsafeWindow.selectAvailable ??= (buildingId, withoutEducation) => {
            const free = parseInt(
                document.querySelector('#schooling_free')?.textContent ?? '0'
            );
            Array.from(
                document.querySelectorAll(
                    `#personal_table_${buildingId} .schooling_checkbox:not(:disabled):not(:checked)`
                )
            )
                .filter(checkbox => {
                    if (!withoutEducation) return true;
                    return (
                        (document
                            .querySelector(
                                `#school_personal_education_${checkbox.value}`
                            )
                            ?.textContent?.trim() ?? '') === ''
                    );
                })
                .slice(0, free)
                .forEach(checkbox => (checkbox.checked = true));
            unsafeWindow.update_personnel_counter_navbar();
        };
        unsafeWindow.update_schooling_free ??= () => {};
        unsafeWindow.update_costs =
            unsafeWindow.update_personnel_counter_navbar;

        // open a building when clicking on the heading
        document.addEventListener('click', e => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;
            const heading = target.closest('.personal-select-heading');
            if (!heading) return;

            // prevent incompatibility with Lehrgangszuweiser by BOS-Ernie
            if (
                heading.querySelector(
                    '.schooling-personnel-select-button, .schooling-personnel-reset-button'
                )
            ) {
                return;
            }

            const body = heading.nextElementSibling;
            body.classList.toggle('hidden');

            // has not been loaded yet
            if (heading.matches(':has( + .panel-body .ajaxLoader)')) {
                const href = heading.getAttribute('href');
                unsafeWindow.loadedBuildings.push(href);
                fetch(href)
                    .then(res => res.text())
                    .then(html => {
                        // ohhh how secure dear game devs 🎶
                        // we need to use jQuery html here to execute the JS inside
                        $(body).html(html);
                        unsafeWindow.schooling_disable(
                            document
                                .querySelector('input[name=education]:checked')
                                ?.getAttribute('education_key')
                        );
                    });
            }
        });

        // detect clicks on staff selectors
        document.addEventListener('click', e => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;

            const selectAvailable = target.closest(
                '.schooling_select_available'
            );
            const selectAvailableWithoutEducation = target.closest(
                '.schooling_select_available_without_education'
            );
            const btn = selectAvailable || selectAvailableWithoutEducation;
            if (!btn) return;

            e.preventDefault();
            btn.disabled = true;
            unsafeWindow.selectAvailable(
                btn.getAttribute('building_id'),
                !!selectAvailableWithoutEducation
            );
            btn.disabled = false;
        });

        // update the total costs when price per day per staff changes
        document
            .querySelector('#alliance_cost')
            ?.addEventListener('change', unsafeWindow.update_costs);

        document.dispatchEvent(
            new CustomEvent('lehrgangszuweiser:render-personnel-selectors')
        );
        document.dispatchEvent(
            new CustomEvent('ausbildungs-mausschoner:buildings-appended')
        );

        return schools;
    })
    .then(schools => {
        const authToken =
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') ?? '';

        // replace the submit buttons
        // 1. find out which school will be filled with how much staff
        // 2. if own school: send request to create training for each school
        // 3. if alliance school: for each school create trainings and fill them
        const schoolNameMap = new Map();
        const getRooms = () => {
            /** @type {string[][]} */
            const allRooms = [];

            const firstNonEmpty = Array.from(schoolingRoomSelections).find(
                ({ select }) => select.value !== '0'
            );
            if (allowEmptyCheckbox.checked && firstNonEmpty) {
                for (let i = 0; i < parseInt(firstNonEmpty.select.value); i++) {
                    allRooms.push([]);
                }
                firstNonEmpty.input.click();
                form.education.value = firstNonEmpty.input.value;
                return allRooms;
            }

            /** @type {string[]} */
            const allStaff = Array.from(
                document.querySelectorAll('.schooling_checkbox:checked')
            ).map(checkbox => checkbox.value);
            // slice staff into rooms of 10 peeps each
            for (let i = 0; i < allStaff.length; i += 10) {
                allRooms.push(allStaff.slice(i, i + 10));
            }
            return allRooms;
        };
        /**
         * @param {string[][]} rooms
         * @returns {Record<number, string[][]>}
         */
        const assignRoomsToSchools = rooms => {
            const roomsBySchool = {};
            for (const school of getUsableSchools(schools)) {
                schoolNameMap.set(school.id.toString(), school.caption);
                const freeRooms = getFreeRooms(school);
                if (!freeRooms) continue;
                roomsBySchool[school.id] = rooms.splice(0, freeRooms);
                if (!rooms.length) break;
            }
            return roomsBySchool;
        };

        /**
         * @param {number|string} schoolId
         * @param {string[]} staff
         * @param {number} rooms
         * @param {string} education
         * @param {string} duration
         * @param {string} cost
         * @returns {Promise<Response>}
         */
        const openSchool = (
            schoolId,
            staff,
            rooms,
            education,
            duration,
            cost
        ) => {
            const schoolUrl = new URL(
                `/buildings/${schoolId}`,
                unsafeWindow.location.href
            );
            schoolUrl.searchParams.set('utf8', '✓');
            schoolUrl.searchParams.set('authenticity_token', authToken);
            schoolUrl.searchParams.set('education', education);
            schoolUrl.searchParams.set('alliance[duration]', duration);
            schoolUrl.searchParams.set('alliance[cost]', cost);
            schoolUrl.searchParams.set('building_rooms_use', rooms.toString());
            staff.forEach(id =>
                schoolUrl.searchParams.append('personal_ids[]', id)
            );
            schoolUrl.searchParams.set('commit', 'Ausbilden');
            const school = schools.find(
                s => s.id.toString() === schoolId.toString()
            );
            for (let i = 0; i < rooms; i++) school.schoolings.push(undefined);
            return fetch(`/buildings/${schoolId}/education`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                referrer: schoolUrl.href.replace(/\?.*$/, ''),
                body: schoolUrl.search.replace(/^\?/, ''),
                method: 'POST',
                mode: 'cors',
            });
        };

        /**
         * @param {number|string} schoolingId
         * @param {string[]} staff
         * @returns {Promise<Response>}
         */
        const fillRoom = (schoolingId, staff) => {
            const schoolingUrl = new URL(
                `/schoolings/${schoolingId}`,
                unsafeWindow.location.href
            );
            schoolingUrl.searchParams.set('utf8', '✓');
            schoolingUrl.searchParams.set('authenticity_token', authToken);
            staff.forEach(id =>
                schoolingUrl.searchParams.append('personal_ids[]', id)
            );
            schoolingUrl.searchParams.set('commit', 'Ausbilden');
            return fetch(`/schoolings/${schoolingId}/education`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                referrer: schoolingUrl.href.replace(/\?.*$/, ''),
                body: schoolingUrl.search.replace(/^\?/, ''),
                method: 'POST',
                mode: 'cors',
            });
        };

        const reqOr100ms = req =>
            Promise.all([req, new Promise(r => setTimeout(r, 100))]).then(
                ([res]) => res
            );

        const doTheDurchschloedeln = async () => {
            if (abortedDueToMultipleSchools) return alert(multipleSchoolsAlert);

            const roomPlan = assignRoomsToSchools(getRooms());
            const totalSchools = Object.keys(roomPlan).length;
            let totalStaff = 0;
            let filledSchools = 0;
            let emptyRooms = 0;
            let emptySchools = 0;
            for (const rooms of Object.values(roomPlan)) {
                const staff = rooms.flat().length;
                totalStaff += staff;

                if (staff) filledSchools++;

                const emptyRoomsInSchool = rooms.length - Math.ceil(staff / 10);
                emptyRooms += emptyRoomsInSchool;
                if (emptyRoomsInSchool) emptySchools++;
            }

            const education = form.education.value;
            const duration = form['alliance[duration]'].value;
            const cost = form['alliance[cost]'].value;

            if (
                SETTING_SHOW_CONFIRM_DIALOG &&
                !(await confirmDialog(
                    document
                        .querySelector(`label:has([name="education"]:checked)`)
                        ?.textContent?.trim() ?? '',
                    totalStaff,
                    filledSchools,
                    getTrainingDuration(),
                    emptyRooms,
                    emptySchools,
                    parseInt(cost),
                    document
                        .querySelector(
                            `#alliance_duration option[value="${duration}"]`
                        )
                        ?.textContent?.trim() ?? ''
                ))
            ) {
                return;
            }

            // disable all form elements and submission fields to prevent edits and double submissions
            form.querySelectorAll('input, select').forEach(
                input => (input.disabled = true)
            );

            const currentStateSpan = document.createElement('span');
            currentStateSpan.classList.add('label', 'label-warning');
            currentStateSpan.style.setProperty('font-size', '14px');
            currentStateSpan.textContent = `0/${totalSchools.toLocaleString()} Schulen verarbeitet`;
            const progressWrapper = document.createElement('div');
            progressWrapper.classList.add('progress');
            progressWrapper.style.setProperty('margin-bottom', '0');
            progressWrapper.style.setProperty('width', '50%');
            const progressBar = document.createElement('div');
            progressBar.classList.add(
                'progress-bar',
                'progress-bar-striped',
                'active'
            );
            progressBar.style.setProperty('width', '0%');
            progressWrapper.append(progressBar);

            document
                .querySelector(
                    '.navbar.navbar-fixed-bottom div:has(> input[type=submit])'
                )
                .after(currentStateSpan, progressWrapper);

            const start = Date.now();
            let progress = 0;

            const doProgress = schoolId => {
                progress++;

                currentStateSpan.textContent = `${progress.toLocaleString()}/${totalSchools.toLocaleString()} Schulen verarbeitet [${schoolNameMap.get(schoolId)}]`;
                const percentage = progress / totalSchools;
                progressBar.style.setProperty('width', `${percentage * 100}%`);
                const elapsed = Date.now() - start;
                const remaining =
                    (elapsed / progress) * (totalSchools - progress);
                const endDate = new Date(Date.now() + remaining);
                progressBar.textContent = [
                    `${percentage.toLocaleString('de', { style: 'percent' })}`,
                    `${Math.ceil(remaining / 1000).toLocaleString('de')}\xa0s`,
                    `ETA: ${endDate.toLocaleTimeString('de')}`,
                ].join(' / ');
            };

            if (!Object.keys(roomPlan).length) return;
            if (isAllianceSchool) {
                for (const [schoolId, staff] of Object.entries(roomPlan)) {
                    const staffForSchool = staff.flat();
                    /** @type {Response} */
                    const res = await reqOr100ms(
                        openSchool(
                            schoolId,
                            [],
                            staff.length,
                            education,
                            duration,
                            cost
                        )
                    );
                    /** @type {number[]} */
                    const schoolingIds = [];
                    if (res.url.includes('/schoolings/')) {
                        schoolingIds.push(
                            parseInt(new URL(res.url).pathname.split('/')[2])
                        );
                    } else {
                        const schoolDoc = await res
                            .text()
                            .then(html =>
                                new DOMParser().parseFromString(
                                    html,
                                    'text/html'
                                )
                            );
                        schoolingIds.push(
                            ...Array.from(
                                schoolDoc.querySelectorAll(
                                    'td:has(.label-warning) + td[sortvalue="10"] + td span[id^="education_schooling_"]'
                                )
                            )
                                .map(span =>
                                    parseInt(
                                        span.id.split('_').pop()?.toString() ??
                                            '-1'
                                    )
                                )
                                .toSorted((a, b) => b - a)
                        );
                    }
                    let roomNum = 0;

                    for (const room of staff) {
                        roomNum++;
                        if (!room.length) continue;
                        await reqOr100ms(fillRoom(schoolingIds.shift(), room));
                        progressBar.style.setProperty(
                            'width',
                            `${((progress + roomNum / staff.length) / totalSchools) * 100}%`
                        );
                    }
                    doProgress(schoolId, staffForSchool.length);
                }
            } else {
                // this is an own school
                for (const [schoolId, staff] of Object.entries(roomPlan)) {
                    const staffForSchool = staff.flat();
                    await reqOr100ms(
                        openSchool(
                            schoolId,
                            staffForSchool,
                            staff.length,
                            education,
                            duration,
                            cost
                        )
                    );
                    doProgress(schoolId, staffForSchool.length);
                }
            }

            currentStateSpan.classList.replace(
                'label-warning',
                'label-success'
            );
            currentStateSpan.textContent = `${totalSchools.toLocaleString()} Schulen erfolgreich gefüllt! 😊`;

            setTimeout(() => {
                const nonEmpties = Array.from(schoolingRoomSelections).filter(
                    ({ select }) => select.value !== '0'
                );
                const firstEmpty = nonEmpties.shift();
                if (firstEmpty) firstEmpty.select.value = '0';
                if (allowEmptyCheckbox.checked && nonEmpties.length) {
                    currentStateSpan.remove();
                    progressWrapper.remove();
                    doTheDurchschloedeln();
                } else {
                    window.location.reload();
                }
            }, 2000);
        };

        form.addEventListener('submit', async e => {
            e.preventDefault();

            await doTheDurchschloedeln();
        });
    })
    .finally(() => {
        spinner.remove();
        updateSelectStyle();
    });
