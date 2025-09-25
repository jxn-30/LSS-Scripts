// ==UserScript==
// @name         [LSS] Verbandsschulen
// @namespace    https://jxn.lss-manager.de
// @version      2025.09.25+1206
// @author       Jan (jxn_30)
// @description  Helfer beim Bauen von Verbandsschulen
// @homepage     https://github.com/jxn-30/LSS-Scripts
// @homepageURL  https://github.com/jxn-30/LSS-Scripts
// @icon         https://www.leitstellenspiel.de/favicon.ico
// @updateURL    https://github.com/jxn-30/LSS-Scripts/raw/master/src/verbandsschulenBauer.user.js
// @downloadURL  https://github.com/jxn-30/LSS-Scripts/raw/master/src/verbandsschulenBauer.user.js
// @supportURL   https://github.com/jxn-30/LSS-Scripts
// @match        https://www.operacni-stredisko.cz/
// @match        https://www.operacni-stredisko.cz/?mapview=true
// @match        https://policie.operacni-stredisko.cz/
// @match        https://policie.operacni-stredisko.cz/?mapview=true
// @match        https://www.alarmcentral-spil.dk/
// @match        https://www.alarmcentral-spil.dk/?mapview=true
// @match        https://politi.alarmcentral-spil.dk/
// @match        https://politi.alarmcentral-spil.dk/?mapview=true
// @match        https://www.leitstellenspiel.de/
// @match        https://www.leitstellenspiel.de/?mapview=true
// @match        https://polizei.leitstellenspiel.de/
// @match        https://polizei.leitstellenspiel.de/?mapview=true
// @match        https://www.missionchief-australia.com/
// @match        https://www.missionchief-australia.com/?mapview=true
// @match        https://police.missionchief-australia.com/
// @match        https://police.missionchief-australia.com/?mapview=true
// @match        https://www.missionchief.co.uk/
// @match        https://www.missionchief.co.uk/?mapview=true
// @match        https://police.missionchief.co.uk/
// @match        https://police.missionchief.co.uk/?mapview=true
// @match        https://www.missionchief.com/
// @match        https://www.missionchief.com/?mapview=true
// @match        https://police.missionchief.com/
// @match        https://police.missionchief.com/?mapview=true
// @match        https://www.centro-de-mando.es/
// @match        https://www.centro-de-mando.es/?mapview=true
// @match        https://www.centro-de-mando.mx/
// @match        https://www.centro-de-mando.mx/?mapview=true
// @match        https://www.hatakeskuspeli.com/
// @match        https://www.hatakeskuspeli.com/?mapview=true
// @match        https://poliisi.hatakeskuspeli.com/
// @match        https://poliisi.hatakeskuspeli.com/?mapview=true
// @match        https://www.operateur112.fr/
// @match        https://www.operateur112.fr/?mapview=true
// @match        https://police.operateur112.fr/
// @match        https://police.operateur112.fr/?mapview=true
// @match        https://www.operatore112.it/
// @match        https://www.operatore112.it/?mapview=true
// @match        https://polizia.operatore112.it/
// @match        https://polizia.operatore112.it/?mapview=true
// @match        https://www.missionchief-japan.com/
// @match        https://www.missionchief-japan.com/?mapview=true
// @match        https://www.missionchief-korea.com/
// @match        https://www.missionchief-korea.com/?mapview=true
// @match        https://www.nodsentralspillet.com/
// @match        https://www.nodsentralspillet.com/?mapview=true
// @match        https://politiet.nodsentralspillet.com/
// @match        https://politiet.nodsentralspillet.com/?mapview=true
// @match        https://www.meldkamerspel.com/
// @match        https://www.meldkamerspel.com/?mapview=true
// @match        https://politie.meldkamerspel.com/
// @match        https://politie.meldkamerspel.com/?mapview=true
// @match        https://www.operatorratunkowy.pl/
// @match        https://www.operatorratunkowy.pl/?mapview=true
// @match        https://policja.operatorratunkowy.pl/
// @match        https://policja.operatorratunkowy.pl/?mapview=true
// @match        https://www.operador193.com/
// @match        https://www.operador193.com/?mapview=true
// @match        https://www.jogo-operador112.com/
// @match        https://www.jogo-operador112.com/?mapview=true
// @match        https://policia.jogo-operador112.com/
// @match        https://policia.jogo-operador112.com/?mapview=true
// @match        https://www.jocdispecerat112.com/
// @match        https://www.jocdispecerat112.com/?mapview=true
// @match        https://www.dispetcher112.ru/
// @match        https://www.dispetcher112.ru/?mapview=true
// @match        https://www.dispecerske-centrum.com/
// @match        https://www.dispecerske-centrum.com/?mapview=true
// @match        https://www.larmcentralen-spelet.se/
// @match        https://www.larmcentralen-spelet.se/?mapview=true
// @match        https://polis.larmcentralen-spelet.se/
// @match        https://polis.larmcentralen-spelet.se/?mapview=true
// @match        https://www.112-merkez.com/
// @match        https://www.112-merkez.com/?mapview=true
// @match        https://www.dyspetcher101-game.com/
// @match        https://www.dyspetcher101-game.com/?mapview=true
// @run-at       document-idle
// ==/UserScript==

/**
 * @name Verbandsschulen
 * @description Helfer beim Bauen von Verbandsschulen
 * @match /
 * @match /?mapview=true
 */

/* global L, map */

const schools = {
    1: [48.77893083707631, 'FW', 500],
    3: [48.77865510868873, 'RD', 1_000],
    8: [48.7783793787866, 'POL', 10_000],
    10: [48.778089507256404, 'THW', 100_000],
    27: [48.77779963405229, 'SEE', 1_000_000],
};

const baseLng = 9.183304309844972;
const lngStep = 0.000278949737549;

const getLng = n => {
    const lng = baseLng + lngStep * n;
    return lng > 180 ? lng - 360 : lng;
};

const setMarkerAndName = (type, nth) => {
    if (!(type in schools)) return;
    const [lat, kuerzel] = schools[type];
    const lng = getLng(nth);
    unsafeWindow.building_new_marker.setLatLng([lat, lng]);
    document.querySelector('#building_latitude').value = lat;
    document.querySelector('#building_longitude').value = lng;
    document.querySelector('#building_name').value =
        `[VB] ${kuerzel}-Schule ${nth.toString().padStart(4, 0)}`;
};

GM_addStyle(`
#building_new_info_message,
#select_building_dispatch_center_step,
.building_build_costs .build_with_credits_step,
.building_build_costs .coins_activate {
    display: none !important;
}
`);

const buildingsElement = document.querySelector('#buildings');

if (buildingsElement) {
    new MutationObserver(mutations => {
        let manipulated = false;
        mutations.forEach(mutation => {
            const form = mutation.target.querySelector(
                '#new_building[action="/buildings"]'
            );
            if (!form || manipulated) return;
            // remove non-school select options
            Array.from(form.querySelectorAll('#building_building_type option'))
                .filter(option => !(option.value in schools))
                .forEach(option => option.remove());

            const select = form.querySelector('#building_building_type');
            if (!select) return;

            manipulated = true;

            select.addEventListener('change', () => {
                form.querySelectorAll('.alliance_activate').forEach(
                    el => (el.disabled = true)
                );
                fetch(`/api/alliance_buildings?time=${Date.now()}`)
                    .then(res => res.json())
                    .then(
                        buildings =>
                            buildings.filter(
                                ({ building_type }) =>
                                    building_type === parseInt(select.value)
                            ).length
                    )
                    .then(amount => setMarkerAndName(select.value, amount + 1))
                    .then(() =>
                        form
                            .querySelectorAll('.alliance_activate')
                            .forEach(el => (el.disabled = false))
                    );
            });

            select.dispatchEvent(new Event('change'));
        });
    }).observe(buildingsElement, { childList: true });
}

const randomColor = () =>
    `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')}`;
const onceAround = 360 / lngStep;
// eslint-disable-next-line guard-for-in
for (const school in schools) {
    const [lat, _, step] = schools[school];
    for (let i = step; i < onceAround; i += step) {
        const color = randomColor();
        const startLng = getLng(i - step);
        const endLng = getLng(i);
        const tooltip = `${(i - step).toLocaleString()} - ${i.toLocaleString()}`;
        if (endLng < startLng) {
            L.polyline(
                [
                    [lat, startLng],
                    [lat, 180],
                ],
                { color }
            )
                .bindTooltip(tooltip, { sticky: true })
                .addTo(map);
            L.polyline(
                [
                    [lat, -180],
                    [lat, endLng],
                ],
                { color }
            )
                .bindTooltip(tooltip, { sticky: true })
                .addTo(map);
        } else {
            L.polyline(
                [
                    [lat, startLng],
                    [lat, endLng],
                ],
                { color }
            )
                .bindTooltip(tooltip, { sticky: true })
                .addTo(map);
        }
    }

    const lastMod = onceAround % step;
    const lastI = onceAround - lastMod;
    const endI = Math.floor(onceAround);
    const startLng = getLng(lastI);
    const endLng = getLng(endI);
    const tooltip = `${lastI.toLocaleString()} - ${endI.toLocaleString()}`;
    const color = randomColor();
    L.polyline(
        [
            [lat, startLng],
            [lat, endLng],
        ],
        { color }
    )
        .bindTooltip(tooltip, { sticky: true })
        .addTo(map);
}
