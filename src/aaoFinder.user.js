// ==UserScript==
// @name            [LSS] AAO Finder
// @name:de         [LSS] AAO Finder
// @namespace       https://jxn.lss-manager.de
// @version         2023.12.25+0046
// @author          Jan (jxn_30)
// @description     Find all ARRs that contain a certain requirement.
// @description:de  Finde alle AAOs, die eine bestimmte Anforderung enthalten.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/aaoFinder.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/aaoFinder.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/25194-script-aao-finder-finde-aaos-die-bestimmte-anforderungen-enthalten/
// @match           https://www.operacni-stredisko.cz/aaos
// @match           https://www.operacni-stredisko.cz/aaos/
// @match           https://policie.operacni-stredisko.cz/aaos
// @match           https://policie.operacni-stredisko.cz/aaos/
// @match           https://www.alarmcentral-spil.dk/aaos
// @match           https://www.alarmcentral-spil.dk/aaos/
// @match           https://politi.alarmcentral-spil.dk/aaos
// @match           https://politi.alarmcentral-spil.dk/aaos/
// @match           https://www.leitstellenspiel.de/aaos
// @match           https://www.leitstellenspiel.de/aaos/
// @match           https://polizei.leitstellenspiel.de/aaos
// @match           https://polizei.leitstellenspiel.de/aaos/
// @match           https://www.missionchief-australia.com/aaos
// @match           https://www.missionchief-australia.com/aaos/
// @match           https://police.missionchief-australia.com/aaos
// @match           https://police.missionchief-australia.com/aaos/
// @match           https://www.missionchief.co.uk/aaos
// @match           https://www.missionchief.co.uk/aaos/
// @match           https://police.missionchief.co.uk/aaos
// @match           https://police.missionchief.co.uk/aaos/
// @match           https://www.missionchief.com/aaos
// @match           https://www.missionchief.com/aaos/
// @match           https://police.missionchief.com/aaos
// @match           https://police.missionchief.com/aaos/
// @match           https://www.centro-de-mando.es/aaos
// @match           https://www.centro-de-mando.es/aaos/
// @match           https://www.centro-de-mando.mx/aaos
// @match           https://www.centro-de-mando.mx/aaos/
// @match           https://www.hatakeskuspeli.com/aaos
// @match           https://www.hatakeskuspeli.com/aaos/
// @match           https://poliisi.hatakeskuspeli.com/aaos
// @match           https://poliisi.hatakeskuspeli.com/aaos/
// @match           https://www.operateur112.fr/aaos
// @match           https://www.operateur112.fr/aaos/
// @match           https://police.operateur112.fr/aaos
// @match           https://police.operateur112.fr/aaos/
// @match           https://www.operatore112.it/aaos
// @match           https://www.operatore112.it/aaos/
// @match           https://polizia.operatore112.it/aaos
// @match           https://polizia.operatore112.it/aaos/
// @match           https://www.missionchief-japan.com/aaos
// @match           https://www.missionchief-japan.com/aaos/
// @match           https://www.missionchief-korea.com/aaos
// @match           https://www.missionchief-korea.com/aaos/
// @match           https://www.nodsentralspillet.com/aaos
// @match           https://www.nodsentralspillet.com/aaos/
// @match           https://politiet.nodsentralspillet.com/aaos
// @match           https://politiet.nodsentralspillet.com/aaos/
// @match           https://www.meldkamerspel.com/aaos
// @match           https://www.meldkamerspel.com/aaos/
// @match           https://politie.meldkamerspel.com/aaos
// @match           https://politie.meldkamerspel.com/aaos/
// @match           https://www.operatorratunkowy.pl/aaos
// @match           https://www.operatorratunkowy.pl/aaos/
// @match           https://policja.operatorratunkowy.pl/aaos
// @match           https://policja.operatorratunkowy.pl/aaos/
// @match           https://www.operador193.com/aaos
// @match           https://www.operador193.com/aaos/
// @match           https://www.jogo-operador112.com/aaos
// @match           https://www.jogo-operador112.com/aaos/
// @match           https://policia.jogo-operador112.com/aaos
// @match           https://policia.jogo-operador112.com/aaos/
// @match           https://www.jocdispecerat112.com/aaos
// @match           https://www.jocdispecerat112.com/aaos/
// @match           https://www.dispetcher112.ru/aaos
// @match           https://www.dispetcher112.ru/aaos/
// @match           https://www.dispecerske-centrum.com/aaos
// @match           https://www.dispecerske-centrum.com/aaos/
// @match           https://www.larmcentralen-spelet.se/aaos
// @match           https://www.larmcentralen-spelet.se/aaos/
// @match           https://polis.larmcentralen-spelet.se/aaos
// @match           https://polis.larmcentralen-spelet.se/aaos/
// @match           https://www.112-merkez.com/aaos
// @match           https://www.112-merkez.com/aaos/
// @match           https://www.dyspetcher101-game.com/aaos
// @match           https://www.dyspetcher101-game.com/aaos/
// @run-at          document-idle
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name AAO Finder
 * @name:de AAO Finder
 * @description Find all ARRs that contain a certain requirement.
 * @description:de Finde alle AAOs, die eine bestimmte Anforderung enthalten.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/25194-script-aao-finder-finde-aaos-die-bestimmte-anforderungen-enthalten/
 * @match /aaos
 * @match /aaos/
 * @grant GM_addStyle
 */

/**
 * get a document from an url
 * @param {string} url
 * @returns {Promise<Document>} The document for this url
 */
const getDoc = url =>
    fetch(url)
        .then(res => res.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'));

/**
 * read the available AAO categories and requirements for each AAO
 * @returns {Promise<Record<string, Record<string, string>>>}
 */
const getPossibleAAORequirements = () =>
    new Promise((resolve, reject) => {
        const aaoEditLink = document.querySelector(
            '.aao_btn_group > a[href^="/aaos/"][href$="/edit"]'
        )?.href;
        if (!aaoEditLink) reject();
        getDoc(aaoEditLink)
            .then(doc => [
                doc,
                Array.from(doc.querySelectorAll('#tabs > li > a')),
            ])
            .then(([doc, tabs]) =>
                tabs.map(tab => [
                    tab.textContent.trim(),
                    Object.fromEntries(
                        Array.from(
                            doc.querySelectorAll(
                                `${tab.getAttribute('href')} .form-group`
                            )
                        ).map(req => [
                            req.querySelector('input')?.name,
                            req.querySelector('label')?.textContent.trim(),
                        ])
                    ),
                ])
            )
            .then(tabs => Object.fromEntries(tabs))
            .then(resolve);
    });

/**
 * get all the set requirements per AAO from the API
 * @returns {Promise<Record<string, Record<string, number>>>}
 */
const getAAORequirements = () =>
    fetch('/api/v1/aaos')
        .then(res => res.json())
        .then(aaos =>
            aaos.map(
                ({
                    id,
                    vehicle_classes,
                    vehicle_types,
                    vehicle_type_captions,
                }) => [
                    id.toString(),
                    Object.fromEntries([
                        ...Object.entries(vehicle_classes ?? {}).map(
                            ([key, amount]) => [`aao[${key}]`, amount]
                        ),
                        ...Object.entries(vehicle_types ?? {}).map(
                            ([id, amount]) => [
                                `vehicle_type_ids[${id}]`,
                                amount,
                            ]
                        ),
                        ...Object.entries(vehicle_type_captions ?? {}).map(
                            ([caption, amount]) => [
                                `vehicle_type_caption[${caption}]`,
                                amount,
                            ]
                        ),
                    ]),
                ]
            )
        )
        .then(Object.fromEntries);

(() => {
    const select = document.createElement('select');
    select.classList.add('btn');

    const none = document.createElement('option');
    none.value = '';
    none.textContent = '';
    select.add(none);

    GM_addStyle(`
.aao_btn_group[data-amount]::after {
    content: "\xa0("attr(data-amount)")";
}

`);

    const style = document.createElement('style');
    document.head.append(style);

    Promise.all([getPossibleAAORequirements(), getAAORequirements()]).then(
        ([tabs, reqs]) => {
            Object.entries(tabs).forEach(([tab, tabReqs]) => {
                const group = document.createElement('optgroup');
                group.label = tab;

                Object.entries(tabReqs).forEach(([tabReq, label]) => {
                    const option = document.createElement('option');
                    option.value = tabReq;
                    option.textContent = `${label}\xa0(${Object.values(reqs)
                        .filter(req => tabReq in req)
                        .length.toLocaleString()})`;
                    group.append(option);
                });

                select.add(group);
            });

            select.addEventListener('change', () => {
                const matchingIds = [];
                Object.keys(reqs).forEach(id => {
                    const element = document.querySelector(
                        `.aao_btn_group:has(a[href="/aaos/${id}/edit"])`
                    );

                    if (element && select.value in reqs[id]) {
                        matchingIds.push(id);

                        element.dataset.amount =
                            reqs[id][select.value].toLocaleString();
                    } else {
                        delete element?.dataset.amount;
                    }
                });
                if (matchingIds.length === 0) {
                    style.textContent = '';
                    return;
                }
                style.textContent = `.aao_btn_group:not(:has(${matchingIds
                    .map(id => `a[href="/aaos/${id}/edit"]`)
                    .join(',')})) {filter: grayscale(0.75) !important;}`;
            });

            document
                .querySelector('.page-header .btn-group.pull-right')
                .prepend(select);
        }
    );
})();
