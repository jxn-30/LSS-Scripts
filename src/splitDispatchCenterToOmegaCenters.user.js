// ==UserScript==
// @name         [LSS] Split Dispatch Center to Ω dispatch centers
// @namespace    https://jxn.lss-manager.de
// @version      2025.01.26+2042
// @author       Jan (jxn_30)
// @description  Moves buildings from one dispatch center to dispatch centers starting their name with Ω.
// @homepage     https://github.com/jxn-30/LSS-Scripts
// @homepageURL  https://github.com/jxn-30/LSS-Scripts
// @icon         https://www.leitstellenspiel.de/favicon.ico
// @updateURL    https://github.com/jxn-30/LSS-Scripts/raw/master/src/splitDispatchCenterToOmegaCenters.user.js
// @downloadURL  https://github.com/jxn-30/LSS-Scripts/raw/master/src/splitDispatchCenterToOmegaCenters.user.js
// @supportURL   https://github.com/jxn-30/LSS-Scripts
// @match        https://www.operacni-stredisko.cz/
// @match        https://policie.operacni-stredisko.cz/
// @match        https://www.alarmcentral-spil.dk/
// @match        https://politi.alarmcentral-spil.dk/
// @match        https://www.leitstellenspiel.de/
// @match        https://polizei.leitstellenspiel.de/
// @match        https://www.missionchief-australia.com/
// @match        https://police.missionchief-australia.com/
// @match        https://www.missionchief.co.uk/
// @match        https://police.missionchief.co.uk/
// @match        https://www.missionchief.com/
// @match        https://police.missionchief.com/
// @match        https://www.centro-de-mando.es/
// @match        https://www.centro-de-mando.mx/
// @match        https://www.hatakeskuspeli.com/
// @match        https://poliisi.hatakeskuspeli.com/
// @match        https://www.operateur112.fr/
// @match        https://police.operateur112.fr/
// @match        https://www.operatore112.it/
// @match        https://polizia.operatore112.it/
// @match        https://www.missionchief-japan.com/
// @match        https://www.missionchief-korea.com/
// @match        https://www.nodsentralspillet.com/
// @match        https://politiet.nodsentralspillet.com/
// @match        https://www.meldkamerspel.com/
// @match        https://politie.meldkamerspel.com/
// @match        https://www.operatorratunkowy.pl/
// @match        https://policja.operatorratunkowy.pl/
// @match        https://www.operador193.com/
// @match        https://www.jogo-operador112.com/
// @match        https://policia.jogo-operador112.com/
// @match        https://www.jocdispecerat112.com/
// @match        https://www.dispetcher112.ru/
// @match        https://www.dispecerske-centrum.com/
// @match        https://www.larmcentralen-spelet.se/
// @match        https://polis.larmcentralen-spelet.se/
// @match        https://www.112-merkez.com/
// @match        https://www.dyspetcher101-game.com/
// @require      https://github.com/jxn-30/LSS-Scripts/raw/master/snippets/SharedAPIStorage.js
// @run-at       document-idle
// @grant        unsafeWindow
// ==/UserScript==

/**
 * @name Split Dispatch Center to Ω dispatch centers
 * @description Moves buildings from one dispatch center to dispatch centers starting their name with Ω.
 * @match /
 * @snippet SharedAPIStorage
 * @grant unsafeWindow
 */

/* global sharedAPIStorage */

unsafeWindow.moveToOmegaDispatchCenters = () =>
    sharedAPIStorage
        .getBuldingsOfType(7)
        .then(dispatchCenters => {
            console.log(
                dispatchCenters
                    .map(({ id, caption }) => `${id}           ${caption}`)
                    .join('\n')
            );
            const id = parseInt(
                prompt(
                    'Bitte gebe die ID der Leitstelle ein, aus der die Gebäude rausgeholt werden sollen: '
                )
            );
            if (isNaN(id)) return 'Das ist keine Zahl!';
            const omegaDispatchCenters = dispatchCenters
                .filter(({ caption }) => caption.startsWith(`[4]`))
                .map(({ id }) => id);
            return sharedAPIStorage
                .getBuildingsOfDispatchCenter(id)
                .then(buildings => ({ buildings, omegaDispatchCenters }));
        })
        .then(async ({ buildings, omegaDispatchCenters }) => {
            const c = omegaDispatchCenters.length;
            let i = 0;
            console.log(
                `Es werden ${buildings.length} Gebäude auf ${c} Leitstellen aufgeteilt.`
            );
            for (const building of buildings) {
                await fetch(
                    `https://www.leitstellenspiel.de/buildings/${building.id}/leitstelle-set/${omegaDispatchCenters[i % c]}`,
                    {
                        credentials: 'include',
                        headers: {
                            'Accept': '*/*',
                            'Accept-Language': 'de-DE,en-US;q=0.7,en;q=0.3',
                            'Sec-GPC': '1',
                            'Sec-Fetch-Dest': 'empty',
                            'Sec-Fetch-Mode': 'cors',
                            'Sec-Fetch-Site': 'same-origin',
                            'Priority': 'u=0',
                            'Cache-Control': 'max-age=0',
                        },
                        referrer: `https://www.leitstellenspiel.de/buildings/${omegaDispatchCenters[i % c]}`,
                        method: 'GET',
                        mode: 'cors',
                    }
                );
                await new Promise(resolve => setTimeout(resolve, 100));
                i++;
                if (i % c === 0) {
                    console.log(`Wir haben ${i} Gebäude geschafft!`);
                }
            }

            console.log('Feddich!');
        });
