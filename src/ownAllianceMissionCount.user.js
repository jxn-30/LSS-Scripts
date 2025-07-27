// ==UserScript==
// @name            [LSS] Own alliance mission count
// @name:de         [LSS] Freigabenzähler
// @namespace       https://jxn.lss-manager.de
// @version         2024.10.27+2323
// @author          Jan (jxn_30)
// @description     Allows to add diverse counters to the top of the mission list
// @description:de  Ermöglicht diverse Zähler oben in der Einsatzliste
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/ownAllianceMissionCount.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/ownAllianceMissionCount.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/16843-script-ownalliancemissioncount/
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
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name Own alliance mission count
 * @name:de Freigabenzähler
 * @description Allows to add diverse counters to the top of the mission list
 * @description:de Ermöglicht diverse Zähler oben in der Einsatzliste
 * @forum https://forum.leitstellenspiel.de/index.php?thread/16843-script-ownalliancemissioncount/
 * @match /
 * @grant GM_getValue
 * @grant GM_setValue
 * @grant unsafeWindow
 * @old OwnAllianceMissionCount
 */

const STORAGE_KEY = 'config';
const SELECTORS = {
    SHARED: '.panel-success',
    NOT_SHARED: '.panel:not(.panel-success)',
    ATTENDED: '.glyphicon-user:not(.hidden)',
    NOT_ATTENDED: '.glyphicon-user.hidden',
    RED: '.mission_panel_red',
    YELLOW: '.mission_panel_yellow',
    GREEN: '.mission_panel_green',
};
SELECTORS.SHARED_NOT_ATTENDED = `${SELECTORS.SHARED} ${SELECTORS.NOT_ATTENDED}`;
SELECTORS.SHARED_RED = `${SELECTORS.SHARED}${SELECTORS.RED}`;
SELECTORS.SHARED_YELLOW = `${SELECTORS.SHARED}${SELECTORS.YELLOW}`;
SELECTORS.SHARED_GREEN = `${SELECTORS.SHARED}${SELECTORS.GREEN}`;
SELECTORS.SHARED_GREEN_NOT_ATTENDED = `${SELECTORS.SHARED}${SELECTORS.GREEN} ${SELECTORS.NOT_ATTENDED}`;
const LISTS = {
    OWN: 'mission_list',
    ALLIANCE: 'mission_list_alliance',
    SIWA: 'mission_list_sicherheitswache',
    SIWA_ALLIANCE: 'mission_list_sicherheitswache_alliance',
    KT: 'mission_list_krankentransporte',
    EVENT: 'mission_list_alliance_event',
};

// TODO: Erwarteter Verdienst?

/** @type {Config} */
const DEFAULT_CONFIG = [
    { text: 'eig. Frei:' },
    {
        description: 'Eigene Freigaben ohne eigene Beteiligung',
        selector: SELECTORS.SHARED_NOT_ATTENDED,
        lists: [LISTS.OWN],
    },
    {
        description: 'Eigene Freigaben (rot)',
        color: 'red',
        selector: SELECTORS.SHARED_RED,
        lists: [LISTS.OWN],
    },
    {
        description: 'Eigene Freigaben (gelb)',
        color: 'yellow',
        selector: SELECTORS.SHARED_YELLOW,
        lists: [LISTS.OWN],
    },
    {
        description: 'Eigene Freigaben (grün)',
        color: 'green',
        selector: SELECTORS.SHARED_GREEN,
        lists: [LISTS.OWN],
    },
    { text: '//' },
    { text: '!!!:', color: 'red' },
    {
        description: 'Eigene Freigaben ohne eigene Beteiligung (grün)',
        color: 'red',
        selector: SELECTORS.SHARED_GREEN_NOT_ATTENDED,
        lists: [LISTS.OWN],
    },
    { text: '//' },
    { text: 'TODO Verband:' },
    {
        description: 'Freigaben des Verbandes ohne eigene Beteiligung',
        selector: SELECTORS.NOT_ATTENDED,
        lists: [LISTS.ALLIANCE],
    },
    { text: '/' },
    { text: 'TODO SiWa:' },
    {
        description: 'Freigegebene geplante Einsätze ohne eigene Beteiligung',
        selector: SELECTORS.SHARED_NOT_ATTENDED,
        lists: [LISTS.SIWA, LISTS.SIWA_ALLIANCE],
    },
];

const counters = GM_getValue(STORAGE_KEY, DEFAULT_CONFIG);

const debounce = fn => {
    let timeout;
    return () => {
        const context = this;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(context, arguments), 100);
    };
};

const wrapper = document.createElement('div');
const counterElements = new Set();
counters.forEach(counter => {
    if ('text' in counter) {
        const text = document.createElement('span');
        text.textContent = counter.text;
        if (counter.color) text.style.color = counter.color;
        wrapper.append(text, ' ');
        return;
    }
    const counterElement = document.createElement('span');
    counterElement.title = counter.description;
    if (counter.color) counterElement.style.color = counter.color;
    counterElement.textContent = '⏳️';
    counterElements.add({ element: counterElement, counter });
    wrapper.append(counterElement, ' ');
});
document.getElementById('search_input_field_missions').before(wrapper);

const update = debounce(() =>
    counterElements.forEach(
        ({ element, counter }) =>
            (element.textContent = document
                .querySelectorAll(
                    `:where(${counter.lists.map(l => `#${l}`).join(',')}) .missionSideBarEntry:not(.mission_deleted) ${counter.selector}`
                )
                .length.toLocaleString())
    )
);

const missionMarkerAddOrig = unsafeWindow.missionMarkerAdd;
unsafeWindow.missionMarkerAdd = (...args) => {
    const result = missionMarkerAddOrig(...args);
    update();
    return result;
};
const missionDeleteOrig = unsafeWindow.missionDelete;
unsafeWindow.missionDelete = (...args) => {
    const result = missionDeleteOrig(...args);
    update();
    return result;
};
update();

// TODO: Add settings dialog

/**
 * @typedef {Object} CounterConfig
 * @property {string} description
 * @property {string} [color]
 * @property {string} selector
 * @property {Array<string>} [lists]
 */
/**
 * @typedef {Object} Text
 * @property {string} text
 * @property {string} color
 */
/** @typedef {CounterConfig | Text} ConfigEntry */
/** @typedef {Array<ConfigEntry>} Config */
