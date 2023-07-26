// ==UserScript==
// @name            [LSS] Mission Sort
// @name:de         [LSS] Einsatzsortierung
// @namespace       https://jxn.lss-manager.de
// @version         2023.07.26+2143
// @author          Jan (jxn_30)
// @description     Sorts the mission list by credits (and allows sorted buttons in missions window. [WIP])
// @description:de  Sortiert die Einsatzliste nach Credits (und ermöglicht sortierte Buttons im Einsatzfenster. [Feature noch in Arbeit])
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/missionSort.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/missionSort.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/24358-script-sortierung-der-einsatzliste/
// @match           https://www.operacni-stredisko.cz/
// @match           https://www.operacni-stredisko.cz/missions/*
// @match           https://policie.operacni-stredisko.cz/
// @match           https://policie.operacni-stredisko.cz/missions/*
// @match           https://www.alarmcentral-spil.dk/
// @match           https://www.alarmcentral-spil.dk/missions/*
// @match           https://politi.alarmcentral-spil.dk/
// @match           https://politi.alarmcentral-spil.dk/missions/*
// @match           https://www.leitstellenspiel.de/
// @match           https://www.leitstellenspiel.de/missions/*
// @match           https://polizei.leitstellenspiel.de/
// @match           https://polizei.leitstellenspiel.de/missions/*
// @match           https://www.missionchief-australia.com/
// @match           https://www.missionchief-australia.com/missions/*
// @match           https://police.missionchief-australia.com/
// @match           https://police.missionchief-australia.com/missions/*
// @match           https://www.missionchief.co.uk/
// @match           https://www.missionchief.co.uk/missions/*
// @match           https://police.missionchief.co.uk/
// @match           https://police.missionchief.co.uk/missions/*
// @match           https://www.missionchief.com/
// @match           https://www.missionchief.com/missions/*
// @match           https://police.missionchief.com/
// @match           https://police.missionchief.com/missions/*
// @match           https://www.centro-de-mando.es/
// @match           https://www.centro-de-mando.es/missions/*
// @match           https://www.centro-de-mando.mx/
// @match           https://www.centro-de-mando.mx/missions/*
// @match           https://www.hatakeskuspeli.com/
// @match           https://www.hatakeskuspeli.com/missions/*
// @match           https://poliisi.hatakeskuspeli.com/
// @match           https://poliisi.hatakeskuspeli.com/missions/*
// @match           https://www.operateur112.fr/
// @match           https://www.operateur112.fr/missions/*
// @match           https://police.operateur112.fr/
// @match           https://police.operateur112.fr/missions/*
// @match           https://www.operatore112.it/
// @match           https://www.operatore112.it/missions/*
// @match           https://polizia.operatore112.it/
// @match           https://polizia.operatore112.it/missions/*
// @match           https://www.missionchief-japan.com/
// @match           https://www.missionchief-japan.com/missions/*
// @match           https://www.missionchief-korea.com/
// @match           https://www.missionchief-korea.com/missions/*
// @match           https://www.nodsentralspillet.com/
// @match           https://www.nodsentralspillet.com/missions/*
// @match           https://politiet.nodsentralspillet.com/
// @match           https://politiet.nodsentralspillet.com/missions/*
// @match           https://www.meldkamerspel.com/
// @match           https://www.meldkamerspel.com/missions/*
// @match           https://politie.meldkamerspel.com/
// @match           https://politie.meldkamerspel.com/missions/*
// @match           https://www.operatorratunkowy.pl/
// @match           https://www.operatorratunkowy.pl/missions/*
// @match           https://policja.operatorratunkowy.pl/
// @match           https://policja.operatorratunkowy.pl/missions/*
// @match           https://www.operador193.com/
// @match           https://www.operador193.com/missions/*
// @match           https://www.jogo-operador112.com/
// @match           https://www.jogo-operador112.com/missions/*
// @match           https://policia.jogo-operador112.com/
// @match           https://policia.jogo-operador112.com/missions/*
// @match           https://www.jocdispecerat112.com/
// @match           https://www.jocdispecerat112.com/missions/*
// @match           https://www.dispetcher112.ru/
// @match           https://www.dispetcher112.ru/missions/*
// @match           https://www.dispecerske-centrum.com/
// @match           https://www.dispecerske-centrum.com/missions/*
// @match           https://www.larmcentralen-spelet.se/
// @match           https://www.larmcentralen-spelet.se/missions/*
// @match           https://polis.larmcentralen-spelet.se/
// @match           https://polis.larmcentralen-spelet.se/missions/*
// @match           https://www.112-merkez.com/
// @match           https://www.112-merkez.com/missions/*
// @match           https://www.dyspetcher101-game.com/
// @match           https://www.dyspetcher101-game.com/missions/*
// @run-at          document-idle
// @grant           unsafeWindow
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name  Mission Sort
 * @name:de Einsatzsortierung
 * @description Sorts the mission list by credits (and allows sorted buttons in missions window. [WIP])
 * @description:de Sortiert die Einsatzliste nach Credits (und ermöglicht sortierte Buttons im Einsatzfenster. [Feature noch in Arbeit])
 * @forum https://forum.leitstellenspiel.de/index.php?thread/24358-script-sortierung-der-einsatzliste/
 * @match /
 * @match /missions/*
 * @grant unsafeWindow
 * @grant GM_addStyle
 */

// Settings:
const ORDER = 'desc'; // 'asc' for ascending (aufsteigend) or 'desc' for descending (absteigend)

// End of Settings. Do not edit below this line if you don't know exactly what you're doing!

const PREFIX = 'jxn_missionSort';
const ORDER_STORAGE_KEY = `${PREFIX}_order`;
const MISSION_TYPES_STORAGE_KEY = 'aMissions';

/** // only relevant properties are listed here
 * @typedef MissionTypeDef
 * @property {string} id
 * @property {number} average_credits
 */

GM_addStyle(`
#missions-panel-body > #mission_list, #missions-panel-body > [id^="mission_list_"] {
    display: flex;             /* allows sorting by CSS */
${
    ORDER === 'asc'
        ? `    flex-flow: column;         /* sort ascending  */`
        : `    flex-flow: column-reverse; /* sort descending */`
}
`);

const cssMaxInteger = (() => {
    const cssMaxIntDummy = document.createElement('span');
    cssMaxIntDummy.style.setProperty(
        'order',
        Number.MAX_SAFE_INTEGER.toString()
    );
    document.body.append(cssMaxIntDummy);
    const maxCSSInteger = Number(getComputedStyle(cssMaxIntDummy).order);
    cssMaxIntDummy.remove();
    return maxCSSInteger;
})();

/** @type {Record<string, number>} */
let creditsByMissionType;

/** @type {number} */
let updateOrderListTimeout;

/** @type {Record<string, Record<number, {credits: number, panel: HTMLDivElement}>>} */
const missionsOrder = JSON.parse(
    localStorage.getItem(ORDER_STORAGE_KEY) || '{}'
);

/** @return {Promise<MissionTypeDef[]>} */
const getMissionTypes = () => {
    const stored = localStorage.getItem(MISSION_TYPES_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : { value: null, lastUpdate: 0 };
    if (!stored || parsed.lastUpdate < Date.now() - 5 * 1000 * 60) {
        return fetch('/einsaetze.json')
            .then(res => res.json())
            .then(missionTypes => {
                localStorage.setItem(
                    MISSION_TYPES_STORAGE_KEY,
                    JSON.stringify({
                        value: missionTypes,
                        lastUpdate: Date.now(),
                    })
                );
                return missionTypes;
            });
    }
    return Promise.resolve(parsed.value);
};

/** @return {Promise<Record<string, number>>} */
const getCreditsByMissionType = () =>
    getMissionTypes()
        .then(missionTypes =>
            Object.fromEntries(
                missionTypes.map(({ id, average_credits }) => [
                    id,
                    average_credits,
                ])
            )
        )
        .then(newCreditsByMissionType => {
            creditsByMissionType = newCreditsByMissionType;
            return newCreditsByMissionType;
        });
/**
 * @param {HTMLDivElement} panel
 * @returns {string}
 */
const getMissionTypeFromPanel = panel => {
    let missionType = panel.getAttribute('mission_type_id') ?? '-1';
    const overlayIndex = panel.getAttribute('data-overlay-index') ?? 'null';
    if (overlayIndex && overlayIndex !== 'null') {
        missionType += `-${overlayIndex}`;
    }
    const additionalOverlay =
        panel.getAttribute('data-additive-overlays') ?? 'null';
    if (additionalOverlay && additionalOverlay !== 'null') {
        missionType += `/${additionalOverlay}`;
    }
    return missionType;
};

const updateStorage = () =>
    localStorage.setItem(
        ORDER_STORAGE_KEY,
        JSON.stringify(
            Object.fromEntries(
                Object.entries(missionsOrder).map(([list, missions]) => [
                    list,
                    Object.entries(missions)
                        .sort(
                            (
                                [, { credits: creditsA, panel: panelA }],
                                [, { credits: creditsB, panel: panelB }]
                            ) => {
                                const position =
                                    panelA?.compareDocumentPosition(panelB) ??
                                    0;
                                const panelAIsFirst =
                                    position & Node.DOCUMENT_POSITION_FOLLOWING;
                                return creditsB === creditsA
                                    ? panelAIsFirst // if both do have same credits, sort by position in DOM
                                        ? -1
                                        : 1
                                    : creditsB - creditsA; // otherwise sort by credits (descending)
                            }
                        )
                        .map(([mission]) => mission),
                ])
            )
        )
    );

/**
 * @param {HTMLDivElement} panel
 */
const setMissionOrder = async panel => {
    const missionId = panel.getAttribute('mission_id') ?? '';

    if (!creditsByMissionType) await getCreditsByMissionType();
    const missionType = getMissionTypeFromPanel(panel);
    const credits =
        missionType in creditsByMissionType
            ? creditsByMissionType[missionType] ?? 0
            : cssMaxInteger;

    panel.style.setProperty('order', credits.toString());

    const list = panel.parentElement?.id?.replace(/^mission_list_?/u, '') ?? '';
    if (!(list in missionsOrder)) {
        missionsOrder[list] = [];
    }
    if (panel.classList.contains('mission_deleted')) {
        delete missionsOrder[list][missionId];
    } else if (
        !(missionId in missionsOrder[list]) ||
        missionsOrder[list][missionId].credits !== credits
    ) {
        missionsOrder[list][missionId] = {
            credits,
            panel,
        };
        if (updateOrderListTimeout) {
            window.clearTimeout(updateOrderListTimeout);
        }
        updateOrderListTimeout = window.setTimeout(updateStorage, 100);
    }
};

// wer're on the main page => sort the missions list
if (document.location.pathname === '/') {
    // update on new mission
    const missionMarkerAddOrig = unsafeWindow.missionMarkerAdd;
    unsafeWindow.missionMarkerAdd = (...args) => {
        missionMarkerAddOrig(...args);
        const panel = document.querySelector(`#mission_${args[0].id}`);
        if (panel) setMissionOrder(panel).then();
    };

    // remove from storage on deletion
    const missionDeleteOrig = unsafeWindow.missionDelete;
    unsafeWindow.missionDelete = (...args) => {
        missionDeleteOrig(...args);
        Object.keys(missionsOrder).forEach(
            list => delete missionsOrder[list][args[0]]
        );
        updateStorage();
    };

    // set flexbox display style on showing a list
    const missionSelectionActiveOrig = unsafeWindow.missionSelectionActive;
    unsafeWindow.missionSelectionActive = (...args) => {
        missionSelectionActiveOrig(...args);
        document
            .querySelector(`#${args[0].attr('classShow')}`)
            ?.style.setProperty('display', 'flex');
    };

    Promise.all(
        Array.from(
            document.querySelectorAll(
                '#missions-panel-body .missionSideBarEntry'
            )
        ).map(panel => setMissionOrder(panel))
    ).then();
}
