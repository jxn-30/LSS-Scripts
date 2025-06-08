// ==UserScript==
// @name            [LSS] AAO All vehicle types
// @name:de         [LSS] AAO Alle Fahrzeugtypen
// @namespace       https://jxn.lss-manager.de
// @version         2025.06.09+0005
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
// @grant           GM_addStyle
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
 * @grant GM_addStyle
 */

/* global I18n existing_aao */

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

const createFormRow = () => {
    const row = document.createElement('div');
    row.classList.add('form-group', 'integer', 'optional');

    const labelWrapper = document.createElement('div');
    labelWrapper.classList.add('col-sm-3', 'control-label');
    const label = document.createElement('label');
    label.classList.add('integer', 'optional');
    labelWrapper.append(label);

    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('col-sm-9');

    row.append(labelWrapper, inputWrapper);

    return { row, label, inputWrapper };
};

const vehicleTypesCheckboxWrapperClass = 'jxn30-aao-vehicle-types-checkboxes';

GM_addStyle(`
.${vehicleTypesCheckboxWrapperClass} label {
    margin-left: 1em;
    font-weight: normal;
    margin-bottom: 0;
}
`);

(async () => {
    const tabs = document.querySelector('#tabs');
    if (!tabs) return;

    const lang = I18n.locale;
    const vehicleTypes = await getVehicleTypes(lang);
    const vehicleTypesById = Object.fromEntries(
        vehicleTypes.map(v => [v.id, v])
    );

    const individualTabLink = document.createElement('li');
    const individualTabLinkA = document.createElement('a');
    individualTabLinkA.dataset.toggle = 'tab';
    individualTabLinkA.textContent = 'Alle Fahrzeugtypen';
    individualTabLink.append(individualTabLinkA);
    tabs.append();

    const individualTab = document.createElement('div');
    individualTab.id = 'jxn30-aao-all-vehicle-types';
    individualTabLinkA.href = `#${individualTab.id}`;
    individualTab.className = 'tab-pane';

    const combinationsTabLink = document.createElement('li');
    const combinationsLinkA = document.createElement('a');
    combinationsLinkA.dataset.toggle = 'tab';
    combinationsLinkA.textContent = 'Beliebige ODER-Kombinationen';
    combinationsTabLink.append(combinationsLinkA);

    const combinationsTab = document.createElement('div');
    combinationsTab.id = 'jxn30-aao-all-vehicle-types-or-combinations';
    combinationsLinkA.href = `#${combinationsTab.id}`;
    combinationsTab.className = 'tab-pane';

    tabs.append(individualTabLink, combinationsTabLink);
    document
        .querySelector('.tab-content')
        .append(individualTab, combinationsTab);

    const searchWrapper = document.createElement('div');
    searchWrapper.classList.add('form-group', 'optional');
    const searchBar = document.createElement('input');
    searchBar.type = 'search';
    searchBar.placeholder = 'Suchen...';
    searchBar.classList.add('form-control');
    searchBar.addEventListener('input', () => {
        const value = searchBar.value.toLowerCase();
        individualTab.querySelectorAll(`div[data-caption]`).forEach(div => {
            div.style.display =
                div.dataset.caption.includes(value) ? '' : 'none';
        });
    });
    searchWrapper.append(searchBar);
    individualTab.append(searchWrapper);

    /** @type {HTMLInputElement[]} */
    const inputs = [];

    vehicleTypes.forEach(({ id, caption }) => {
        const { row, label, inputWrapper } = createFormRow();
        row.dataset.caption = caption.toLowerCase();

        label.textContent = caption;

        const input = document.createElement('input');
        input.classList.add('numeric', 'integer', 'optional', 'form-control');
        input.type = 'number';
        input.name = `vehicle_type_ids[${id}]`;
        input.min = '0';
        input.max = '100';
        input.value =
            document.querySelector(`input[name="vehicle_type_ids[${id}]"]`)
                ?.value ?? '0';
        label.htmlFor = input.id = `vehicle_type_ids_${id}`;
        input.disabled = true;
        inputWrapper.append(input);
        inputs.push(input);

        individualTab.append(row);
    });

    const baseTypesSelect = document.createElement('div');
    baseTypesSelect.classList.add(vehicleTypesCheckboxWrapperClass);
    vehicleTypes.forEach(({ id, caption }) => {
        const option = document.createElement('input');
        option.type = 'checkbox';
        option.dataset.type = id.toString();
        option.disabled = true;
        const label = document.createElement('label');
        label.textContent = caption.replace(/ /g, '\u00A0');
        label.prepend(option);
        baseTypesSelect.append(label);
    });

    /**
     * @param {number[]} vehicles
     * @param {number} [value]
     */
    const createOrCombination = (vehicles, value = 0) => {
        const { row, label, inputWrapper } = createFormRow();

        const amountInput = document.createElement('input');
        amountInput.classList.add(
            'numeric',
            'integer',
            'optional',
            'form-control'
        );
        amountInput.type = 'number';
        amountInput.min = '0';
        amountInput.max = '100';
        amountInput.value = value.toString();
        amountInput.disabled = true;

        const typesSelect = baseTypesSelect.cloneNode(true);
        const checkboxes = Array.from(
            typesSelect.querySelectorAll('input[type="checkbox"]')
        );
        checkboxes
            .filter(c => vehicles.includes(Number(c.dataset.type)))
            .forEach(c => (c.checked = true));

        inputWrapper.append(amountInput, typesSelect);
        inputs.push(amountInput, ...checkboxes);

        typesSelect.addEventListener('change', () => {
            const amount = amountInput.value;
            document
                .querySelectorAll(`input[name="${amountInput.name}"]`)
                .forEach(input => (input.value = '0'));
            amountInput.value = amount;

            const selectedVehicles = checkboxes
                .filter(c => c.checked)
                .map(c => Number(c.dataset.type));
            label.textContent = selectedVehicles
                .map(vehicle =>
                    vehicleTypesById[vehicle].caption.replace(/ /g, '\u00A0')
                )
                .join(' oder ');
            amountInput.name = `vehicle_type_ids[${JSON.stringify(selectedVehicles).replace(/,/g, ', ')}]`;
            label.htmlFor =
                amountInput.id = `jxn30-aao-${selectedVehicles.join('-')}`;

            document
                .querySelectorAll(`input[name="${amountInput.name}"]`)
                .forEach(input => (input.value = amount));
        });

        typesSelect.dispatchEvent(new Event('change'));

        addCombinationButton.after(row);

        return { amountInput, checkboxes };
    };

    const addCombinationButton = document.createElement('button');
    addCombinationButton.type = 'button';
    addCombinationButton.classList.add('btn', 'btn-success', 'btn-block');
    addCombinationButton.textContent =
        'Weitere anpassbare ODER-Kombination hinzufügen';
    addCombinationButton.addEventListener('click', e => {
        e.preventDefault();
        const { amountInput, checkboxes } = createOrCombination([]);
        amountInput.disabled = false;
        checkboxes.forEach(c => (c.disabled = false));
    });
    combinationsTab.append(addCombinationButton);

    existing_aao.entries().forEach(([type, amount]) => {
        document
            .querySelectorAll(`input[name="vehicle_type_ids[${type}]"]`)
            .forEach(input => (input.value = amount));

        // OR-Combinations
        if (/^vehicle_type_ids_\[\d+(?:,\s*\d+)*]$/.test(type)) {
            createOrCombination(
                JSON.parse(type.replace('vehicle_type_ids_', '')),
                amount
            );
        }
    });
    inputs.forEach(input => (input.disabled = false));

    /**
     * updates all inputs with the same name as the target
     * @param {Event} event
     */
    const updateAllSimilar = ({ target }) => {
        if (!target || !(target instanceof HTMLInputElement)) return;
        if (target.type === 'checkbox') return;
        const name = target.name;
        document
            .querySelectorAll(`input[name="${name}"]`)
            .forEach(input => (input.value = target.value));
    };

    document.addEventListener('input', updateAllSimilar);
    document.addEventListener('change', updateAllSimilar);
})();
