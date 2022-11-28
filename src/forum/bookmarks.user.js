// ==UserScript==
// @name            [LSS] Forum: Bookmarks
// @name:de         [LSS] Forum: Lesezeichen
// @namespace       https://jxn.lss-manager.de
// @version         2022.11.28+2049
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
// @run-at          document-body
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name Forum: Bookmarks
 * @name:de Forum: Lesezeichen
 * @description An internal Bookmark Manager for the general forum
 * @description:de Ein interner Lesezeichen-Manager für das allgemeine Forum
 * @forum https://forum.leitstellenspiel.de/index.php?thread/17627-forum-bookmark-manager/
 * @match /*
 * @// required so that the forum inits the mobile menu correctly
 * @run-at document-body
 * @locale de_DE
 * @subdomain forum
 * @old Forum-Bookmarks.min
 * @grant GM_addStyle
 */

/**
 * @typedef Menu
 * @property {HTMLLIElement} _menu
 * @property {function(): Element} menu
 * @property {function(): Element} list
 * @property {function(): Element} actionSeparator
 * @property {HTMLAnchorElement} exportLink
 */

/**
 * @typedef {Object<string, string>} OldBookmarks
 */

/**
 * @typedef Bookmark
 * @property {string} title
 * @property {string} url
 */

/**
 * @typedef {Bookmark[]} Bookmarks
 */

// create menu for navigation
class BookmarkManager {
    /**
     * @static
     * @constant
     * @private
     * @returns {string}
     */
    static get #oldStorageKey() {
        return 'bookmarks';
    }
    /**
     * @static
     * @constant
     * @private
     * @returns {string}
     */
    static get #storageKey() {
        return 'jxn-bookmarks';
    }
    /**
     * @static
     * @constant
     * @private
     * @returns {string}
     */
    static get #actionClass() {
        return 'jxn-bookmark-actions';
    }
    /**
     * @static
     * @constant
     * @private
     * @returns {string}
     */
    static get #actionSeparatorClass() {
        return 'jxn-bookmark-action-separator';
    }
    /**
     * @static
     * @constant
     * @private
     * @returns {string}
     */
    static get #modalClass() {
        return 'jxn-bookmark-modal';
    }
    /**
     * @static
     * @constant
     * @private
     * @returns {{linkTitle: string, link: string, menu: string, dropdown: string}}
     */
    static get #desktopClasses() {
        return {
            menu: 'boxMenuHasChildren',
            dropdown: 'boxMenuDepth1',
            link: 'boxMenuLink',
            linkTitle: 'boxMenuLinkTitle',
        };
    }
    /**
     * @static
     * @constant
     * @private
     * @returns {{linkTitle: string, item: string, link: string, dropdown: string, wrapper: string, linkIcon: string}}
     */
    static get #mobileClasses() {
        return {
            item: 'menuOverlayItem',
            wrapper: 'menuOverlayItemWrapper',
            dropdown: 'menuOverlayItemList',
            link: 'menuOverlayItemLink',
            linkIcon: 'menuOverlayItemLinkIcon',
            linkTitle: 'menuOverlayItemTitle',
        };
    }

    /** @type {Menu} */
    #menuDesktop;

    /** @type {Menu} */
    #menuMobile;

    constructor() {
        this.#menuDesktop = this.#createMenu(false);
        document.querySelector('.boxMenu')?.prepend(this.#menuDesktop._menu);
        this.#menuMobile = this.#createMenu(true);
        document
            .querySelector(
                '#pageMainMenuMobile > .menuOverlayItemList > .menuOverlayTitle'
            )
            ?.after(this.#menuMobile._menu);

        // convert old bookmark storage to new one
        if (BookmarkManager.#oldStorageKey in localStorage) {
            this.#bookmarks = Object.entries(
                JSON.parse(localStorage.getItem(BookmarkManager.#oldStorageKey))
            ).map(([url, title]) => ({ url, title }));
            localStorage.removeItem(BookmarkManager.#oldStorageKey);
        }

        this.#initMenus();

        // we need to use document here because the forum modifies some items in our menu
        document.addEventListener('click', e => {
            const link = e.target.closest(
                `:where(${[this.#menuDesktop, this.#menuMobile]
                    .map(({ list }) => `#${list().id}`)
                    .join(', ')}) .${BookmarkManager.#actionClass}[data-action]`
            );
            if (!link) return;
            switch (link.dataset.action) {
                case 'set':
                    this.#setBookmark();
                    break;
                case 'import':
                    this.#importBookmarks();
                    break;
            }
        });

        GM_addStyle(`
.${BookmarkManager.#modalClass} {
    width: 100%;
    max-width: 100%;
    background-color: #000;
}
.${BookmarkManager.#modalClass} .title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 1em;
}
.${BookmarkManager.#modalClass} input[type="text"] {
    width: 100%;
}
.${BookmarkManager.#modalClass} input[type="submit"] {
    margin-top: 1em;
}
`);
    }

    get #bookmarkStorage() {
        return localStorage.getItem(BookmarkManager.#storageKey) || '{}';
    }

    /**
     * @private
     * @returns {Bookmarks}
     */
    get #bookmarks() {
        return JSON.parse(this.#bookmarkStorage);
    }
    /**
     * @private
     * @param {Bookmarks} bookmarks
     */
    set #bookmarks(bookmarks) {
        localStorage.setItem(
            BookmarkManager.#storageKey,
            JSON.stringify(bookmarks)
        );
        this.#setExportLinks();
    }

    /**
     * @private
     * @returns {string}
     */
    get #export() {
        return `data:application/json;charset=utf-8,${encodeURIComponent(
            this.#bookmarkStorage
        )}`;
    }

    /**
     * empty the menus and refill them with current bookmarks
     * @private
     */
    #initMenus() {
        this.#clearMenu(this.#menuDesktop);
        this.#clearMenu(this.#menuMobile);
        const appendBookmark = this.#appendBookmark.bind(this);
        this.#bookmarks.forEach(({ url, title }) => appendBookmark(url, title));
        this.#setExportLinks();
    }

    /**
     * delete all bookmark items from a menu
     * @private
     * @param {Menu} menu
     */
    #clearMenu(menu) {
        const list = menu.list();
        while (
            !list.firstElementChild?.classList.contains(
                BookmarkManager.#actionSeparatorClass
            )
        ) {
            list.firstElementChild.remove();
        }
    }

    /**
     * @private
     */
    #setExportLinks() {
        this.#menuDesktop.exportLink.href = this.#menuMobile.exportLink.href =
            this.#export;
    }

    /**
     * creates an empty menu item
     * @private
     * @param {boolean} mobile
     * @param {string} title
     * @param {string} [url]
     * @return {{item: HTMLLIElement, link: HTMLAnchorElement}}
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
        return { item, link };
    }

    /**
     * create a menu
     * @private
     * @param {boolean} mobile
     * @returns {Menu}
     */
    #createMenu(mobile) {
        const menu = document.createElement('li');
        menu.id = `jxn-forum-bookmarks-menu-${mobile ? 'mobile' : 'desktop'}`;
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

        if (!mobile) {
            GM_addStyle(`
#${dropdown.id} {
    max-height: calc(100vh - 50px - 1em);
    overflow: auto;
}
`);
        }

        // create action buttons
        const actionSeparator = document.createElement('li');
        actionSeparator.classList.add(BookmarkManager.#actionSeparatorClass);
        if (mobile) actionSeparator.classList.add('menuOverlayItemSpacer');
        else actionSeparator.append(document.createElement('hr'));

        const { item: setBookmark } = this.#createMenuItem(
            mobile,
            '#',
            'Lesezeichen setzen'
        );
        setBookmark.classList.add(BookmarkManager.#actionClass);
        setBookmark.dataset.action = 'set';

        const { item: manageBookmarks } = this.#createMenuItem(
            mobile,
            '#',
            'Lesezeichen verwalten'
        );

        const { item: exportBookmarks, link: exportBookmarksLink } =
            this.#createMenuItem(mobile, '#', 'Lesezeichen exportieren');
        exportBookmarksLink.download = 'lss_forum_lesezeichen.json';

        const { item: importBookmarks } = this.#createMenuItem(
            mobile,
            '#',
            'Lesezeichen importieren'
        );
        importBookmarks.classList.add(BookmarkManager.#actionClass);
        importBookmarks.dataset.action = 'import';

        menu.append(dropdown);

        dropdown.append(
            actionSeparator,
            setBookmark,
            manageBookmarks,
            exportBookmarks,
            importBookmarks
        );

        const getMenu = () => document.querySelector(`#${menu.id}`);
        const getList = () => getMenu().querySelector(`#${dropdown.id}`);
        const getActionSeparator = () =>
            getList().querySelector(
                `.${BookmarkManager.#actionSeparatorClass}`
            );

        return {
            _menu: menu,
            menu: getMenu,
            list: getList,
            actionSeparator: getActionSeparator,
            exportLink: exportBookmarksLink,
        };
    }

    /**
     * append a bookmark to all menus
     * @private
     * @param {string} url
     * @param {string} [title]
     */
    #appendBookmark(url, title = url) {
        this.#menuDesktop
            .actionSeparator()
            .before(this.#createMenuItem(false, url, title).item);
        this.#menuMobile
            .actionSeparator()
            .before(this.#createMenuItem(true, url, title).item);
    }

    /**
     * creates and shows a modal
     * @private
     * @param {string} title
     * @return {HTMLDivElement}
     */
    #createModal(title) {
        const modal = document.createElement('div');
        modal.classList.add(
            'balloonTooltip',
            'interactive',
            'active',
            BookmarkManager.#modalClass
        );

        const titleElement = document.createElement('div');
        titleElement.classList.add('title');
        titleElement.textContent = title;
        modal.append(titleElement);
        this.#menuDesktop.menu().after(modal);

        return modal;
    }

    /**
     * set a new bookmark
     * @private
     */
    #setBookmark() {
        const modal = this.#createModal('Lesezeichen setzen');

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'URL';
        urlInput.value = window.location.href;
        const titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.placeholder = 'Titel';
        titleInput.value =
            (
                document.querySelector('.contentTitle') ??
                document.querySelector('title')
            )?.textContent
                ?.trim()
                ?.replace(/"/g, '&#34;') ?? '';
        const saveBtn = document.createElement('input');
        saveBtn.type = 'submit';
        saveBtn.value = 'Speichern';
        saveBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            const title = titleInput.value.trim();
            this.#appendBookmark(url, title);
            const bookmarks = this.#bookmarks;
            bookmarks.push({ url, title });
            this.#bookmarks = bookmarks;
            modal.remove();
        });
        const cancelBtn = document.createElement('input');
        cancelBtn.type = 'button';
        cancelBtn.value = 'Abbrechen';
        cancelBtn.addEventListener('click', () => modal.remove());

        modal.append(urlInput, titleInput, saveBtn, cancelBtn);
    }

    /**
     * imports bookmarks from a file
     * @private
     */
    #importBookmarks() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json,.json';
        fileInput.addEventListener('change', () => {
            if (!fileInput.files.length) return;
            const [file] = fileInput.files;
            const fileReader = new FileReader();
            fileReader.addEventListener('load', () => {
                this.#bookmarks = JSON.parse(fileReader.result.toString());
                this.#initMenus();
            });
            fileReader.readAsText(file);
        });
        fileInput.click();
    }
}

new BookmarkManager();
