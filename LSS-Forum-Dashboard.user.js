// ==UserScript==
// @name         LSS-Forum-Dashboard
// @version      1.3.3
// @description  Dashboard-Link im LSS-Forum
// @author       Jan (KBOE2)
// @include      https://forum.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

!function() {
    "use strict";
    const e = window.location.search.match("dashboard") ? "active" : null;
    let t, l;
    if ($("ol.boxMenu")[0].innerHTML += `<li class="${e}"><a href="/cms/index.php?dashboard/">Dashboard</a></li>`,
    $(".menuOverlayItemList .menuOverlayItemSpacer").before(`<li class="menuOverlayItem ${e}"><span class="menuOverlayItemWrapper"><a href="/cms/index.php?dashboard/" class="menuOverlayItemLink"><span class="menuOverlayItemTitle">Dashboard</span>`),
    e) {
        let e = document.createElement("script");
        e.src = "https://www.amcharts.com/lib/3/amcharts.js", document.head.appendChild(e);
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
        }, 1e3);
        t = parseInt(document.querySelector(".sidebar .containerContent dd:nth-of-type(2)").innerText.replace(/\D+/g, "")),
        l = parseInt(document.querySelector(".sidebar .containerContent dd:nth-of-type(1)").innerText.replace(/\D+/g, ""));
        let r = JSON.parse(localStorage.bldiff || "{}"), n = new Date(), o = Object.keys(r);
        n.setTime(o.length ? o.reduce((e, t) => t > e ? t : e) : 0), new Date() - n > 36e5 && (r[new Date().getTime()] = {
            p: l,
            l: t
        }), localStorage.bldiff = JSON.stringify(r), document.querySelector(".sidebar .containerContent").insertAdjacentHTML("beforeend", `<dt>Likes per Post</dt><dd>${(t / l).toFixed(4)}</dd>`);
        let s = document.querySelector(".sidebar .boxContent"), d = s.getBoundingClientRect().width;
        s.insertAdjacentHTML("beforeend", `<div id="bldiff-chart" style="width: ${d}px; height: ${d}px; background-color: #282828;" ></div><div id="pl-chart" style="width: ${d}px; height: ${d}px; background-color: #282828;" ></div><div id="lpp-chart" style="width: ${d}px; height: ${d}px; background-color: #282828;" ></div>`);
        const p = JSON.parse(localStorage.bldiff || "{}"), c = Object.keys(p).length, h = c.toString().length, m = Math.floor(c / h), u = {
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
                id: "ValueAxis-1"
            } ],
            graphs: [ {
                id: "bldiff",
                title: "bldiff",
                valueField: "bldiff",
                lineColor: "#90FF04"
            } ],
            legend: {
                enabled: !1,
                useGraphSettings: !0
            },
            titles: [ {
                id: "title",
                size: 15,
                text: "Abstand Posts - Likes"
            } ],
            dataProvider: Object.keys(p).map((e, t) => {
                let l = new Date();
                l.setTime(parseInt(e));
                let i = {
                    date: l,
                    bldiff: p[e].p - p[e].l
                };
                for (let l = m; l <= c; l += m) (t % l == l - 1 || !t) && (i[`t${l}`] = p[e].p - p[e].l);
                return i;
            })
        };
        for (let e = m; e <= c; e += m) u.graphs.push({
            id: `t${e}`,
            title: `t${e}`,
            valueField: `t${e}`,
            type: "smoothedLine",
            showBalloon: !1,
            lineAlpha: .3,
            lineColor: "#9400D3"
        });
        window.chart = u;
        let b = window.setInterval(() => {
            if (window.AmCharts.AmSerialChart) {
                let e = document.createElement("script");
                e.async = !1, e.innerHTML = `AmCharts.makeChart("bldiff-chart", ${JSON.stringify(u)});`,
                window.clearInterval(b), u.creditsPosition = "bottom-right", u.graphs = [ {
                    id: "posts",
                    title: "posts",
                    valueField: "posts",
                    lineColor: "#90FF04"
                }, {
                    id: "likes",
                    title: "likes",
                    valueField: "likes",
                    lineColor: "#6F00FB"
                } ], u.titles = [ {
                    id: "title",
                    size: 15,
                    text: "Verlauf Posts und Likes"
                } ];
                let t = JSON.parse(localStorage.bldiff || "{}");
                const l = Object.keys(t).length, i = l.toString().length, a = Math.floor(l / i);
                for (let e = a; e <= l; e += a) u.graphs.push({
                    id: `t${e}p`,
                    title: `t${e}p`,
                    valueField: `t${e}p`,
                    type: "smoothedLine",
                    showBalloon: !1,
                    lineAlpha: .3,
                    visibleInLegend: !1,
                    lineColor: "#90FF04"
                }, {
                    id: `t${e}l`,
                    title: `t${e}l`,
                    valueField: `t${e}l`,
                    type: "smoothedLine",
                    showBalloon: !1,
                    lineAlpha: .3,
                    visibleInLegend: !1,
                    lineColor: "#6F00FB"
                });
                u.dataProvider = Object.keys(t).map((e, i) => {
                    let r = new Date();
                    r.setTime(parseInt(e));
                    let n = {
                        date: r,
                        posts: t[e].p,
                        likes: t[e].l
                    };
                    for (let r = a; r <= l; r += a) (i % r == r - 1 || !i) && (n[`t${r}p`] = t[e].p,
                    n[`t${r}l`] = t[e].l);
                    return n;
                }), u.legend.enabled = !0, e.innerHTML += `AmCharts.makeChart("pl-chart", ${JSON.stringify(u)});`,
                u.graphs = [ {
                    id: "lpp",
                    title: "Likes pro Post",
                    valueField: "lpp",
                    lineColor: "#90FF04"
                }, {
                    id: "ppl",
                    title: "Posts pro Like",
                    valueField: "ppl",
                    lineColor: "#6F00FB"
                } ], u.titles = [ {
                    id: "title",
                    size: 15,
                    text: "Verlauf Likes per Post"
                } ], u.dataProvider = Object.keys(t).map((e, i) => {
                    let r = new Date();
                    r.setTime(parseInt(e));
                    let n = {
                        date: r,
                        lpp: (t[e].l / t[e].p).toFixed(4),
                        ppl: (t[e].p / t[e].l).toFixed(4)
                    };
                    for (let e = a; e <= l; e += a) (i % e == e - 1 || !i) && (n[`t${e}lpp`] = n.lpp,
                    n[`t${e}ppl`] = n.ppl);
                    return n;
                });
                for (let e = a; e <= l; e += a) u.graphs.push({
                    id: `t${e}lpp`,
                    title: `t${e}lpp`,
                    valueField: `t${e}lpp`,
                    type: "smoothedLine",
                    showBalloon: !1,
                    lineAlpha: .3,
                    visibleInLegend: !1,
                    lineColor: "#90FF04"
                }, {
                    id: `t${e}ppl`,
                    title: `t${e}ppl`,
                    valueField: `t${e}ppl`,
                    type: "smoothedLine",
                    showBalloon: !1,
                    lineAlpha: .3,
                    visibleInLegend: !1,
                    lineColor: "#6F00FB"
                });
                e.innerHTML += `AmCharts.makeChart("lpp-chart", ${JSON.stringify(u)});`, document.body.appendChild(e);
            }
        }, 1e3);
    }
}();
