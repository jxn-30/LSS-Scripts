// ==UserScript==
// @name            [LSS] Forum: Dashboard
// @namespace       https://jxn.lss-manager.de
// @version         2023.04.06+1245
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
// @resource        amcharts https://github.com/jxn-30/LSS-Scripts/raw/b81f4151ef/resources/forum/dashboard.user.js/amcharts.js#sha256=860d8e619bb0620dc83abadf85753682d309ec8fc10ddc9a8dd981c23e3e6feb
// @resource        amchartsXY https://github.com/jxn-30/LSS-Scripts/raw/b81f4151ef/resources/forum/dashboard.user.js/amchartsXY.js#sha256=f6cf79651883314a92ed559e15f6686d8b8ad3d8d44f91beeb9d58599a00d4a6
// @resource        amchartsExport https://github.com/jxn-30/LSS-Scripts/raw/b81f4151ef/resources/forum/dashboard.user.js/amchartsExport.js#sha256=7c9130a8bf4e4c5308e3ce4a33d4c38606eebcec5a067c94570fed7223fffa3b
// @resource        amchartsThemeDark https://github.com/jxn-30/LSS-Scripts/raw/b81f4151ef/resources/forum/dashboard.user.js/amchartsThemeDark.js#sha256=a8e6534baad20a07e76f094302df013777146d069174862ac46b4c378b3798dd
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
 * @resource amchartsExport https://cdn.amcharts.com/lib/5/plugins/exporting.js
 * @resource amchartsThemeDark https://cdn.amcharts.com/lib/5/themes/Dark.js
 * @old LSS-Forum-Dashboard
 * @grant GM_getResourceURL
 */

const DARK_THEME = false;

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

    const amChartModules = ['amchartsXY', 'amchartsExport'];
    if (DARK_THEME) amChartModules.push('amchartsThemeDark');

    await loadScript('amcharts')
        .then(() => Promise.all(amChartModules.map(loadScript)))
        .catch(console.error);

    /* global am5, am5xy, am5plugins_exporting, am5themes_Dark */ // they are defined by the import
    if (!am5 || !am5xy || !am5plugins_exporting) return;

    const COLORS = ['#90FF04', '#6F00FB'];

    /**
     * @typedef ChartData
     * @property {Array} data
     * @property {string} valueField
     * @property {string} [color]
     * @property {string} [name]
     */

    /**
     * creates a chart and adds it to the charts wrapper element
     * @param {string} title
     * @param {...ChartData} data
     */
    const addChart = (title, ...data) => {
        const chartContainer = document.createElement('div');
        chartContainer.id = `jxn-dashboard-chart_container-${crypto.randomUUID()}`;
        document.querySelector('.sidebar .boxContent').append(chartContainer);

        const containerWidth = parseInt(getComputedStyle(chartContainer).width);
        // noinspection JSSuspiciousNameCombination
        const containerHeight = containerWidth;

        chartContainer.style.setProperty('height', `${containerHeight + 20}px`);

        const am5Root = am5.Root.new(chartContainer.id);
        if (DARK_THEME) am5Root.setThemes([am5themes_Dark.new(am5Root)]);

        const chart = am5Root.container.children.push(
            am5xy.XYChart.new(am5Root, {
                focusable: false,
                panX: false,
                panY: false,
                wheelX: 'panX',
                width: containerWidth,
                maxHeight: containerHeight,
                layout: am5Root.verticalLayout,
            })
        );
        const xAxis = chart.xAxes.push(
            am5xy.DateAxis.new(am5Root, {
                tooltipDateFormat: 'dd.MM HH:mm:ss',
                baseInterval: {
                    timeUnit: 'second',
                    count: 1,
                },
                renderer: am5xy.AxisRendererX.new(am5Root, {}),
                tooltip: am5.Tooltip.new(am5Root, {}),
            })
        );
        const yAxis = chart.yAxes.push(
            am5xy.ValueAxis.new(am5Root, {
                renderer: am5xy.AxisRendererY.new(am5Root, {}),
            })
        );
        yAxis.axisHeader.children.push(
            am5.Label.new(am5Root, {
                text: title,
                fontWeight: '500',
                paddingBottom: 0,
                textAlign: 'center',
                x: am5.percent(50),
                centerX: am5.percent(50),
            })
        );
        yAxis.axisHeader.get('background').setAll({
            fill: am5.color(0x000000),
            fillOpacity: 0,
        });

        const allSeries = [];

        data.forEach((data, index) => {
            const series = chart.series.push(
                am5xy.LineSeries.new(am5Root, {
                    name: data.name,
                    xAxis,
                    yAxis,
                    valueYField: data.valueField,
                    valueXField: 'date',
                    tooltip: am5.Tooltip.new(am5Root, {
                        pointerOrientation: 'horizontal',
                        labelText: '{valueY}',
                    }),
                    stroke: am5.color(
                        data.color ?? COLORS[index % COLORS.length]
                    ),
                    legendLabelText: '{name}',
                    legendRangeLabelText: '{name}',
                })
            );
            series.strokes.template.setAll({
                strokeWidth: 1,
            });

            series.data.setAll(data.data);

            allSeries.push(series);
        });

        if (data.length > 1) {
            const legend = chart.children.push(am5.Legend.new(am5Root, {}));
            legend.data.setAll(chart.series.values);
        }

        am5plugins_exporting.Exporting.new(am5Root, {
            menu: am5plugins_exporting.ExportingMenu.new(am5Root, {}),
            dataSource: chart.series.values,
        });

        const cursor = chart.set(
            'cursor',
            am5xy.XYCursor.new(am5Root, {
                xAxis,
                behavior: 'zoomX',
                snapToSeries: allSeries,
            })
        );
        cursor.lineY.set('visible', false);
    };

    const storageKey = 'bldiff';
    const storage = JSON.parse(localStorage.getItem(storageKey) || '{}');

    const chartData = Object.entries(storage)
        .map(([date, { p: posts, l: likes }]) => ({
            date: parseInt(date),
            postLikesDiff: posts - likes,
            posts,
            likes,
            likesPerPost: likes / posts,
            postsPerLike: posts / likes,
        }))
        .concat({
            date: Date.now(),
            postLikesDiff: posts - likes,
            posts,
            likes,
            likesPerPost,
            postsPerLike: posts / likes,
        });

    addChart('Abstand Posts – Likes', {
        data: chartData,
        valueField: 'postLikesDiff',
    });

    addChart(
        'Verlauf Posts und Likes',
        {
            data: chartData,
            valueField: 'posts',
            name: 'Posts',
        },
        {
            data: chartData,
            valueField: 'likes',
            name: 'Likes',
        }
    );

    addChart(
        'Verlauf Likes pro Post',
        {
            data: chartData,
            valueField: 'likesPerPost',
            name: 'Likes pro Post',
        },
        {
            data: chartData,
            valueField: 'postsPerLike',
            name: 'Posts pro Like',
        }
    );

    const lastSavedDate = Math.max(
        ...Object.keys(storage).map(timestamp => parseInt(timestamp))
    );
    // last savedDate is more than 1h ago
    if (lastSavedDate + 1000 * 60 * 60 <= Date.now()) {
        storage[Date.now()] = { p: posts, l: likes };
        localStorage.setItem(storageKey, JSON.stringify(storage));
    }
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
