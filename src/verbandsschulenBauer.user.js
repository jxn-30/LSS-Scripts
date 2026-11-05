// ==UserScript==
// @name         LSS Verbandsschulen
// @description  Helfer beim Bauen von Verbandsschulen
// @version      1.0.0
// @author       Jan (jxn_30)
// @match        https://www.leitstellenspiel.de/
// @match        https://www.leitstellenspiel.de/?mapview=true
// @namespace    https://jxn.lss-manager.de/
// @downloadURL  https://lfvbw.ledbrain.de/verbandsschulen.user.js
// @updateURL    https://lfvbw.ledbrain.de/verbandsschulen.user.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

/**
 * @name Verbandsschulen
 * @description Helfer beim Bauen von Verbandsschulen
 * @locale de_DE
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

const getNextNValues = (type, startNth, amount) => {
    if (!(type in schools)) return;
    const [lat, kuerzel] = schools[type];
    const nths = new Array(amount).fill(startNth).map((n, i) => n + i);

    const token = document.querySelector('meta[name="csrf-token"]').content;

    const bodies = nths.map(nth =>
        new URLSearchParams({
            'utf8': '✓',
            'authenticity_token': token,
            'building[building_type]': type.toString(),
            'building[name]': `[VB] ${kuerzel}-Schule ${nth.toString().padStart(4, 0)}`,
            'building[latitude]': lat.toString(),
            'building[longitude]': getLng(nth),
            'build_with_coins': '',
            'build_as_alliance': '1',
            'building[address]': 'Buchhaldenwasensträßchen, 71384 Schnait',
            'building[start_vehicle_feuerwache]': '',
            'building[start_vehicle_feuerwache_kleinwache]': '',
            'build_another': 'on',
        }).toString()
    );

    return bodies;
};

const createMultipleBtn = (type, startNth, amount) => {
    const build25Btn = document.createElement('span');
    build25Btn.id = `build_${amount}_schools`;
    build25Btn.classList.add('btn', 'btn-success');
    build25Btn.textContent = `${amount} bauen`;
    build25Btn.addEventListener('click', async e => {
        e.preventDefault();

        const bodies = getNextNValues(type, startNth, amount);
        for (const i in bodies) {
            if (!bodies.hasOwnProperty(i)) continue;
            const body = bodies[i];
            console.log(`Will ${i}/${amount - 1}`);
            await fetch('https://www.leitstellenspiel.de/buildings', {
                credentials: 'include',
                headers: {
                    'Accept': '*/*',
                    'Accept-Language': 'de-DE,en-US;q=0.9,en;q=0.8',
                    'Content-Type':
                        'application/x-www-form-urlencoded; charset=UTF-8',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Sec-GPC': '1',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'Priority': 'u=0',
                },
                referrer: 'https://www.leitstellenspiel.de/',
                body,
                method: 'POST',
                mode: 'cors',
            });
            console.log(`Done ${i}/${amount - 1}`);
        }

        document.querySelector('#building_back_button').click();
    });

    // eslint-disable-next-line no-unused-expressions
    document.getElementById(build25Btn.id)?.replaceWith(build25Btn) ??
        document.querySelector('#address_forms')?.after(build25Btn);
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

    createMultipleBtn(type, nth, 5);
    createMultipleBtn(type, nth, 25);
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
for (const school in schools) {
    if (!schools.hasOwnProperty(school)) continue;
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
