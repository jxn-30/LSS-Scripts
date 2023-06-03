// ==UserScript==
// @name            [LSS] ARR Categories Export
// @name:de         [LSS] AAO-Kategorien Export
// @namespace       https://jxn.lss-manager.de
// @version         2023.06.03+1511
// @author          Jan (jxn_30)
// @description     Allows exporting and importing custom ARR Categories
// @description:de  Eigenen AAO-Kategorien in eine Datei exportieren und diese wieder importieren
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/arrCategoriesExport.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/arrCategoriesExport.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/20531-aao-kategorien-exportieren-und-importieren/
// @match           https://www.operacni-stredisko.cz/aao_categorys
// @match           https://policie.operacni-stredisko.cz/aao_categorys
// @match           https://www.alarmcentral-spil.dk/aao_categorys
// @match           https://politi.alarmcentral-spil.dk/aao_categorys
// @match           https://www.leitstellenspiel.de/aao_categorys
// @match           https://polizei.leitstellenspiel.de/aao_categorys
// @match           https://www.missionchief-australia.com/aao_categorys
// @match           https://police.missionchief-australia.com/aao_categorys
// @match           https://www.missionchief.co.uk/aao_categorys
// @match           https://police.missionchief.co.uk/aao_categorys
// @match           https://www.missionchief.com/aao_categorys
// @match           https://police.missionchief.com/aao_categorys
// @match           https://www.centro-de-mando.es/aao_categorys
// @match           https://www.centro-de-mando.mx/aao_categorys
// @match           https://www.hatakeskuspeli.com/aao_categorys
// @match           https://poliisi.hatakeskuspeli.com/aao_categorys
// @match           https://www.operateur112.fr/aao_categorys
// @match           https://police.operateur112.fr/aao_categorys
// @match           https://www.operatore112.it/aao_categorys
// @match           https://polizia.operatore112.it/aao_categorys
// @match           https://www.missionchief-japan.com/aao_categorys
// @match           https://www.missionchief-korea.com/aao_categorys
// @match           https://www.nodsentralspillet.com/aao_categorys
// @match           https://politiet.nodsentralspillet.com/aao_categorys
// @match           https://www.meldkamerspel.com/aao_categorys
// @match           https://politie.meldkamerspel.com/aao_categorys
// @match           https://www.operatorratunkowy.pl/aao_categorys
// @match           https://policja.operatorratunkowy.pl/aao_categorys
// @match           https://www.operador193.com/aao_categorys
// @match           https://www.jogo-operador112.com/aao_categorys
// @match           https://policia.jogo-operador112.com/aao_categorys
// @match           https://www.jocdispecerat112.com/aao_categorys
// @match           https://www.dispetcher112.ru/aao_categorys
// @match           https://www.dispecerske-centrum.com/aao_categorys
// @match           https://www.larmcentralen-spelet.se/aao_categorys
// @match           https://polis.larmcentralen-spelet.se/aao_categorys
// @match           https://www.112-merkez.com/aao_categorys
// @match           https://www.dyspetcher101-game.com/aao_categorys
// @run-at          document-idle
// ==/UserScript==

/**
 * @name ARR Categories Export
 * @name:de AAO-Kategorien Export
 * @description Allows exporting and importing custom ARR Categories
 * @description:de Eigenen AAO-Kategorien in eine Datei exportieren und diese wieder importieren
 * @forum https://forum.leitstellenspiel.de/index.php?thread/20531-aao-kategorien-exportieren-und-importieren/
 * @match /aao_categorys
 */

const { origin } = window.location;

const exportBtn = document.createElement('a');
const existing = Array.from(
    document.querySelectorAll('table tbody:last-of-type tr')
).map(({ children: [name, sort, btn] }) => ({
    name: name.textContent.trim(),
    sort: sort.textContent.trim(),
    id: btn.querySelector('a').href.match(/\d+/)[0],
}));
const auth = document.querySelector('meta[name="csrf-token"]').content;
exportBtn.download = 'aao_categories.aaoc';
exportBtn.href = `data:application/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(existing.map(({ name, sort }) => ({ name, sort })))
)}`;
exportBtn.classList.add('btn', 'btn-info', 'pull-right');
exportBtn.innerText = 'Export';
const importBtn = document.createElement('button');
importBtn.download = 'aao_categories.aaoc';
importBtn.classList.add('btn', 'btn-info', 'pull-right');
importBtn.innerText = 'Import';
const importFile = document.createElement('input');
importFile.type = 'file';
importFile.accept = '.aaoc';
importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', () => {
    if (
        !importFile.files.length ||
        !importFile.files[0].name.match(/\.aaoc$/)
    ) {
        return;
    }
    importFile.files[0].text().then(async text => {
        const data = JSON.parse(text);
        let i = 0;
        for (i; i < existing.length && data.length; i++) {
            const arr = data.shift();
            const ex = existing[i];
            const url = new URL(window.location.href);
            url.searchParams.append('utf8', '✓');
            url.searchParams.append('_method', 'put');
            url.searchParams.append('authenticity_token', auth);
            url.searchParams.append('aao_category[caption]', arr.name);
            url.searchParams.append('aao_category[order_number]', arr.sort);
            await fetch(`${origin}/aao_categorys/${ex.id}`, {
                credentials: 'include',
                headers: {
                    'Accept':
                        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'de-DE,en-US;q=0.7,en;q=0.3',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Upgrade-Insecure-Requests': '1',
                },
                referrer: `${origin}/aao_categorys/${ex.id}`,
                body: url.searchParams.toString(),
                method: 'POST',
                mode: 'cors',
            });
        }
        if (i < existing.length) {
            for (i; i < existing.length; i++) {
                const ex = existing[i];
                const url = new URL(window.location.href);
                url.searchParams.append('_method', 'delete');
                url.searchParams.append('authenticity_token', auth);
                await fetch(`${origin}/aao_categorys/${ex.id}`, {
                    credentials: 'include',
                    headers: {
                        'Accept':
                            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'de-DE,en-US;q=0.7,en;q=0.3',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Upgrade-Insecure-Requests': '1',
                    },
                    referrer: `${origin}/aao_categorys/${ex.id}/edit`,
                    body: url.searchParams.toString(),
                    method: 'POST',
                    mode: 'cors',
                });
            }
        }
        for (let j = 0; j < data.length; j++) {
            const arr = data[j];
            const url = new URL(window.location.href);
            url.searchParams.append('utf8', '✓');
            url.searchParams.append('authenticity_token', auth);
            url.searchParams.append('aao_category[caption]', arr.name);
            url.searchParams.append('aao_category[order_number]', arr.sort);
            await fetch(`${origin}/aao_category/create`, {
                credentials: 'include',
                headers: {
                    'Accept':
                        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'de-DE,en-US;q=0.7,en;q=0.3',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Upgrade-Insecure-Requests': '1',
                },
                referrer: `${origin}/aao_categorys/new`,
                body: url.searchParams.toString(),
                method: 'POST',
                mode: 'cors',
            });
        }
        window.location.reload();
    });
});
document
    .querySelector('a[href="/aao_categorys/new"]')
    .after(importBtn, exportBtn);
