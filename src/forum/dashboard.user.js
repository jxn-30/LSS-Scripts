// ==UserScript==
// @name            [LSS] Forum: Dashboard
// @namespace       https://jxn.lss-manager.de
// @version         2022.12.01+1121
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
// @run-at          document-body
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
 * @old LSS-Forum-Dashboard
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

const loadDashboard = () => {
    // TODO: load AMCharts including themes and plugins
    // TODO: get likes per post
    // TODO: get storage
    // TODO: calc current data
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
