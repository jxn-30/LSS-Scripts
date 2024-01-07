// ==UserScript==
// @name            [LSS] Custom Vehicle Types Listing
// @name:de         [LSS] Auflistung eigener Fahrzeugtypen
// @namespace       https://jxn.lss-manager.de
// @version         2022.11.27+1138
// @author          Jan (jxn_30)
// @description     Lists own vehicle types grouped by their station
// @description:de  Listet eigene Fahrzeugtypen nach Wache gruppiert auf
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/customVehicleTypesListing.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/customVehicleTypesListing.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/640-sammelthread-f%C3%BCr-einfache-fragen-und-antworten/&postID=467115#post467115
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
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Custom Vehicle Types Listing
 * @name:de Auflistung eigener Fahrzeugtypen
 * @description Lists own vehicle types grouped by their station
 * @description:de Listet eigene Fahrzeugtypen nach Wache gruppiert auf
 * @forum https://forum.leitstellenspiel.de/index.php?thread/640-sammelthread-f%C3%BCr-einfache-fragen-und-antworten/&postID=467115#post467115
 * @match /
 * @grant GM_addStyle
 */

const openListLink = document.createElement('a');
openListLink.href = '#';
openListLink.textContent = 'eigene Fahrzeugtypen';

const modal = document.createElement('div');
modal.id = 'jxn-cvtl-modal';
modal.classList.add('hidden');
document.body.append(modal);

modal.content = document.createElement('div');

modal.close = document.createElement('span');
modal.close.classList.add('close');
modal.close.textContent = '×';
modal.append(modal.close, modal.content);

modal.close.addEventListener('click', () => modal.classList.add('hidden'));

openListLink.addEventListener('click', e => {
    e.preventDefault();
    fetch('/api/vehicles')
        .then(res => res.json())
        .then(v => v.filter(({ vehicle_type_caption }) => vehicle_type_caption))
        .then(v => {
            const buildings = {};
            v.forEach(vehicle => {
                if (!('building_id' in vehicle)) return;
                buildings[vehicle.building_id] = {
                    name: '',
                    vehicles: [],
                    ...buildings[vehicle.building_id],
                };
                buildings[vehicle.building_id].vehicles.push(vehicle);
            });
            return buildings;
        })
        .then(b =>
            fetch('/api/buildings')
                .then(res => res.json())
                .then(buildings =>
                    Object.fromEntries(
                        Object.entries(b).map(([id, b]) => [
                            id,
                            {
                                ...b,
                                name: buildings.find(
                                    bu => bu.id.toString() === id
                                )?.caption,
                            },
                        ])
                    )
                )
        )
        .then(buildings => {
            modal.classList.remove('hidden');
            modal.content.innerHTML = '';
            Object.entries(buildings)
                .sort(([, { name: nameA }], [, { name: nameB }]) =>
                    nameA.localeCompare(nameB)
                )
                .forEach(([id, { name, vehicles }]) => {
                    const building = document.createElement('details');
                    const summary = document.createElement('summary');
                    summary.textContent = name;
                    const buildingBtn = document.createElement('a');
                    buildingBtn.href = `/buildings/${id}`;
                    buildingBtn.classList.add(
                        'lightbox-open',
                        'btn',
                        'btn-xs',
                        'btn-default',
                        'glyphicon',
                        'glyphicon-new-window'
                    );

                    const vehicleList = document.createElement('ul');
                    vehicles
                        .sort(({ caption: nameA }, { caption: nameB }) =>
                            nameA.localeCompare(nameB)
                        )
                        .forEach(({ caption, id, vehicle_type_caption }) => {
                            const item = document.createElement('li');
                            const link = document.createElement('a');
                            link.href = `/vehicles/${id}`;
                            link.textContent = caption;
                            item.append(
                                `[${vehicle_type_caption}]`,
                                '\xa0',
                                link
                            );
                            vehicleList.append(item);
                        });

                    summary.append('\xa0', buildingBtn);
                    building.append(summary, vehicleList);

                    modal.content.append(building);
                });
        });
});

const openListLi = document.createElement('li');
openListLi.append(openListLink);

document
    .querySelector('#menu_profile + .dropdown-menu > li.divider')
    ?.before(openListLi);

GM_addStyle(`
#${modal.id} {
    position: fixed;
    top: 1em;
    margin: auto;
    z-index: 5000;
    background-color: #fafafa;
    padding: 1em;
    max-height: calc(100vh - 2em);
    overflow: auto;
    max-width: calc(100% - 2em);
    left: 1em;
    border: 1px solid black;
    border-radius: 10px;
}
body.dark #${modal.id} {
    background-color: #505050;
}
body.dark #${modal.id} .close {
    color: white;
}
#${modal.id} details summary {
    cursor: pointer;
}
#${modal.id} details summary::before {
    content: "▶";
    display: inline-block;
    margin-right: 5px;
}
#${modal.id} details[open] summary::before {
    transform: rotate(90deg);
}
`);
