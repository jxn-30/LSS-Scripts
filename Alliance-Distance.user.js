// ==UserScript==
// @name         LSS-Alliance-Distance
// @version      1.0.7
// @description  Zeigt die fehlenden verdienten Credits zum nächsten Verband an
// @author       Jan (jxn_30)
// @grant        none
// @include      /^https?:\/\/(?:w{3}\.)?(?:leitstellenspiel\.de|(?:meldkamerspel|missionchief|missionchief-australia|nodsentralspillet|112-merkez|jogo-operador112|operador193|dyspetcher101-game|missionchief-japan|jocdispecerat112|missionchief-korea|hatakeskuspeli|dispecerske-centrum)\.com|missionchief\.co\.uk|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|operacni-stredisko\.cz|centro-de-mando\.mx)\/alliances(\?.*)?$/
// ==/UserScript==

(async function() {
    'use strict';

    if (!window.sessionStorage.hasOwnProperty('aCredits') || JSON.parse(window.sessionStorage.aCredits).lastUpdate < (new Date().getTime() - 5 * 1000 * 60)) await fetch('/api/credits').then(res => res.json()).then(data => window.sessionStorage.setItem('aCredits', JSON.stringify({lastUpdate: new Date().getTime(), value: data})));

    let prevValue;
    const alliance_values = {};
    const alliance_names = {};
    const history = JSON.parse(localStorage.alliance_list_history || '{}');
    const page = document.querySelector('.pagination .active').textContent;

    document.querySelectorAll('tbody tr td:nth-of-type(3)').forEach(cell => {
        const credits = parseInt(cell.textContent.trim().match(/^\d{1,3}(?:[.,]\d{3})*/)[0].replace(/\D/g, ''));
        const nameNode = cell.parentNode.querySelector('td:nth-of-type(2) a');
        const allianceId = nameNode.href.match(/\d+$/)[0];
        alliance_values[allianceId] = credits;
        alliance_names[allianceId] = nameNode.textContent;
        const distSpan = document.createElement('span');
        distSpan.innerText = (credits - (prevValue || credits)).toLocaleString();
        distSpan.style.color = 'red';
        distSpan.style.marginLeft = '1em';
        distSpan.setAttribute('title', `Zum eigenen Verband: ${(credits - JSON.parse(window.sessionStorage.aCredits).value.credits_alliance_total).toLocaleString()}`);
        cell.appendChild(distSpan);
        prevValue = credits;
    });

    if (!history.hasOwnProperty(page)) history[page] = {};

    if ((Object.keys(history[page]).sort().reverse()[0] || 0) < new Date().getTime() - 10 * 60 * 1000) history[page][new Date().getTime()] = alliance_values;

    localStorage.alliance_list_history = JSON.stringify(history);

    let e = document.createElement("script");
    e.src = "https://www.amcharts.com/lib/3/amcharts.js", document.head.appendChild(e);
    document.body.insertAdjacentHTML('beforeend', '<div id="gesamtcredits-chart" style="width: 100%; height: 100vh; background-color: #282828;"></div>');
    let i = window.setInterval(() => {
        if (window.AmCharts) {
            let e = document.createElement("script");
            e.src = "https://www.amcharts.com/lib/3/serial.js", document.head.appendChild(e),
                window.clearInterval(i);
        }
    }, 1e3), a = window.setInterval(() => {
        if (window.AmCharts) {
            let e = document.createElement("script");
            e.src = "https://www.amcharts.com/lib/3/themes/dark.js", document.head.appendChild(e),
                window.clearInterval(a);
        }
    }, 1e3), q = window.setInterval(() => {
        if (window.AmCharts) {
            let e = document.createElement("script");
            let f = document.createElement('link');
            f.rel = 'stylesheet';
            f.href = 'https://www.amcharts.com/lib/3/plugins/export/export.css';
            e.src = "https://www.amcharts.com/lib/3/plugins/export/export.min.js", document.head.appendChild(e).appendChild(f),
                window.clearInterval(q);
        }
    }, 1e3);
    const getColorFromString = (string = '', shift = 0) => {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        hash = (hash + 2 * shift) / 3;
        hash = (hash & 0x00ffffff).toString(16).toUpperCase();
        return '00000'.substring(0, 6 - hash.length) + hash;
    };
    let b = window.setInterval(() => {
        if (window.AmCharts && window.AmCharts.AmSerialChart) {
            window.clearInterval(b);
            const shown = JSON.parse(localStorage.alliance_list_history_shown || '[]');
            const saved_graphs = Object.entries(history[page]).flatMap(([_, values]) => Object.keys(values).map(id => ({
                id: id,
                title: alliance_names[id] || id,
                valueField: id,
                hidden: !shown.includes(id),
            })));
            const graphs = [];
            saved_graphs.forEach(g => {
                !graphs.filter(c => c.id === g.id).length && graphs.push({...g, lineColor: `#${getColorFromString(g.title)}`});
            });
            console.log(graphs);
            const u = {
                type: "serial",
                categoryField: "date",
                theme: "dark",
                creditsPosition: "top-right",
                categoryAxis: {
                    minPeriod: "ss",
                    parseDates: !0
                },
                chartCursor: {
                    enabled: !0,
                    categoryBalloonDateFormat: "DD.MM JJ:NN:SS"
                },
                trendLines: [],
                valueAxes: [ {
                    "id": "ValueAxis-1",
                    "usePrefixes": true,
                } ],
                graphs,
                legend: {
                    enabled: !0,
                    useGraphSettings: !0,
                },
                titles: [ {
                    id: "title",
                    size: 15,
                    text: "Verlauf"
                } ],
                export: {
                    enabled: true
                },
                dataProvider: Object.entries(history[page]).map(([time, data]) => {
                    const date = new Date();
                    date.setTime(time);
                    return {
                        date,
                        ...data
                    };
                })
            };
            const chart = AmCharts.makeChart("gesamtcredits-chart", u);
            chart.legend.addListener('showItem', ({ dataItem: { id } }) => {
                shown.push(id);
                localStorage.alliance_list_history_shown = JSON.stringify(shown);
            });
            chart.legend.addListener('hideItem', ({ dataItem: { id } }) => {
                shown.splice(shown.findIndex(s => s === id), 1);
                localStorage.alliance_list_history_shown = JSON.stringify(shown);
            });
        }
    }, 1e3);
})();
