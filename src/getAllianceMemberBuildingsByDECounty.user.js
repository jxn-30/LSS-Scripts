// ==UserScript==
// @name            [LSS] get buildings of Alliance-Members by german county
// @name:de         [LSS] Verbandsmitgliedergebäude nach Kreis
// @namespace       https://jxn.lss-manager.de
// @version         2023.01.25+2153
// @author          Jan (jxn_30)
// @description     This script summarizes how many buildings of each type the alliance members have in each german county.
// @description:de  Dieses Script fasst zusammen, wie viele Gebäude jeder Art die Verbandsmitglieder in jedem Stadt-/Landkreis haben.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/getAllianceMemberBuildingsByDECounty.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/getAllianceMemberBuildingsByDECounty.user.js
// @supportURL      https://github.com/jxn-30/LSS-Scripts
// @match           https://www.leitstellenspiel.de/
// @match           https://polizei.leitstellenspiel.de/
// @run-at          document-idle
// ==/UserScript==

/**
 * @name  get buildings of Alliance-Members by german county
 * @name:de Verbandsmitgliedergebäude nach Kreis
 * @description This script summarizes how many buildings of each type the alliance members have in each german county.
 * @description:de Dieses Script fasst zusammen, wie viele Gebäude jeder Art die Verbandsmitglieder in jedem Stadt-/Landkreis haben.
 * @match /
 * @locale de_DE
 */

/* ⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️
 * This script will make a server request for EACH alliance member.
 * It will take a while to finish and may cause your browser/PC to slow down if there is a lot of data to process.
 * The script is not yet optimized for performance.
 * Results will be downloaded in CSV format.
 * === USAGE ===
 * run getAllAllianceMemberBuildingLocations() in the console (F12 → console).
 * The script will now and then log the progress of fetching buildings.
 */

const getBuildingTypes = () =>
    fetch(`https://api.lss-manager.de/${window.I18n.locale}/buildings`).then(
        res => res.json()
    );

const getCountyBorders = () =>
    fetch(
        'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/4_kreise/4_niedrig.geo.json'
    )
        .then(res => res.json())
        .then(({ features }) => features);

const parseBuildings = doc => {
    return Array.from(doc.scripts)
        .flatMap(script =>
            script.textContent?.match(
                /(?<=buildingMarkerAdd\()\{(?:"[^"]*":(?:\d+(?:\.\d+)?|".*?"),?)+\}(?=\);)/gu
            )
        )
        .filter(b => !!b)
        .map(b => JSON.parse(b));
};

const getProfileBuildings = id =>
    fetch(`/profile/${id}`)
        .then(res => res.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'))
        .then(parseBuildings);

const getAllBuildings = async () => {
    const allBuildings = [];
    const users = await fetch('/api/allianceinfo')
        .then(res => res.json())
        .then(({ users }) => users.map(({ id }) => id));
    const amount = users.length;
    let counter = 0;
    for (const user of users) {
        counter++;
        if (counter % 10 === 0) {
            console.log(
                `${counter} / ${amount} => ${((counter / amount) * 100).toFixed(
                    2
                )}%`
            );
            break;
        }
        await Promise.all([
            getProfileBuildings(user).then(buildings =>
                allBuildings.push(...buildings)
            ),
            new Promise(resolve => setTimeout(resolve, 100)),
        ]);
    }
    return allBuildings;
};

const downloadData = ([types, data]) => {
    console.log(`Now downloading the results!`);
    console.log(data);
    const buildingTypes = Object.values(types)
        .map(({ caption }) => caption)
        .sort();
    const a = document.createElement('a');
    a.download = 'alliance_member_buildings.csv';
    a.href = `data:application/csv;charset=utf-8,${encodeURIComponent(
        `Bundesland,Kreis,${buildingTypes.join(',')}\n${Object.entries(data)
            .sort()
            .map(
                ([Kreis, buildings]) =>
                    `${Kreis.split(' - ').join(',')},${buildingTypes
                        .map(type => buildings[type] ?? 0)
                        .join(',')}`
            )
            .join('\n')}`
    )}`;
    a.click();
};

const getCoordinatesOfCounty = geometry => {
    if (geometry.length === 1) return geometry[0];
    return geometry.flatMap(c => [...c, c[0], [0, 0]]);
};

const pointInsidePolygon = ([lat, long], polygon) => {
    // ray-casting algorithm based on
    // https://wrfranklin.org/Research/Short_Notes/pnpoly.html

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        if (
            yi > lat !== yj > lat &&
            long < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
        ) {
            inside = !inside;
        }
    }

    return inside;
};

window.getAllAllianceMemberBuildingLocations = async () =>
    Promise.all([getBuildingTypes(), getAllBuildings()])
        .then(([types, buildings]) => [
            types,
            buildings.map(({ building_type, latitude, longitude }) => ({
                type: types[building_type].caption,
                location: [latitude, longitude],
            })),
        ])
        .then(([types, buildings]) => {
            console.log(
                `There are ${buildings.length} buildings in this alliance! Now reducing the data to counties.`
            );
            return [types, buildings];
        })
        .then(([types, buildings]) =>
            Promise.all([types, buildings, getCountyBorders()])
        )
        .then(([types, buildings, countyBorders]) => {
            const counties = {};
            console.log(countyBorders);
            buildings.forEach(({ type: buildingType, location }) => {
                const county = countyBorders.find(
                    ({ geometry: { coordinates } }) =>
                        pointInsidePolygon(
                            location,
                            getCoordinatesOfCounty(coordinates)
                        )
                );
                if (!county) return;
                const countyName = `${county.properties.NAME_1} - ${county.properties.NAME_3}`;
                counties[countyName] ??= {};
                counties[countyName][buildingType] ??= 0;
                counties[countyName][buildingType]++;
            });
            return [types, counties];
        })
        .then(downloadData);
