// ==UserScript==
// @name            [LSS] Forum: Bookmarks
// @name:de         [LSS] Forum: Lesezeichen
// @namespace       https://jxn.lss-manager.de
// @version         2022.11.27+2257
// @author          Jan (jxn_30)
// @description     An internal Bookmark Manager for the general forum
// @description:de  Ein interner Lesezeichen-Manager für das allgemeine Forum
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/forum/bookmarks.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/forum/bookmarks.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/17627-forum-bookmark-manager/
// @match           https://forum.leitstellenspiel.de/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Forum: Bookmarks
 * @name:de Forum: Lesezeichen
 * @description An internal Bookmark Manager for the general forum
 * @description:de Ein interner Lesezeichen-Manager für das allgemeine Forum
 * @forum https://forum.leitstellenspiel.de/index.php?thread/17627-forum-bookmark-manager/
 * @match /*
 * @locale de_DE
 * @subdomain forum
 * @old Forum-Bookmarks.min
 */

/* global require */

/**
 * @typedef {HTMLLIElement} Menu
 * @extends {HTMLLIElement}
 * @property {HTMLLIElement} actionSeparator
 */

// create menu for navigation
class BookmarkManager {
    /**
     * @private
     * @type {{linkTitle: string, link: string, menu: string, dropdown: string}}
     */
    static #desktopClasses = {
        menu: 'boxMenuHasChildren',
        dropdown: 'boxMenuDepth1',
        link: 'boxMenuLink',
        linkTitle: 'boxMenuLinkTitle',
    };
    /**
     * @private
     * @type {{linkTitle: string, item: string, link: string, dropdown: string, wrapper: string, linkIcon: string}}
     */
    static #mobileClasses = {
        item: 'menuOverlayItem',
        wrapper: 'menuOverlayItemWrapper',
        dropdown: 'menuOverlayItemList',
        link: 'menuOverlayItemLink',
        linkIcon: 'menuOverlayItemLinkIcon',
        linkTitle: 'menuOverlayItemTitle',
    };

    /** @type {Menu} */
    #menuDesktop = null;

    /** @type {Menu} */
    #menuMobile = null;

    constructor() {
        this.#menuDesktop = this.#createMenu(false);
        document.querySelector('.boxMenu')?.prepend(this.#menuDesktop);
        this.#menuMobile = this.#createMenu(true);
        document
            .querySelector(
                '#pageMainMenuMobile > .menuOverlayItemList > .menuOverlayTitle'
            )
            ?.after(this.#menuMobile);
        require('WoltLabSuite/Core/Ui/Page/Menu/Main').prototype.init();
    }

    /**
     * creates an empty menu item
     * @param {boolean} mobile
     * @param {string} title
     * @param {string} [url]
     * @return {HTMLLIElement}
     */
    #createMenuItem(mobile, url, title = url) {
        const item = document.createElement('li');
        if (mobile) {
            item.classList.add(BookmarkManager.#mobileClasses.item);
        }

        const link = document.createElement('a');
        link.href = url;
        link.classList.add(
            mobile
                ? BookmarkManager.#mobileClasses.link
                : BookmarkManager.#desktopClasses.link
        );

        const text = document.createElement('span');
        text.textContent = title;
        text.classList.add(
            mobile
                ? BookmarkManager.#mobileClasses.linkTitle
                : BookmarkManager.#desktopClasses.linkTitle
        );

        link.append(text);
        item.append(link);
        return item;
    }

    /**
     * create a menu
     * @private
     * @param {boolean} mobile
     * @returns {Menu}
     */
    #createMenu(mobile) {
        const menu = document.createElement('li');
        menu.classList.add(
            mobile
                ? BookmarkManager.#mobileClasses.item
                : BookmarkManager.#desktopClasses.menu
        );

        if (mobile) {
            const link = document.createElement('a');
            link.classList.add(BookmarkManager.#mobileClasses.link);
            const linkText = document.createElement('span');
            linkText.classList.add(BookmarkManager.#mobileClasses.linkTitle);
            linkText.textContent = 'Lesezeichen';
            link.append(linkText);
            menu.append(link);
        } else {
            const menuLink = document.createElement('a');
            menuLink.classList.add(BookmarkManager.#desktopClasses.link);
            const menuIcon = document.createElement('span');
            menuIcon.classList.add('icon', 'icon16', 'fa-bookmark-o');
            menuLink.appendChild(menuIcon);
            menu.append(menuLink);
        }

        const dropdown = document.createElement('ol');
        dropdown.classList.add(
            mobile
                ? BookmarkManager.#mobileClasses.dropdown
                : BookmarkManager.#desktopClasses.dropdown
        );
        dropdown.id = `jxn-forum-bookmarks-dropdown-${
            mobile ? 'mobile' : 'desktop'
        }`;

        menu.append(dropdown);

        // create action buttons
        menu.actionSeparator = document.createElement('li');
        if (mobile) menu.actionSeparator.classList.add('menuOverlayItemSpacer');
        else menu.actionSeparator.append(document.createElement('hr'));

        const setBookmark = this.#createMenuItem(
            mobile,
            '#',
            'Lesezeichen setzen'
        );
        //
        // const setBookmarkWrapper = document.createElement('li');
        // const setBookmarkButton = document.createElement('a');
        // setBookmarkButton.classList.add('boxMenuLink');
        // setBookmarkButton.textContent = 'Lesezeichen setzen';
        // setBookmarkWrapper.appendChild(setBookmarkButton);
        //
        // const manageBookmarksWrapper = document.createElement('li');
        // const manageBookmarksButton = document.createElement('a');
        // manageBookmarksButton.classList.add('boxMenuLink');
        // manageBookmarksButton.textContent = 'Lesezeichen verwalten';
        // manageBookmarksWrapper.appendChild(manageBookmarksButton);
        //
        // const exportBookmarksWrapper = document.createElement('li');
        // const exportBookmarksButton = document.createElement('a');
        // exportBookmarksButton.classList.add('boxMenuLink');
        // exportBookmarksButton.download = 'lss_forum_lesezeichen.json';
        // exportBookmarksButton.textContent = 'Lesezeichen exportieren';
        // exportBookmarksWrapper.appendChild(exportBookmarksButton);
        //
        // const importBookmarksWrapper = document.createElement('li');
        // const importBookmarksButton = document.createElement('a');
        // importBookmarksButton.classList.add('boxMenuLink');
        // importBookmarksButton.textContent = 'Lesezeichen importieren';
        // const importBookmarksInput = document.createElement('input');
        // importBookmarksInput.type = 'file';
        // importBookmarksInput.accept = 'application/json,.json';
        // importBookmarksWrapper.appendChild(importBookmarksButton);
        // importBookmarksWrapper.addEventListener('click', () =>
        //     importBookmarksInput.click()
        // );
        //
        dropdown.append(menu.actionSeparator, setBookmark);

        return menu;
    }
}

new BookmarkManager();

// fill dropdown with bookmarks
/**
 * Add a bookmark to the dropdown menu
 * @param {Menu} menu
 * @param {string} [link]
 * @param {string} [title]
 */
// const appendBookmark = (menu, link = '', title = link) => {
//     const bookmarkWrapper = document.createElement('li');
//     const bookmarkLink = document.createElement('a');
//     bookmarkLink.classList.add('boxMenuLink');
//     if (link) bookmarkLink.href = link;
//     bookmarkLink.textContent = title;
//     bookmarkWrapper.appendChild(bookmarkLink);
//     menu.actionSeparator.before(bookmarkWrapper);
// };
//
// appendBookmark(desktopMenu, 'huhu.de', 'Ein Link');
// appendBookmark(desktopMenu, 'example.com');
//
// appendBookmark(mobileMenu, 'huhu.de', 'Ein Link');
// appendBookmark(mobileMenu, 'example.com');
