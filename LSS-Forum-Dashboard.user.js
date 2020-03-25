// ==UserScript==
// @name         LSS-Forum-Dashboard
// @namespace    http://tampermonkey.net/
// @version      1.3.0
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
        let r = window.setInterval(() => {
                if (window.AmCharts) {
                    let e = document.createElement("script");
                    e.src = "https://www.amcharts.com/lib/3/serial.js", document.head.appendChild(e), window.clearInterval(r)
                }
            }, 1e3),
            n = window.setInterval(() => {
                if (window.AmCharts) {
                    let e = document.createElement("script");
                    e.src = "https://www.amcharts.com/lib/3/themes/dark.js", document.head.appendChild(e), window.clearInterval(n)
                }
            }, 1e3);
        t = parseInt(document.querySelector(".sidebar .containerContent dd:nth-of-type(2)").innerText.replace(/\D+/g, "")), a = parseInt(document.querySelector(".sidebar .containerContent dd:nth-of-type(1)").innerText.replace(/\D+/g, ""));
        let d = JSON.parse(localStorage.bldiff || "{}"),
            i = new Date,
            l = Object.keys(d);
        i.setTime(l.length ? l.reduce((e, t) => t > e ? t : e) : 0), new Date - i > 36e5 && (d[(new Date).getTime()] = a - t), localStorage.bldiff = JSON.stringify(d), document.querySelector(".sidebar .containerContent").insertAdjacentHTML("beforeend", `<dt>Likes per Post</dt><dd>${(t/parseInt(document.querySelector(".sidebar .containerContent dd:nth-of-type(1)").innerText.replace(/\D+/g,""))).toFixed(4)}</dd>`);
        let s = document.querySelector(".sidebar .boxContent"),
            o = s.getBoundingClientRect().width;
        s.insertAdjacentHTML("beforeend", `<div id="bldiff-chart" style="width: ${o}px; height: ${o}px; background-color: #282828;" ></div>`);
        const c = (() => {
            Object.keys(JSON.parse(localStorage.bldiff)).length;
            return {
                type: "serial",
                categoryField: "date",
                dataDateFormat: "YYYY-MM-DD HH:NN:SS",
                theme: "dark",
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
                    id: "t1",
                    title: "t1",
                    valueField: "t1"
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
                dataProvider: Object.keys(JSON.parse(localStorage.bldiff)).map((e, t) => {
                    let a = new Date();
                    return a.setTime(parseInt(e) + 36e5), {
                        date: a,
                        t1: JSON.parse(localStorage.bldiff)[e]
                    }
                })
            }
        })();
        let m = window.setInterval(() => {
            if (window.AmCharts.AmSerialChart) {
                let e = document.createElement("script");
                e.innerHTML = `AmCharts.makeChart("bldiff-chart", ${JSON.stringify(c)});`, document.body.appendChild(e), window.clearInterval(m)
            }
        }, 1e3)
    }
}();
