// ==UserScript==
// @name            [LSS] Vehicle Type in Zug-Editor
// @name:de         [LSS] Fahrzeugtypen im Zug-Editor
// @namespace       https://jxn.lss-manager.de
// @version         2025.11.20+1358
// @author          Jan (jxn_30)
// @description     Shows the type of each vehicle in the Zug-Editor
// @description:de  Zeigt die Fahrzeugtypen im Zug-Editor an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/vehicleTypeInZugEditor.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/vehicleTypeInZugEditor.user.js
// @supportURL      https://github.com/jxn-30/LSS-Scripts
// @match           https://www.operacni-stredisko.cz/vehicle_groups/*/edit
// @match           https://www.operacni-stredisko.cz/vehicle_groups/new
// @match           https://policie.operacni-stredisko.cz/vehicle_groups/*/edit
// @match           https://policie.operacni-stredisko.cz/vehicle_groups/new
// @match           https://www.alarmcentral-spil.dk/vehicle_groups/*/edit
// @match           https://www.alarmcentral-spil.dk/vehicle_groups/new
// @match           https://politi.alarmcentral-spil.dk/vehicle_groups/*/edit
// @match           https://politi.alarmcentral-spil.dk/vehicle_groups/new
// @match           https://www.leitstellenspiel.de/vehicle_groups/*/edit
// @match           https://www.leitstellenspiel.de/vehicle_groups/new
// @match           https://polizei.leitstellenspiel.de/vehicle_groups/*/edit
// @match           https://polizei.leitstellenspiel.de/vehicle_groups/new
// @match           https://www.missionchief-australia.com/vehicle_groups/*/edit
// @match           https://www.missionchief-australia.com/vehicle_groups/new
// @match           https://police.missionchief-australia.com/vehicle_groups/*/edit
// @match           https://police.missionchief-australia.com/vehicle_groups/new
// @match           https://www.missionchief.co.uk/vehicle_groups/*/edit
// @match           https://www.missionchief.co.uk/vehicle_groups/new
// @match           https://police.missionchief.co.uk/vehicle_groups/*/edit
// @match           https://police.missionchief.co.uk/vehicle_groups/new
// @match           https://www.missionchief.com/vehicle_groups/*/edit
// @match           https://www.missionchief.com/vehicle_groups/new
// @match           https://police.missionchief.com/vehicle_groups/*/edit
// @match           https://police.missionchief.com/vehicle_groups/new
// @match           https://www.centro-de-mando.es/vehicle_groups/*/edit
// @match           https://www.centro-de-mando.es/vehicle_groups/new
// @match           https://www.centro-de-mando.mx/vehicle_groups/*/edit
// @match           https://www.centro-de-mando.mx/vehicle_groups/new
// @match           https://www.hatakeskuspeli.com/vehicle_groups/*/edit
// @match           https://www.hatakeskuspeli.com/vehicle_groups/new
// @match           https://poliisi.hatakeskuspeli.com/vehicle_groups/*/edit
// @match           https://poliisi.hatakeskuspeli.com/vehicle_groups/new
// @match           https://www.operateur112.fr/vehicle_groups/*/edit
// @match           https://www.operateur112.fr/vehicle_groups/new
// @match           https://police.operateur112.fr/vehicle_groups/*/edit
// @match           https://police.operateur112.fr/vehicle_groups/new
// @match           https://www.operatore112.it/vehicle_groups/*/edit
// @match           https://www.operatore112.it/vehicle_groups/new
// @match           https://polizia.operatore112.it/vehicle_groups/*/edit
// @match           https://polizia.operatore112.it/vehicle_groups/new
// @match           https://www.missionchief-japan.com/vehicle_groups/*/edit
// @match           https://www.missionchief-japan.com/vehicle_groups/new
// @match           https://www.missionchief-korea.com/vehicle_groups/*/edit
// @match           https://www.missionchief-korea.com/vehicle_groups/new
// @match           https://www.nodsentralspillet.com/vehicle_groups/*/edit
// @match           https://www.nodsentralspillet.com/vehicle_groups/new
// @match           https://politiet.nodsentralspillet.com/vehicle_groups/*/edit
// @match           https://politiet.nodsentralspillet.com/vehicle_groups/new
// @match           https://www.meldkamerspel.com/vehicle_groups/*/edit
// @match           https://www.meldkamerspel.com/vehicle_groups/new
// @match           https://politie.meldkamerspel.com/vehicle_groups/*/edit
// @match           https://politie.meldkamerspel.com/vehicle_groups/new
// @match           https://www.operatorratunkowy.pl/vehicle_groups/*/edit
// @match           https://www.operatorratunkowy.pl/vehicle_groups/new
// @match           https://policja.operatorratunkowy.pl/vehicle_groups/*/edit
// @match           https://policja.operatorratunkowy.pl/vehicle_groups/new
// @match           https://www.operador193.com/vehicle_groups/*/edit
// @match           https://www.operador193.com/vehicle_groups/new
// @match           https://www.jogo-operador112.com/vehicle_groups/*/edit
// @match           https://www.jogo-operador112.com/vehicle_groups/new
// @match           https://policia.jogo-operador112.com/vehicle_groups/*/edit
// @match           https://policia.jogo-operador112.com/vehicle_groups/new
// @match           https://www.jocdispecerat112.com/vehicle_groups/*/edit
// @match           https://www.jocdispecerat112.com/vehicle_groups/new
// @match           https://www.dispetcher112.ru/vehicle_groups/*/edit
// @match           https://www.dispetcher112.ru/vehicle_groups/new
// @match           https://www.dispecerske-centrum.com/vehicle_groups/*/edit
// @match           https://www.dispecerske-centrum.com/vehicle_groups/new
// @match           https://www.larmcentralen-spelet.se/vehicle_groups/*/edit
// @match           https://www.larmcentralen-spelet.se/vehicle_groups/new
// @match           https://polis.larmcentralen-spelet.se/vehicle_groups/*/edit
// @match           https://polis.larmcentralen-spelet.se/vehicle_groups/new
// @match           https://www.112-merkez.com/vehicle_groups/*/edit
// @match           https://www.112-merkez.com/vehicle_groups/new
// @match           https://www.dyspetcher101-game.com/vehicle_groups/*/edit
// @match           https://www.dyspetcher101-game.com/vehicle_groups/new
// @require         https://raw.githubusercontent.com/LUFSI/framework/refs/heads/main/src/SharedAPIStorage.js
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Vehicle Type in Zug-Editor
 * @name:de Fahrzeugtypen im Zug-Editor
 * @description Shows the type of each vehicle in the Zug-Editor
 * @description:de Zeigt die Fahrzeugtypen im Zug-Editor an
 * @match /vehicle_groups/*\/edit
 * @match /vehicle_groups/new
 * @lufsi SharedAPIStorage
 */

/* global sharedAPIStorage, I18n */

const loadingSpan = document.createElement('span');

(() =>
    document
        .querySelector('.vehicle_group_vehicles .col-sm-9')
        ?.prepend(loadingSpan))();

const tryFetching = () => {
    loadingSpan.textContent = `⏳️`;

    window
        .fetch(`https://api.lss-manager.de/${I18n.locale}/vehicles`)
        .then(res => res.json())
        .then(types =>
            sharedAPIStorage.getVehicles(undefined, vehicles =>
                vehicles.forEach(
                    ({ id, vehicle_type, vehicle_type_caption }) => {
                        const span = document.createElement('span');
                        span.id = `vehicle_type_span_${id}`;
                        span.innerHTML = `&nbsp;<a class="btn btn-default btn-xs disabled">${types[vehicle_type].caption}</a>`;
                        if (vehicle_type_caption) {
                            span.innerHTML += `&nbsp;<a class="btn btn-default btn-xs disabled">${vehicle_type_caption}</a>`;
                        }
                        document.getElementById(span.id)?.remove();
                        document
                            .getElementById(`vehicle_group_vehicle_ids_${id}`)
                            ?.parentElement?.append(span);
                    }
                )
            )
        )
        .then(() => loadingSpan.remove())
        .catch(() => {
            loadingSpan.textContent = '❌';
            setTimeout(tryFetching, 10_000);
        });
};

tryFetching();
