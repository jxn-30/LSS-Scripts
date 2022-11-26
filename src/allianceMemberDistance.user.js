// ==UserScript==
// @name            [LSS] Alliance Member Distance
// @namespace       https://jxn.lss-manager.de
// @version         2022.11.26+1801
// @author          Jan (jxn_30)
// @description     Shows difference of total earned credits to the next alliance member
// @description:de  Zeigt die fehlenden verdienten Credits zum nächsten Verbandsmitglied an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/allianceMemberDistance.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/allianceMemberDistance.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/18531-script-differenz-zum-n%C3%A4chsten-verband-verbandsmitglied-spieler/
// @match           https://www.operacni-stredisko.cz/verband/mitglieder
// @match           https://www.operacni-stredisko.cz/verband/mitglieder/*
// @match           https://policie.operacni-stredisko.cz/verband/mitglieder
// @match           https://policie.operacni-stredisko.cz/verband/mitglieder/*
// @match           https://www.alarmcentral-spil.dk/verband/mitglieder
// @match           https://www.alarmcentral-spil.dk/verband/mitglieder/*
// @match           https://politi.alarmcentral-spil.dk/verband/mitglieder
// @match           https://politi.alarmcentral-spil.dk/verband/mitglieder/*
// @match           https://www.leitstellenspiel.de/verband/mitglieder
// @match           https://www.leitstellenspiel.de/verband/mitglieder/*
// @match           https://polizei.leitstellenspiel.de/verband/mitglieder
// @match           https://polizei.leitstellenspiel.de/verband/mitglieder/*
// @match           https://www.missionchief-australia.com/verband/mitglieder
// @match           https://www.missionchief-australia.com/verband/mitglieder/*
// @match           https://police.missionchief-australia.com/verband/mitglieder
// @match           https://police.missionchief-australia.com/verband/mitglieder/*
// @match           https://www.missionchief.co.uk/verband/mitglieder
// @match           https://www.missionchief.co.uk/verband/mitglieder/*
// @match           https://police.missionchief.co.uk/verband/mitglieder
// @match           https://police.missionchief.co.uk/verband/mitglieder/*
// @match           https://www.missionchief.com/verband/mitglieder
// @match           https://www.missionchief.com/verband/mitglieder/*
// @match           https://police.missionchief.com/verband/mitglieder
// @match           https://police.missionchief.com/verband/mitglieder/*
// @match           https://www.centro-de-mando.es/verband/mitglieder
// @match           https://www.centro-de-mando.es/verband/mitglieder/*
// @match           https://www.centro-de-mando.mx/verband/mitglieder
// @match           https://www.centro-de-mando.mx/verband/mitglieder/*
// @match           https://www.hatakeskuspeli.com/verband/mitglieder
// @match           https://www.hatakeskuspeli.com/verband/mitglieder/*
// @match           https://poliisi.hatakeskuspeli.com/verband/mitglieder
// @match           https://poliisi.hatakeskuspeli.com/verband/mitglieder/*
// @match           https://www.operateur112.fr/verband/mitglieder
// @match           https://www.operateur112.fr/verband/mitglieder/*
// @match           https://police.operateur112.fr/verband/mitglieder
// @match           https://police.operateur112.fr/verband/mitglieder/*
// @match           https://www.operatore112.it/verband/mitglieder
// @match           https://www.operatore112.it/verband/mitglieder/*
// @match           https://polizia.operatore112.it/verband/mitglieder
// @match           https://polizia.operatore112.it/verband/mitglieder/*
// @match           https://www.missionchief-japan.com/verband/mitglieder
// @match           https://www.missionchief-japan.com/verband/mitglieder/*
// @match           https://www.missionchief-korea.com/verband/mitglieder
// @match           https://www.missionchief-korea.com/verband/mitglieder/*
// @match           https://www.nodsentralspillet.com/verband/mitglieder
// @match           https://www.nodsentralspillet.com/verband/mitglieder/*
// @match           https://politiet.nodsentralspillet.com/verband/mitglieder
// @match           https://politiet.nodsentralspillet.com/verband/mitglieder/*
// @match           https://www.meldkamerspel.com/verband/mitglieder
// @match           https://www.meldkamerspel.com/verband/mitglieder/*
// @match           https://politie.meldkamerspel.com/verband/mitglieder
// @match           https://politie.meldkamerspel.com/verband/mitglieder/*
// @match           https://www.operatorratunkowy.pl/verband/mitglieder
// @match           https://www.operatorratunkowy.pl/verband/mitglieder/*
// @match           https://policja.operatorratunkowy.pl/verband/mitglieder
// @match           https://policja.operatorratunkowy.pl/verband/mitglieder/*
// @match           https://www.operador193.com/verband/mitglieder
// @match           https://www.operador193.com/verband/mitglieder/*
// @match           https://www.jogo-operador112.com/verband/mitglieder
// @match           https://www.jogo-operador112.com/verband/mitglieder/*
// @match           https://policia.jogo-operador112.com/verband/mitglieder
// @match           https://policia.jogo-operador112.com/verband/mitglieder/*
// @match           https://www.jocdispecerat112.com/verband/mitglieder
// @match           https://www.jocdispecerat112.com/verband/mitglieder/*
// @match           https://www.dispetcher112.ru/verband/mitglieder
// @match           https://www.dispetcher112.ru/verband/mitglieder/*
// @match           https://www.dispecerske-centrum.com/verband/mitglieder
// @match           https://www.dispecerske-centrum.com/verband/mitglieder/*
// @match           https://www.larmcentralen-spelet.se/verband/mitglieder
// @match           https://www.larmcentralen-spelet.se/verband/mitglieder/*
// @match           https://polis.larmcentralen-spelet.se/verband/mitglieder
// @match           https://polis.larmcentralen-spelet.se/verband/mitglieder/*
// @match           https://www.112-merkez.com/verband/mitglieder
// @match           https://www.112-merkez.com/verband/mitglieder/*
// @match           https://www.dyspetcher101-game.com/verband/mitglieder
// @match           https://www.dyspetcher101-game.com/verband/mitglieder/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Alliance Member Distance
 * @description Shows difference of total earned credits to the next alliance member
 * @description:de Zeigt die fehlenden verdienten Credits zum nächsten Verbandsmitglied an
 * @forum https://forum.leitstellenspiel.de/index.php?thread/18531-script-differenz-zum-n%C3%A4chsten-verband-verbandsmitglied-spieler/
 * @match /verband/mitglieder
 * @match /verband/mitglieder/*
 * @old Alliance-Member-Distance
 */

/* global AmCharts */

(async function () {
    'use strict';

    if (
        !window.sessionStorage.aCredits ||
        JSON.parse(window.sessionStorage.aCredits).lastUpdate <
            new Date().getTime() - 5 * 1000 * 60
    ) {
        await fetch('/api/credits')
            .then(res => res.json())
            .then(data =>
                window.sessionStorage.setItem(
                    'aCredits',
                    JSON.stringify({
                        lastUpdate: new Date().getTime(),
                        value: data,
                    })
                )
            );
    }

    let prevValue;
    const member_values = {};
    const member_names = {};
    const history = JSON.parse(localStorage.member_list_history || '{}');
    const page =
        document.querySelector('.pagination .active')?.textContent ?? '1';

    document.querySelectorAll('tbody tr td:nth-of-type(3)').forEach(cell => {
        const credits = parseInt(
            cell.textContent
                .trim()
                .match(/^\d{1,3}(?:[.,]\d{3})*/)[0]
                .replace(/\D/g, '')
        );
        const distSpan = document.createElement('span');
        const nameNode = cell.parentNode.querySelector('td:nth-of-type(1) a');
        const memberId = nameNode.href.match(/\d+$/)[0];
        member_values[memberId] = credits;
        member_names[memberId] = nameNode.textContent;
        distSpan.innerText = (
            credits - (prevValue || credits)
        ).toLocaleString();
        distSpan.style.color = 'red';
        distSpan.style.marginLeft = '1em';
        distSpan.setAttribute(
            'title',
            `Zu mir selbst: ${(
                credits -
                JSON.parse(window.sessionStorage.aCredits).value
                    .credits_user_total
            ).toLocaleString()}`
        );
        cell.appendChild(distSpan);
        prevValue = credits;
    });

    if (!document.querySelector('a[href="/verband/gebauede"]')) return;

    if (!history[page]) history[page] = {};

    if (
        (Object.keys(history[page]).sort().reverse()[0] || 0) <
        new Date().getTime() - 10 * 60 * 1000
    ) {
        history[page][new Date().getTime()] = member_values;
    }

    localStorage.member_list_history = JSON.stringify(history);

    const e = document.createElement('script');
    e.src = 'https://www.amcharts.com/lib/3/amcharts.js';
    document.head.appendChild(e);
    document.body.insertAdjacentHTML(
        'beforeend',
        '<div id="gesamtcredits-chart" style="width: 100%; height: 100vh; background-color: #282828;"></div>'
    );
    const i = window.setInterval(() => {
            if (window.AmCharts) {
                const e = document.createElement('script');
                e.src = 'https://www.amcharts.com/lib/3/serial.js';
                document.head.appendChild(e);
                window.clearInterval(i);
            }
        }, 1e3),
        a = window.setInterval(() => {
            if (window.AmCharts) {
                const e = document.createElement('script');
                e.src = 'https://www.amcharts.com/lib/3/themes/dark.js';
                document.head.appendChild(e);
                window.clearInterval(a);
            }
        }, 1e3),
        q = window.setInterval(() => {
            if (window.AmCharts) {
                const e = document.createElement('script');
                const f = document.createElement('link');
                f.rel = 'stylesheet';
                f.href =
                    'https://www.amcharts.com/lib/3/plugins/export/export.css';
                e.src =
                    'https://www.amcharts.com/lib/3/plugins/export/export.min.js';
                document.head.appendChild(e).appendChild(f);
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
    const b = window.setInterval(() => {
        if (window.AmCharts && window.AmCharts.AmSerialChart) {
            window.clearInterval(b);
            const shown = JSON.parse(
                localStorage.member_list_history_shown || '[]'
            );
            const saved_graphs = Object.entries(history[page]).flatMap(
                ([, values]) =>
                    Object.keys(values).map(id => ({
                        id,
                        title: member_names[id] || id,
                        valueField: id,
                        hidden: !shown.includes(id),
                    }))
            );
            const graphs = [];
            saved_graphs.forEach(g => {
                if (!graphs.filter(c => c.id === g.id).length) {
                    graphs.push({
                        ...g,
                        lineColor: `#${getColorFromString(g.title)}`,
                    });
                }
            });
            const u = {
                type: 'serial',
                categoryField: 'date',
                theme: 'dark',
                creditsPosition: 'top-right',
                categoryAxis: {
                    minPeriod: 'ss',
                    parseDates: !0,
                },
                chartCursor: {
                    enabled: !0,
                    categoryBalloonDateFormat: 'DD.MM JJ:NN:SS',
                },
                trendLines: [],
                valueAxes: [
                    {
                        id: 'ValueAxis-1',
                        usePrefixes: true,
                    },
                ],
                graphs,
                legend: {
                    enabled: !0,
                    useGraphSettings: !0,
                },
                titles: [
                    {
                        id: 'title',
                        size: 15,
                        text: 'Verlauf',
                    },
                ],
                export: {
                    enabled: true,
                },
                dataProvider: Object.entries(history[page]).map(
                    ([time, data]) => {
                        const date = new Date();
                        date.setTime(time);
                        return {
                            date,
                            ...data,
                        };
                    }
                ),
            };
            const chart = AmCharts.makeChart('gesamtcredits-chart', u);
            chart.legend.addListener('showItem', ({ dataItem: { id } }) => {
                shown.push(id);
                localStorage.member_list_history_shown = JSON.stringify(shown);
            });
            chart.legend.addListener('hideItem', ({ dataItem: { id } }) => {
                shown.splice(
                    shown.findIndex(s => s === id),
                    1
                );
                localStorage.member_list_history_shown = JSON.stringify(shown);
            });
        }
    }, 1e3);
})();
