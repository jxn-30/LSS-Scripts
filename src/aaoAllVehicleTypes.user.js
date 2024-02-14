// ==UserScript==
// @name            [LSS] AAO All vehicle types
// @name:de         [LSS] AAO Alle Fahrzeugtypen
// @namespace       https://jxn.lss-manager.de
// @version         2024.02.14+1250
// @author          Jan (jxn_30)
// @description     Allows to select all vehicle types in ARRs.
// @description:de  Erlaubt es, alle Fahrzeugtypen in der AAO auszuwählen, nicht nur die vom Spiel vorgegebenen.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/aaoAllVehicleTypes.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/aaoAllVehicleTypes.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/25128-script-aao-alle-fahrzeugtypen-ausw%C3%A4hlbar/
// @match           https://www.operacni-stredisko.cz/aaos/new
// @match           https://www.operacni-stredisko.cz/aaos/*/edit
// @match           https://www.operacni-stredisko.cz/aaos/*/copy
// @match           https://policie.operacni-stredisko.cz/aaos/new
// @match           https://policie.operacni-stredisko.cz/aaos/*/edit
// @match           https://policie.operacni-stredisko.cz/aaos/*/copy
// @match           https://www.alarmcentral-spil.dk/aaos/new
// @match           https://www.alarmcentral-spil.dk/aaos/*/edit
// @match           https://www.alarmcentral-spil.dk/aaos/*/copy
// @match           https://politi.alarmcentral-spil.dk/aaos/new
// @match           https://politi.alarmcentral-spil.dk/aaos/*/edit
// @match           https://politi.alarmcentral-spil.dk/aaos/*/copy
// @match           https://www.leitstellenspiel.de/aaos/new
// @match           https://www.leitstellenspiel.de/aaos/*/edit
// @match           https://www.leitstellenspiel.de/aaos/*/copy
// @match           https://polizei.leitstellenspiel.de/aaos/new
// @match           https://polizei.leitstellenspiel.de/aaos/*/edit
// @match           https://polizei.leitstellenspiel.de/aaos/*/copy
// @match           https://www.missionchief-australia.com/aaos/new
// @match           https://www.missionchief-australia.com/aaos/*/edit
// @match           https://www.missionchief-australia.com/aaos/*/copy
// @match           https://police.missionchief-australia.com/aaos/new
// @match           https://police.missionchief-australia.com/aaos/*/edit
// @match           https://police.missionchief-australia.com/aaos/*/copy
// @match           https://www.missionchief.co.uk/aaos/new
// @match           https://www.missionchief.co.uk/aaos/*/edit
// @match           https://www.missionchief.co.uk/aaos/*/copy
// @match           https://police.missionchief.co.uk/aaos/new
// @match           https://police.missionchief.co.uk/aaos/*/edit
// @match           https://police.missionchief.co.uk/aaos/*/copy
// @match           https://www.missionchief.com/aaos/new
// @match           https://www.missionchief.com/aaos/*/edit
// @match           https://www.missionchief.com/aaos/*/copy
// @match           https://police.missionchief.com/aaos/new
// @match           https://police.missionchief.com/aaos/*/edit
// @match           https://police.missionchief.com/aaos/*/copy
// @match           https://www.centro-de-mando.es/aaos/new
// @match           https://www.centro-de-mando.es/aaos/*/edit
// @match           https://www.centro-de-mando.es/aaos/*/copy
// @match           https://www.centro-de-mando.mx/aaos/new
// @match           https://www.centro-de-mando.mx/aaos/*/edit
// @match           https://www.centro-de-mando.mx/aaos/*/copy
// @match           https://www.hatakeskuspeli.com/aaos/new
// @match           https://www.hatakeskuspeli.com/aaos/*/edit
// @match           https://www.hatakeskuspeli.com/aaos/*/copy
// @match           https://poliisi.hatakeskuspeli.com/aaos/new
// @match           https://poliisi.hatakeskuspeli.com/aaos/*/edit
// @match           https://poliisi.hatakeskuspeli.com/aaos/*/copy
// @match           https://www.operateur112.fr/aaos/new
// @match           https://www.operateur112.fr/aaos/*/edit
// @match           https://www.operateur112.fr/aaos/*/copy
// @match           https://police.operateur112.fr/aaos/new
// @match           https://police.operateur112.fr/aaos/*/edit
// @match           https://police.operateur112.fr/aaos/*/copy
// @match           https://www.operatore112.it/aaos/new
// @match           https://www.operatore112.it/aaos/*/edit
// @match           https://www.operatore112.it/aaos/*/copy
// @match           https://polizia.operatore112.it/aaos/new
// @match           https://polizia.operatore112.it/aaos/*/edit
// @match           https://polizia.operatore112.it/aaos/*/copy
// @match           https://www.missionchief-japan.com/aaos/new
// @match           https://www.missionchief-japan.com/aaos/*/edit
// @match           https://www.missionchief-japan.com/aaos/*/copy
// @match           https://www.missionchief-korea.com/aaos/new
// @match           https://www.missionchief-korea.com/aaos/*/edit
// @match           https://www.missionchief-korea.com/aaos/*/copy
// @match           https://www.nodsentralspillet.com/aaos/new
// @match           https://www.nodsentralspillet.com/aaos/*/edit
// @match           https://www.nodsentralspillet.com/aaos/*/copy
// @match           https://politiet.nodsentralspillet.com/aaos/new
// @match           https://politiet.nodsentralspillet.com/aaos/*/edit
// @match           https://politiet.nodsentralspillet.com/aaos/*/copy
// @match           https://www.meldkamerspel.com/aaos/new
// @match           https://www.meldkamerspel.com/aaos/*/edit
// @match           https://www.meldkamerspel.com/aaos/*/copy
// @match           https://politie.meldkamerspel.com/aaos/new
// @match           https://politie.meldkamerspel.com/aaos/*/edit
// @match           https://politie.meldkamerspel.com/aaos/*/copy
// @match           https://www.operatorratunkowy.pl/aaos/new
// @match           https://www.operatorratunkowy.pl/aaos/*/edit
// @match           https://www.operatorratunkowy.pl/aaos/*/copy
// @match           https://policja.operatorratunkowy.pl/aaos/new
// @match           https://policja.operatorratunkowy.pl/aaos/*/edit
// @match           https://policja.operatorratunkowy.pl/aaos/*/copy
// @match           https://www.operador193.com/aaos/new
// @match           https://www.operador193.com/aaos/*/edit
// @match           https://www.operador193.com/aaos/*/copy
// @match           https://www.jogo-operador112.com/aaos/new
// @match           https://www.jogo-operador112.com/aaos/*/edit
// @match           https://www.jogo-operador112.com/aaos/*/copy
// @match           https://policia.jogo-operador112.com/aaos/new
// @match           https://policia.jogo-operador112.com/aaos/*/edit
// @match           https://policia.jogo-operador112.com/aaos/*/copy
// @match           https://www.jocdispecerat112.com/aaos/new
// @match           https://www.jocdispecerat112.com/aaos/*/edit
// @match           https://www.jocdispecerat112.com/aaos/*/copy
// @match           https://www.dispetcher112.ru/aaos/new
// @match           https://www.dispetcher112.ru/aaos/*/edit
// @match           https://www.dispetcher112.ru/aaos/*/copy
// @match           https://www.dispecerske-centrum.com/aaos/new
// @match           https://www.dispecerske-centrum.com/aaos/*/edit
// @match           https://www.dispecerske-centrum.com/aaos/*/copy
// @match           https://www.larmcentralen-spelet.se/aaos/new
// @match           https://www.larmcentralen-spelet.se/aaos/*/edit
// @match           https://www.larmcentralen-spelet.se/aaos/*/copy
// @match           https://polis.larmcentralen-spelet.se/aaos/new
// @match           https://polis.larmcentralen-spelet.se/aaos/*/edit
// @match           https://polis.larmcentralen-spelet.se/aaos/*/copy
// @match           https://www.112-merkez.com/aaos/new
// @match           https://www.112-merkez.com/aaos/*/edit
// @match           https://www.112-merkez.com/aaos/*/copy
// @match           https://www.dyspetcher101-game.com/aaos/new
// @match           https://www.dyspetcher101-game.com/aaos/*/edit
// @match           https://www.dyspetcher101-game.com/aaos/*/copy
// @run-at          document-idle
// ==/UserScript==

/**
 * @name AAO All vehicle types
 * @name:de AAO Alle Fahrzeugtypen
 * @description Allows to select all vehicle types in ARRs.
 * @description:de Erlaubt es, alle Fahrzeugtypen in der AAO auszuwählen, nicht nur die vom Spiel vorgegebenen.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/25128-script-aao-alle-fahrzeugtypen-ausw%C3%A4hlbar/
 * @match /aaos/new
 * @match /aaos/*\/edit
 * @match /aaos/*\/copy
 */

/* global I18n */

/**
 * @typedef {object} VehicleType
 * @property {number} id
 * @property {string} caption
 */

/**
 * fetches all vehicle types from LSSM API
 * @param {string} lang
 * @returns {Promise<VehicleType[]>}
 */
const getVehicleTypes = lang =>
    fetch(`https://api.lss-manager.de/${lang}/vehicles`)
        .then(res => res.json())
        .then(vehicles =>
            Object.entries(vehicles).map(([id, { caption }]) => ({
                id,
                caption,
            }))
        )
        .then(vehicles =>
            vehicles.sort((a, b) => a.caption.localeCompare(b.caption))
        );

/**
 * reads the vehicle types from AAO-API
 * @returns {Promise<Record<number, number>>}
 */
const getAAOVehicleTypes = () => {
    const id = document.location.pathname.match(
        /(?<=\/aaos\/)\d+(?=\/edit)/
    )?.[0];
    if (!id) return Promise.resolve({});
    return fetch(`/api/v1/aaos/${id}`)
        .then(res => res.json())
        .then(({ vehicle_types }) => vehicle_types ?? {});
};

(async () => {
    const tabs = document.querySelector('#tabs');
    if (!tabs) return;

    const lang = I18n.locale;
    const vehicleTypes = await getVehicleTypes(lang);

    const tabLink = document.createElement('li');
    const tabLinkA = document.createElement('a');
    tabLinkA.dataset.toggle = 'tab';
    tabLinkA.textContent = 'Alle Fahrzeugtypen';
    tabLink.append(tabLinkA);
    tabs.append(tabLink);

    const tab = document.createElement('div');
    tab.id = 'jxn30-aao-all-vehicle-types';
    tabLinkA.href = `#${tab.id}`;
    tab.className = 'tab-pane';
    document.querySelector('.tab-content').append(tab);

    const searchWrapper = document.createElement('div');
    searchWrapper.classList.add('form-group', 'optional');
    const searchBar = document.createElement('input');
    searchBar.type = 'search';
    searchBar.placeholder = 'Suchen...';
    searchBar.classList.add('form-control');
    searchBar.addEventListener('input', () => {
        const value = searchBar.value.toLowerCase();
        tab.querySelectorAll(`div[data-caption]`).forEach(div => {
            div.style.display =
                div.dataset.caption.includes(value) ? '' : 'none';
        });
    });
    searchWrapper.append(searchBar);
    tab.append(searchWrapper);

    /** @type {HTMLInputElement[]} */
    const inputs = [];

    vehicleTypes.forEach(({ id, caption }) => {
        const div = document.createElement('div');
        div.classList.add('form-group', 'integer', 'optional');
        div.dataset.caption = caption.toLowerCase();

        const divLabel = document.createElement('div');
        divLabel.classList.add('col-sm-3', 'control-label');
        const label = document.createElement('label');
        label.classList.add('integer', 'optional');
        label.setAttribute('for', `aao_${id}`);
        label.textContent = caption;
        divLabel.append(label);

        const divInput = document.createElement('div');
        divInput.classList.add('col-sm-9');
        const input = document.createElement('input');
        input.classList.add('numeric', 'integer', 'optional', 'form-control');
        input.type = 'number';
        input.name = `vehicle_type_ids[${id}]`;
        input.min = '0';
        input.max = '100';
        input.id = `jxn30-aao-${id}`;
        input.value =
            document.querySelector(`input[name="vehicle_type_ids[${id}]"]`)
                ?.value ?? '0';
        label.setAttribute('for', input.id);
        input.disabled = true;

        inputs.push(input);
        divInput.append(input);

        div.append(divLabel, divInput);
        tab.append(div);
    });

    getAAOVehicleTypes()
        .then(types =>
            Object.entries(types).forEach(([type, amount]) =>
                document
                    .querySelectorAll(`input[name="vehicle_type_ids[${type}]"]`)
                    .forEach(input => (input.value = amount))
            )
        )
        .then(() => inputs.forEach(input => (input.disabled = false)));

    /**
     * updates all inputs with the same name as the target
     * @param {Event} event
     */
    const updateAllSimilar = ({ target }) => {
        if (!target || !(target instanceof HTMLInputElement)) return;
        const name = target.name;
        document
            .querySelectorAll(`input[name="${name}"]`)
            .forEach(input => (input.value = target.value));
    };

    document.addEventListener('input', updateAllSimilar);
    document.addEventListener('change', updateAllSimilar);
})();
