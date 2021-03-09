// ==UserScript==
// @name        LSS ARR Categories Export
// @version     1.0.0
// @description enables exporting and importing ARR Categories
// @author      Jan (jxn_30)
// @include     /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/aao_categorys\/?$/
// @grant       none
// ==/UserScript==

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
    if (!importFile.files.length || !importFile.files[0].name.match(/\.aaoc$/))
        return;
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
            await fetch(
                `https://www.leitstellenspiel.de/aao_categorys/${ex.id}`,
                {
                    credentials: 'include',
                    headers: {
                        'Accept':
                            'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'de-DE,en-US;q=0.7,en;q=0.3',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Upgrade-Insecure-Requests': '1',
                    },
                    referrer: `https://www.leitstellenspiel.de/aao_categorys/${ex.id}`,
                    body: url.searchParams.toString(),
                    method: 'POST',
                    mode: 'cors',
                }
            );
        }
        if (i < existing.length) {
            for (i; i < existing.length; i++) {
                const ex = existing[i];
                const url = new URL(window.location.href);
                url.searchParams.append('_method', 'delete');
                url.searchParams.append('authenticity_token', auth);
                await fetch(
                    `https://www.leitstellenspiel.de/aao_categorys/${ex.id}`,
                    {
                        credentials: 'include',
                        headers: {
                            'Accept':
                                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'de-DE,en-US;q=0.7,en;q=0.3',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Upgrade-Insecure-Requests': '1',
                        },
                        referrer: `https://www.leitstellenspiel.de/aao_categorys/${ex.id}/edit`,
                        body: url.searchParams.toString(),
                        method: 'POST',
                        mode: 'cors',
                    }
                );
            }
        }
        for (let j = 0; j < data.length; j++) {
            const arr = data[j];
            const url = new URL(window.location.href);
            url.searchParams.append('utf8', '✓');
            url.searchParams.append('authenticity_token', auth);
            url.searchParams.append('aao_category[caption]', arr.name);
            url.searchParams.append('aao_category[order_number]', arr.sort);
            await fetch(`https://www.leitstellenspiel.de/aao_category/create`, {
                credentials: 'include',
                headers: {
                    'Accept':
                        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'de-DE,en-US;q=0.7,en;q=0.3',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Upgrade-Insecure-Requests': '1',
                },
                referrer: `https://www.leitstellenspiel.de/aao_categorys/new`,
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
