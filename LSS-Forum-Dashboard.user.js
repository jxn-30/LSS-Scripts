// ==UserScript==
// @name         LSS-Forum-Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Dashboard-Link im LSS-Forum
// @author       Jan (KBOE2)
// @include      https://forum.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

! function() {
    "use strict";
    const e = window.location.search.match("dashboard") ? "active" : null;
    let t, a;
    if ($("ol.boxMenu")[0].innerHTML += `<li class="${e}"><a href="/cms/index.php?dashboard/">Dashboard</a></li>`, $(".menuOverlayItemList .menuOverlayItemSpacer").before(`<li class="menuOverlayItem ${e}"><span class="menuOverlayItemWrapper"><a href="/cms/index.php?dashboard/" class="menuOverlayItemLink"><span class="menuOverlayItemTitle">Dashboard</span>`), e) {
        let e = document.createElement("script");
        e.src = "https://www.amcharts.com/lib/3/amcharts.js", document.head.appendChild(e);
        let i = window.setInterval(() => {
                if (window.AmCharts) {
                    let e = document.createElement("script");
                    e.src = "https://www.amcharts.com/lib/3/serial.js", document.head.appendChild(e), window.clearInterval(i)
                }
            }, 1e3),
            r = window.setInterval(() => {
                if (window.AmCharts) {
                    let e = document.createElement("script");
                    e.src = "https://www.amcharts.com/lib/3/themes/dark.js", document.head.appendChild(e), window.clearInterval(r)
                }
            }, 1e3);
        t = parseInt(document.querySelector(".sidebar .containerContent dd:nth-of-type(2)").innerText.replace(/\D+/g, "")), a = parseInt(document.querySelector(".sidebar .containerContent dd:nth-of-type(1)").innerText.replace(/\D+/g, ""));
        let l = JSON.parse(localStorage.bldiff || "{}"),
            s = new Date,
            d = Object.keys(l);
        s.setTime(d.length ? d.reduce((e, t) => t > e ? t : e) : 0), new Date - s > 36e5 && (l[(new Date).getTime()] = {
            p: a,
            l: t
        }), localStorage.bldiff = JSON.stringify(l), document.querySelector(".sidebar .containerContent").insertAdjacentHTML("beforeend", `<dt>Likes per Post</dt><dd>${(t/a).toFixed(4)}</dd>`);
        let n = document.querySelector(".sidebar .boxContent"),
            o = n.getBoundingClientRect().width;
        n.insertAdjacentHTML("beforeend", `<div id="bldiff-chart" style="width: ${o}px; height: ${o}px; background-color: #282828;" ></div><div id="pl-chart" style="width: ${o}px; height: ${o}px; background-color: #282828;" ></div><div id="lpp-chart" style="width: ${o}px; height: ${o}px; background-color: #282828;" ></div>`);
        const c = (() => {
            let e = JSON.parse(localStorage.bldiff || "{}");
            return {
                type: "serial",
                categoryField: "date",
                dataDateFormat: "YYYY-MM-DD HH:NN:SS",
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
                valueAxes: [{
                    id: "ValueAxis-1"
                }],
                graphs: [{
                    id: "bldiff",
                    title: "bldiff",
                    valueField: "bldiff"
                }],
                legend: {
                    enabled: !1,
                    useGraphSettings: !0
                },
                titles: [{
                    id: "title",
                    size: 15,
                    text: "Abstand Posts - Likes"
                }],
                dataProvider: Object.keys(e).map((t, a) => {
                    let i = new Date;
                    return i.setTime(parseInt(t) + 36e5), {
                        date: i,
                        bldiff: e[t].p - e[t].l
                    }
                })
            }
        })();
        window.chart = c;
        let p = window.setInterval(() => {
            if (window.AmCharts.AmSerialChart) {
                let e = document.createElement("script");
                e.async = !1, e.innerHTML = `AmCharts.makeChart("bldiff-chart", ${JSON.stringify(c)});`, window.clearInterval(p), c.creditsPosition = "bottom-right", c.graphs = [{
                    id: "posts",
                    title: "posts",
                    valueField: "posts"
                }, {
                    id: "likes",
                    title: "likes",
                    valueField: "likes"
                }], c.titles = [{
                    id: "title",
                    size: 15,
                    text: "Verlauf Posts und Likes"
                }];
                let t = JSON.parse(localStorage.bldiff || "{}");
                c.dataProvider = Object.keys(t).map((e, a) => {
                    let i = new Date;
                    return i.setTime(parseInt(e) + 36e5), {
                        date: i,
                        posts: t[e].p,
                        likes: t[e].l
                    }
                }), c.legend.enabled = !0, e.innerHTML += `AmCharts.makeChart("pl-chart", ${JSON.stringify(c)});`, c.graphs = [{
                    id: "lpp",
                    title: "Likes pro Post",
                    valueField: "lpp"
                }, {
                    id: "ppl",
                    title: "Posts pro Like",
                    valueField: "ppl"
                }], c.titles = [{
                    id: "title",
                    size: 15,
                    text: "Verlauf Likes per Post"
                }], c.dataProvider = Object.keys(t).map((e, a) => {
                    let i = new Date;
                    return i.setTime(parseInt(e) + 36e5), {
                        date: i,
                        lpp: (t[e].l / t[e].p).toFixed(4),
                        ppl: (t[e].p / t[e].l).toFixed(4)
                    }
                }), e.innerHTML += `AmCharts.makeChart("lpp-chart", ${JSON.stringify(c)});`, document.body.appendChild(e)
            }
        }, 1e3)
    }
}();
