// ==UserScript==
// @name            [LSS] Training Mouse Protector
// @name:de         [LSS] Ausbildungs-Mausschoner
// @namespace       https://jxn.lss-manager.de
// @version         2024.03.28+0823
// @author          Jan (jxn_30)
// @description     Protects your mouse by reducing the amount of unnecessary clicks to train much staff.
// @description:de  Schützt deine Maus, indem die Anzahl der unnötigen Klicks reduziert wird, um viel Personal auszubilden.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/trainingMouseProtector.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/trainingMouseProtector.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/25128-script-aao-alle-fahrzeugtypen-ausw%C3%A4hlbar/
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
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name Training Mouse Protector
 * @name:de Ausbildungs-Mausschoner
 * @description Protects your mouse by reducing the amount of unnecessary clicks to train much staff.
 * @description:de Schützt deine Maus, indem die Anzahl der unnötigen Klicks reduziert wird, um viel Personal auszubilden.
 * @// TODO
 * @forum https://forum.leitstellenspiel.de/index.php?thread/25128-script-aao-alle-fahrzeugtypen-ausw%C3%A4hlbar/
 * @match /buildings/*
 * @grant GM_getValue
 * @grant GM_setValue
 * @grant unsafeWindow
 */

/* global $ */

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

const neededToAddOwnRoomsSelection = !roomsSelection.id;

roomsSelection.id ??= 'building_rooms_use';
roomsSelection.name ??= 'building_rooms_use';

// disable selection and show spinner until total available rooms are calculated
roomsSelection.disabled = true;
const spinner = document.createElement('img');
spinner.src = '/images/ajax-loader.gif';
spinner.style.setProperty('height', '1lh');

// checkbox to (dis-)allow opening empty schools
const allowEmptyLabel = document.createElement('label');
allowEmptyLabel.textContent = 'Leere Schulen öffnen?';
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

// TODO: Option to select special schools only

document.querySelector('form > h3')?.before(roomsSelection);
roomsSelection.after(spinner, document.createElement('br'), allowEmptyLabel);

// create a label if none exists
if (roomsSelection.labels.length === 0) {
    const label = document.createElement('label');
    label.htmlFor = roomsSelection.id;
    label.textContent =
        'Wie viele Räume sollen für diese Ausbildung genutzt werden?\xa0';
    roomsSelection.before(label);
}

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
        const totalFreeRooms = schools.reduce(
            (acc, school) => acc + getFreeRooms(school),
            0
        );

        // fill rooms selection with available rooms
        roomsSelection.replaceChildren();
        for (let i = 1; i <= totalFreeRooms; i++) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            roomsSelection.appendChild(option);
        }

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
        document.addEventListener('scrollend', () => {
            // if no education is selected, abort
            if (!form.education.value) return;
            if (scrollTimeout) clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(loadVisibleEducatedCounters, 100);
        });

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
                document.querySelector('#schooling_free').dataset.available ??
                    '0'
            ) > 0;
        // create the `update_personnel_counter_navbar` function
        unsafeWindow.update_personnel_counter_navbar ??= () => {
            const max = unsafeWindow.free_space_for_personnel_selection();
            const free =
                max -
                document.querySelectorAll('.schooling_checkbox:checked').length;
            const freeSpan = document.querySelector('#schooling_free');
            if (freeSpan) {
                freeSpan.textContent = free.toString();
                freeSpan.dataset.available = free.toString();
            }
            const duration = parseInt(
                document
                    .querySelector(
                        `label[for="education_${form.education.value}"]`
                    )
                    ?.textContent?.trim()
                    .match(/(?<=\()\d+(?=[^)]*\)$)/u)?.[0] ?? '0'
            );
            educationCosts.textContent = `${((max - free) * parseInt(form['alliance[cost]'].value ?? '0') * duration).toLocaleString()}\xa0Credits`;
        };
        unsafeWindow.update_personnel_counter_navbar();
        if (neededToAddOwnRoomsSelection) {
            roomsSelection.addEventListener(
                'change',
                unsafeWindow.update_personnel_counter_navbar
            );
        }
        // create the `selectAvailable` function
        unsafeWindow.selectAvailable ??= (buildingId, withoutEducation) => {
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
                .slice(0, unsafeWindow.free_space_for_personnel_selection())
                .forEach(checkbox => (checkbox.checked = true));
            unsafeWindow.update_personnel_counter_navbar();
        };
        unsafeWindow.update_schooling_free ??= () => {};

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
            ?.addEventListener(
                'change',
                window.update_personnel_counter_navbar
            );

        document.dispatchEvent(
            new CustomEvent('lehrgangszuweiser:render-personnel-selectors')
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
            /** @type {string[]} */
            const allStaff = Array.from(
                document.querySelectorAll('.schooling_checkbox:checked')
            ).map(checkbox => checkbox.value);
            // slice staff into rooms of 10 peeps each
            /** @type {string[][]} */
            const allRooms = [];
            for (let i = 0; i < allStaff.length; i += 10) {
                allRooms.push(allStaff.slice(i, i + 10));
            }
            const missingRooms =
                parseInt(roomsSelection.value) - allRooms.length;
            // if we're allowed to open empty schools, add empty rooms
            if (allowEmptyCheckbox.checked && missingRooms > 0) {
                for (let i = 0; i < missingRooms; i++) allRooms.push([]);
            }
            return allRooms;
        };
        /**
         * @param {string[][]} rooms
         * @returns {Record<number, string[][]>}
         */
        const assignRoomsToSchools = rooms => {
            const roomsBySchool = {};
            for (const school of schools) {
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
         * @returns {Promise<Response>}
         */
        const openSchool = (schoolId, staff, rooms) => {
            const schoolUrl = new URL(
                `/buildings/${schoolId}`,
                unsafeWindow.location.href
            );
            schoolUrl.searchParams.set('utf8', '✓');
            schoolUrl.searchParams.set('authenticity_token', authToken);
            schoolUrl.searchParams.set('education', form.education.value);
            schoolUrl.searchParams.set(
                'alliance[duration]',
                form['alliance[duration]'].value
            );
            schoolUrl.searchParams.set(
                'alliance[cost]',
                form['alliance[cost]'].value
            );
            schoolUrl.searchParams.set('building_rooms_use', rooms.toString());
            staff.forEach(id =>
                schoolUrl.searchParams.append('personal_ids[]', id)
            );
            schoolUrl.searchParams.set('commit', 'Ausbilden');
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
            Promise.all([req, new Promise(r => setTimeout(r, 100))]);

        form.addEventListener('submit', async e => {
            e.preventDefault();

            form.querySelectorAll('input[type=submit]').forEach(
                submit => (submit.disabled = true)
            );

            const currentStateSpan = document.createElement('span');
            currentStateSpan.classList.add('label', 'label-warning');
            currentStateSpan.style.setProperty('font-size', '14px');
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

            const schools = assignRoomsToSchools(getRooms());
            const totalSchools = Object.keys(schools).length;
            currentStateSpan.textContent = `0/${totalSchools.toLocaleString()} Schulen verarbeitet`;
            let progress = 0;

            const doProgress = (schoolId, staffAmount) => {
                console.log(
                    `sent ${staffAmount} staff to ${schoolNameMap.get(schoolId)}`
                );
                progress++;

                currentStateSpan.textContent = `${progress.toLocaleString()}/${totalSchools.toLocaleString()} Schulen verarbeitet [${schoolNameMap.get(schoolId)}]`;
                progressBar.style.setProperty(
                    'width',
                    `${(progress / totalSchools) * 100}%`
                );
            };

            if (!Object.keys(schools).length) return;
            if (isAllianceSchool) {
                for (const [schoolId, staff] of Object.entries(schools)) {
                    const staffForSchool = staff.flat();
                    const schoolDoc = await reqOr100ms(
                        openSchool(schoolId, [], staff.length)
                            .then(res => res.text())
                            .then(html =>
                                new DOMParser().parseFromString(
                                    html,
                                    'text/html'
                                )
                            )
                    );
                    const schoolingIds = Array.from(
                        schoolDoc.querySelectorAll(
                            'td:has(.label-warning) + td[sortvalue="10"] + td span[id^="education_schooling_"]'
                        )
                    )
                        .map(span =>
                            parseInt(
                                span.id.split('_').pop()?.toString() ?? '-1'
                            )
                        )
                        .toSorted((a, b) => b - a);

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
                for (const [schoolId, staff] of Object.entries(schools)) {
                    const staffForSchool = staff.flat();
                    await reqOr100ms(
                        openSchool(schoolId, staffForSchool, staff.length)
                    );
                    doProgress(schoolId, staffForSchool.length);
                }
            }

            currentStateSpan.classList.replace(
                'label-warning',
                'label-success'
            );
            currentStateSpan.textContent = 'Schulen erfolgreich gefüllt! 😊';

            setTimeout(() => window.location.reload(), 2000);
        });
    })
    .finally(() => {
        roomsSelection.disabled = false;
        spinner.remove();
    });
