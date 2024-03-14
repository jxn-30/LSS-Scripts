// ==UserScript==
// @name            [LSS] Building cost calculator
// @name:de         [LSS] Baukostenrechner
// @namespace       https://jxn.lss-manager.de
// @version         2024.03.14+2005
// @author          Jan (jxn_30)
// @description     Calculates the costs of the next buildings including a sum
// @description:de  Berechnet die Kosten der nächsten Gebäude inklusive einer Summe
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/buildingCostCalculator.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/buildingCostCalculator.user.js
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
// @run-at          document-idle
// @grant           GM_getResourceURL
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Building cost calculator
 * @name:de Baukostenrechner
 * @description Calculates the costs of the next buildings including a sum
 * @description:de Berechnet die Kosten der nächsten Gebäude inklusive einer Summe
 * @// TODO
 * @// forum https://forum.leitstellenspiel.de/index.php?thread/25128-script-aao-alle-fahrzeugtypen-ausw%C3%A4hlbar/
 * @match /
 * @// icon taken from https://icons8.com/icon/25993/mortgage
 * @resource icon /resources/buildingCostCalculator.user.js/icon.png
 * @grant GM_getResourceURL
 * @grant GM_addStyle
 */

const modalId = 'jxn-building_cost-modal';

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

/** @type {Record<string, (nth: number) => number>} */
const buildingPriceFormulas = {
    Feuerwehr: nth =>
        Math.ceil(100_000 + 200_000 * Math.log2(Math.max(1, nth - 22))),
    Polizei: nth =>
        Math.ceil(100_000 + 200_000 * Math.log2(Math.max(1, nth - 22))),
    THW: nth => Math.ceil(200_000 + 100_000 * Math.log2(nth + 1)),
};

// create a modal
const createModal = () => {
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

    const select = document.createElement('select');
    Object.keys(buildingPriceFormulas)
        .sort()
        .forEach((type, index) => {
            const option = document.createElement('option');
            option.textContent = type;
            option.value = type;

            if (!index) option.selected = true;

            select.append(option);
        });
    select.placeholder = 'Gebäudetyp auswählen';

    const startInput = document.createElement('input');
    startInput.type = 'number';
    startInput.min = '1';
    startInput.placeholder = 'Erstes Gebäude';

    const endInput = document.createElement('input');
    endInput.type = 'number';
    endInput.min = '1';
    endInput.placeholder = 'Letztes Gebäude';

    const summary = document.createElement('span');

    const table = document.createElement('table');
    table.classList.add(
        'table',
        'table-striped',
        'table-hover',
        'table-responsive'
    );

    const thead = table.createTHead();
    const headRow = thead.insertRow();
    const nthTh = document.createElement('th');
    nthTh.textContent = 'N-tes Gebäude';
    const priceTh = document.createElement('th');
    priceTh.textContent = 'Baupreis';
    headRow.append(nthTh, priceTh);

    const tbody = table.createTBody();

    startInput.addEventListener('change', () => {
        if (parseInt(startInput.value) < 1) startInput.value = '1';
        endInput.min = startInput.value;
        if (parseInt(endInput.value) < parseInt(startInput.value)) {
            endInput.value = startInput.value;
        }
    });
    endInput.addEventListener('change', () => {
        if (parseInt(endInput.value) < 1) endInput.value = '1';
        startInput.max = endInput.value;
        if (parseInt(startInput.value) > parseInt(endInput.value)) {
            startInput.value = endInput.value;
        }
    });

    const tfoot = table.createTFoot();
    const footRow = tfoot.insertRow();
    const amountTh = document.createElement('th');
    const sumTh = document.createElement('th');
    footRow.append(amountTh, sumTh);

    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add(
        'flex-row',
        'justify-between',
        'align-items-center'
    );
    inputWrapper.style.setProperty('margin-top', '10px');
    inputWrapper.style.setProperty('margin-bottom', '10px');
    inputWrapper.style.setProperty('gap', '10px');
    inputWrapper.style.setProperty('flex-wrap', 'nowrap');
    inputWrapper.append(select, startInput, endInput);

    const update = () => {
        tbody.replaceChildren();

        const start = parseInt(startInput.value ?? '1');
        const end = parseInt(endInput.value ?? '0') || start;
        const formula = buildingPriceFormulas[select.value];

        let sum = 0;

        for (let nth = start; nth <= end; nth++) {
            const row = tbody.insertRow();
            row.insertCell().textContent = nth.toLocaleString();
            const price = formula(nth);
            sum += price;
            row.insertCell().textContent = `${price.toLocaleString()}\xa0Credits`;
        }

        amountTh.textContent = `Zahl der Gebäude: ${(end - start + 1).toLocaleString()}`;
        sumTh.textContent = `Summe der Baukosten: ${sum.toLocaleString()}`;
        summary.textContent = `Diese ${(end - start + 1).toLocaleString()} Gebäude kosten zusammen ${sum.toLocaleString()} Credits.`;
    };

    [select, startInput, endInput].forEach(input => {
        input.classList.add('flex-grow-1', 'form-control');
        input.style.setProperty('flex-basis', '200px');

        input.addEventListener('input', update);
        input.addEventListener('change', update);
    });

    body.append(close, inputWrapper, summary, table);
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
triggerA.append(triggerImg, '\xa0Baukostenrechner');
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
