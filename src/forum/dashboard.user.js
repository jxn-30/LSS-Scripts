// ==UserScript==
// @name            [LSS] Forum: Dashboard
// @namespace       https://jxn.lss-manager.de
// @version         2022.12.07+1609
// @author          Jan (jxn_30)
// @description     Adds a link to the dashboard to the navigation and shows some charts on the dashboard
// @description:de  Fügt der Navigation einen Link zum Dashboard hinzu und zeigt einige Charts auf dem Dashboard an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/forum/dashboard.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/forum/dashboard.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/16451-forum-dashboard/
// @match           https://forum.leitstellenspiel.de/*
// @resource        amcharts https://github.com/jxn-30/LSS-Scripts/raw/master/resources/forum/dashboard.user.js/amcharts.js#sha256=2f8fffba1c31c627e341a0755fab716fed4e12f9292deb28e0ce052fa46b9198
// @resource        amchartsXY https://github.com/jxn-30/LSS-Scripts/raw/master/resources/forum/dashboard.user.js/amchartsXY.js#sha256=a0cfd0673a5a87d1cd30ab9cec69b9a33ae45575f07bd61ec938a6808ec602ac
// @run-at          document-body
// @grant           GM_getResourceURL
// ==/UserScript==

/**
 * @name Forum: Dashboard
 * @description Adds a link to the dashboard to the navigation and shows some charts on the dashboard
 * @description:de Fügt der Navigation einen Link zum Dashboard hinzu und zeigt einige Charts auf dem Dashboard an
 * @forum https://forum.leitstellenspiel.de/index.php?thread/16451-forum-dashboard/
 * @match /*
 * @// required so that the forum inits the mobile menu correctly
 * @run-at document-body
 * @locale de_DE
 * @subdomain forum
 * @resource amcharts https://cdn.amcharts.com/lib/5/index.js
 * @resource amchartsXY https://cdn.amcharts.com/lib/5/xy.js
 * @old LSS-Forum-Dashboard
 * @grant GM_getResourceURL
 */

const isDashboardPage = window.location.search.startsWith('?dashboard/');

// add the dashboard link to navigation (everywhere)
const dashboardLi = document.createElement('li');

const dashboardLink = document.createElement('a');
dashboardLink.href = '/cms/index.php?dashboard';

if (isDashboardPage) {
    dashboardLi.classList.add('active');
    dashboardLink.classList.add('active');
}

const dashboardSpan = document.createElement('span');
dashboardSpan.textContent = 'Dashboard';

dashboardLink.appendChild(dashboardSpan);
dashboardLi.append(dashboardLink);

// desktop
dashboardSpan.classList.add('boxMenuLinkTitle');
document.querySelector('.boxMenu')?.append(dashboardLi);

// mobile
const mobileLi = dashboardLi.cloneNode(true);
mobileLi.classList.add('menuOverlayItem');
mobileLi.querySelector('a')?.classList.add('menuOverlayItemLink');
mobileLi.querySelector('span')?.classList.add('menuOverlayItemTitle');
document
    .querySelector(
        '#pageMainMenuMobile > .menuOverlayItemList > .menuOverlayItemSpacer'
    )
    ?.before(mobileLi);

// dashboard stuff (on dashboard page only and when page has loaded)
const loadDashboard = async () => {
    /**
     * load a script by resource name
     * @param resource
     * @returns {Promise<unknown>}
     */
    const loadScript = resource => {
        return new Promise((resolve, reject) => {
            const src = GM_getResourceURL(resource);
            if (!src) {
                reject(`Resource ${resource} has empty URL. Wrong integrity?`);
            }
            const script = document.createElement('script');
            script.src = src;
            script.addEventListener('load', resolve);
            script.addEventListener('error', reject);
            document.body.append(script);
        });
    };

    // get amount of posts and likes
    const [posts, likes] = Array.from(
        document.querySelectorAll('.sidebar .containerContent dd')
    ).map(el => parseInt(el.textContent.replace(/\D+/g, '')));

    const likesPerPost = likes / posts;
    // const likesPostsDiff = posts - likes;

    // add likes per post to sidebar
    const lppDt = document.createElement('dt');
    lppDt.textContent = 'Likes per Post';
    const lppDd = document.createElement('dd');
    lppDd.textContent = likesPerPost.toFixed(4);
    document.querySelector('.sidebar .containerContent').append(lppDt, lppDd);

    const chartContainer = document.createElement('div');
    chartContainer.id = 'jxn-dashboard-chart_container';
    document.querySelector('.sidebar .boxContent').append(chartContainer);

    await loadScript('amcharts')
        .then(() => Promise.all(['amchartsXY'].map(loadScript)))
        .catch(console.error);

    /* global am5, am5xy */ // they are defined by the import
    const am5Root = am5.Root.new(chartContainer.id);

    const addChart = (data) => {
        const chart = am5Root.container.children.push(am5xy.XYChart.new(am5Root, {
            focusable: false,
            panX: true,
            panY: false,
            wheelX: "panX"
        }));
        const xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(am5Root, {
                maxDeviation: 0.1,
                groupData: false,
                renderer: am5xy.AxisRendererX.new(am5Root, {
                    minGridDistance: 50
                }),
                tooltip: am5.Tooltip.new(am5Root, {})
            })
        );
        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(am5Root, {
                maxDeviation: 0.1,
                renderer: am5xy.AxisRendererY.new(am5Root, {})
            })
        );
        const series = chart.series.push(
            am5xy.LineSeries.new(am5Root, {
                minBulletDistance: 10,
                xAxis,
                yAxis,
                valueYField: "value",
                valueXField: "date",
                tooltip: am5.Tooltip.new(am5Root, {
                    pointerOrientation: "horizontal",
                    labelText: "{valueY}"
                })
            })
        );
        series.strokes.template.setAll({
            strokeWidth: 3,
            templateField: "strokeSettings"
        });

        series.data.setAll(data);

        const cursor = chart.set("cursor", am5xy.XYCursor.new(am5Root, {
            xAxis
        }));
        cursor.lineY.set("visible", false);

        chart.set("scrollbarX", am5.Scrollbar.new(am5Root, {
            orientation: "horizontal"
        }));
    }

    addChart([]);


    // TODO: get storage
    // TODO: show charts
    // TODO: save current data to storage (if not saved in last 60min)
};

if (isDashboardPage) (() => loadDashboard())();

// Memberlist points diff and posts needed
if (
    window.location.search.startsWith('?members-list/') &&
    window.location.search.match(/sortField=activityPoints/)
) {
    /**
     * parses the element to a number
     * @param {HTMLElement} [element]
     * @returns {number}
     */
    const readNumberFromEl = element =>
        parseInt(
            element?.textContent
                .trim()
                .match(/^\d{1,3}(?:[.,]\d{3})*/)[0]
                .replace(/\D/g, '') ?? '0'
        );

    let previousPoints;
    document
        .querySelectorAll('.userList > li .userInformation .inlineDataList')
        .forEach(user => {
            const posts = readNumberFromEl(
                user.querySelector('dd:nth-of-type(1)')
            );
            const likes = readNumberFromEl(
                user.querySelector('dd:nth-of-type(2)')
            );
            const points = readNumberFromEl(
                user.querySelector('dd:nth-of-type(3)')
            );
            const diffTitle = document.createElement('dt');
            diffTitle.innerText = 'Punkte-Diff';
            const diffValue = document.createElement('dd');
            const diff = (previousPoints || points) - points;
            diffValue.innerText = diff.toLocaleString();
            const postsTitle = document.createElement('dt');
            postsTitle.innerText = 'Posts needed';
            const postsValue = document.createElement('dd');
            // diff = 5 * posts + lpp * posts <=> posts = diff / (5 + lpp)
            postsValue.innerText = Math.ceil(
                diff / (5 + likes / posts)
            ).toLocaleString();
            user.append(
                diffTitle,
                '\xa0',
                diffValue,
                '\xa0',
                postsTitle,
                '\xa0',
                postsValue
            );
            previousPoints = points;
        });
}
