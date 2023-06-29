// ==UserScript==
// @name            [LSS] Mobile Layout
// @name:de         [LSS] Mobiles Layout
// @namespace       https://jxn.lss-manager.de
// @version         2023.06.29+1345
// @author          Jan (jxn_30)
// @description     Enables the mobile layout on desktop devices
// @description:de  Aktiviert das mobile Layout auf Desktop-Geräten
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/mobileLayout.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/mobileLayout.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/19297-kann-man-das-mobile-layout-auch-auf-dem-pc-haben/
// @match           https://www.operacni-stredisko.cz/*
// @match           https://policie.operacni-stredisko.cz/*
// @match           https://www.alarmcentral-spil.dk/*
// @match           https://politi.alarmcentral-spil.dk/*
// @match           https://www.leitstellenspiel.de/*
// @match           https://polizei.leitstellenspiel.de/*
// @match           https://www.missionchief-australia.com/*
// @match           https://police.missionchief-australia.com/*
// @match           https://www.missionchief.co.uk/*
// @match           https://police.missionchief.co.uk/*
// @match           https://www.missionchief.com/*
// @match           https://police.missionchief.com/*
// @match           https://www.centro-de-mando.es/*
// @match           https://www.centro-de-mando.mx/*
// @match           https://www.hatakeskuspeli.com/*
// @match           https://poliisi.hatakeskuspeli.com/*
// @match           https://www.operateur112.fr/*
// @match           https://police.operateur112.fr/*
// @match           https://www.operatore112.it/*
// @match           https://polizia.operatore112.it/*
// @match           https://www.missionchief-japan.com/*
// @match           https://www.missionchief-korea.com/*
// @match           https://www.nodsentralspillet.com/*
// @match           https://politiet.nodsentralspillet.com/*
// @match           https://www.meldkamerspel.com/*
// @match           https://politie.meldkamerspel.com/*
// @match           https://www.operatorratunkowy.pl/*
// @match           https://policja.operatorratunkowy.pl/*
// @match           https://www.operador193.com/*
// @match           https://www.jogo-operador112.com/*
// @match           https://policia.jogo-operador112.com/*
// @match           https://www.jocdispecerat112.com/*
// @match           https://www.dispetcher112.ru/*
// @match           https://www.dispecerske-centrum.com/*
// @match           https://www.larmcentralen-spelet.se/*
// @match           https://polis.larmcentralen-spelet.se/*
// @match           https://www.112-merkez.com/*
// @match           https://www.dyspetcher101-game.com/*
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name Mobile Layout
 * @name:de Mobiles Layout
 * @description Enables the mobile layout on desktop devices
 * @description:de Aktiviert das mobile Layout auf Desktop-Geräten
 * @forum https://forum.leitstellenspiel.de/index.php?thread/19297-kann-man-das-mobile-layout-auch-auf-dem-pc-haben/
 * @grant GM_addStyle
 * @grant unsafeWindow
 */

// the key for localStorage that stores which view is currently active
const VIEW_STORAGE_KEY = 'jxn-mobile-layout-view';

// =================== SHOW THE FOOTER FOR SWITCHING MENUS ===================
/** @type {HTMLDivElement | null} */
const mobileFooter = document.querySelector('#navbar-mobile-footer');

mobileFooter?.classList.remove('visible-xs');

/** @type {HTMLDivElement | null} */
const btnWrapper = mobileFooter?.querySelector('.navbar-header');

btnWrapper?.style.setProperty('width', '100%');

// =================== HIDE THE DEFAULT FOOTER ===================
document.documentElement.classList.add('hide-footer');

// =================== ADJUST DOM FOR BETTER DESIGN ===================
// we have to do this at every view change because it otherwise doesn't always work as expected
/** @type {function} */
const mobileShowOrig = unsafeWindow.mobileShow;
unsafeWindow.mobileShow = (...args) => {
    // call the original function
    mobileShowOrig(...args);

    localStorage.setItem(VIEW_STORAGE_KEY, args[0]);

    // remove col-classes and add padding
    document.querySelectorAll('#content > .overview_outer').forEach(el => {
        el.classList.forEach(className => {
            if (className.match(/col-(xs|sm|md|lg)-[0-9]+/)) {
                el.classList.remove(className);
            }
        });
    });
    // trigger resize event for map to adjust size
    window.dispatchEvent(new Event('resize'));
};

// =================== ADD STYLES ===================
GM_addStyle(`
/* hide the footer when the class is set */
html.hide-footer #footer_hr, html.hide-footer footer.footer, .client-id {
    display: none;
}

/* add margin for non-map views */
#content > :not(#map_outer) {
    margin-left: 15px;
    margin-right: 15px;
}

/* remove top for the map and adjust height */
#map_outer {
    margin-top: -20px;
}
#map_outer, #map {
    --map-height: calc(100vh - 50px - 68px); /* 50px is navbar, 68px is footer */
    min-height: var(--map-height);
    height: var(--map-height);
    max-height: var(--map-height);
}
`);

// =================== INITIALLY SET THE VIEW ===================
unsafeWindow.mobileShow(localStorage.getItem(VIEW_STORAGE_KEY) ?? 'map');
