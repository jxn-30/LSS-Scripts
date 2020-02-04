// ==UserScript==
// @name         LSS-Forum-Bookmarks
// @version      1.0.0
// @description  Ein Interner Lesezeichen-Manager für das allgemeine Forum
// @author       Jan (KBOE2)
// @include      https://forum.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

document.querySelector('.boxMenu').insertAdjacentHTML(
    'afterbegin',
    '<li class="boxMenuHasChildren"><a class="boxMenuLink"><span class="icon icon16 fa-bookmark-o"></span></a><ol class="boxMenuDepth1" id="bookmarkList"></ol></li>' +
    '<div id="setBookmarkTooltip" class="balloonTooltip" style="pointer-events: unset; width: 100%; max-width: 100%; background-color: rgb(0, 0, 0);">' +
    `<b>Lesezeichen setzen</b><input type="text" name="url" value="${window.location.href}" placeholder="URL" style="width: 100%">` +
    `<br><input type="text" name="title" value="${document.querySelector('.contentTitle').innerText.replace(/"/g, '&#34;')}" placeholder="Name" style="width: 100%;">` +
    '<br><input id="setBookmarkSave" type="submit" value="Setzen">&nbsp;<input id="setBookmarkAbort" type="submit" value="Abbrechen"/></div>' +
    '<div id="manageBookmarksTooltip" class="balloonTooltip" style="pointer-events: unset; width: 100%; max-width: 100%; background-color: rgb(0, 0, 0);">' +
    '<div id="manageBookmarksList"></div><br><input id="manageBookmarksClose" type="submit" value="Schliessen"/></div>' +
    '</div>'
);

const drawList = () => {
    document.querySelector('#bookmarkList').innerHTML = '';
    let bookmarks = JSON.parse(localStorage.bookmarks || '{}');
    Object.keys(bookmarks).forEach(bookmark => {
        document.querySelector('#bookmarkList').insertAdjacentHTML('beforeend', `<li><a class="boxMenuLink" href="${bookmark}"><span class="boxMenuLinkTitle">${bookmarks[bookmark]}</span></a></li>`);
    });
    document.querySelector('#bookmarkList').insertAdjacentHTML('beforeend', `<li><hr></hr></li><li><a class="boxMenuLink" id="setBookmark">Lesezeichen setzen</a></li><li><a id="manageBookmarks" class="boxMenuLink">Lesezeichen verwalten</a></li>`);
    document.getElementById('setBookmark').addEventListener('click', event => {
        let tooltip = document.querySelector('#setBookmarkTooltip');
        tooltip.classList.add('active');
    });

    document.getElementById('setBookmarkSave').addEventListener('click', () => {
        let tooltip = document.querySelector('#setBookmarkTooltip');
        let bookmarks = JSON.parse(localStorage.bookmarks || '{}');
        bookmarks[tooltip.querySelector('input[name="url"]').value] = tooltip.querySelector('input[name="title"]').value;
        localStorage.bookmarks = JSON.stringify(bookmarks);
        drawList();
        tooltip.classList.remove('active');
    });

    document.getElementById('setBookmarkAbort').addEventListener('click', () => {
        let tooltip = document.querySelector('#setBookmarkTooltip');
        tooltip.classList.remove('active');
    });

    const drawManagerList = () => {
        let list = document.querySelector('#manageBookmarksList');
        list.innerHTML = '';
        let bookmarks = JSON.parse(localStorage.bookmarks || '{}');
        window.changeBookmark = bookmark => {
            let bookmarks = JSON.parse(localStorage.bookmarks || '{}');
            bookmarks[bookmark] = list.querySelector(`input[name=${bookmark}_title]`).value;
            localStorage.bookmarks = JSON.stringify(bookmarks);
        };
        window.removeBookmark = bookmark => {
            let bookmarks = JSON.parse(localStorage.bookmarks || '{}');
            delete bookmarks[bookmark];
            localStorage.bookmarks = JSON.stringify(bookmarks);
            drawManagerList();
        };
        Object.keys(bookmarks).forEach(bookmark => {
            list.insertAdjacentHTML('beforeend',
                                    `<div><input type="text" name="url" value="${bookmark}" placeholder="URL" style="width: 40%">` +
                                    `<input type="text" name="${bookmark}_title" value="${bookmarks[bookmark]}" placeholder="Name" style="width: 40%">` +
                                    `<input onclick="changeBookmark('${bookmark}')" type="submit" style="width: 10%;" value="Ändern"/>` +
                                    `<input onclick="removeBookmark('${bookmark}')" type="submit" style="width: 10%;" value="Löschen"/></div><hr>`
                                   );
        });
        drawList();
    };

    document.getElementById('manageBookmarks').addEventListener('click', event => {
        let tooltip = document.querySelector('#manageBookmarksTooltip');
        drawManagerList();
        tooltip.classList.add('active');
    });

    document.getElementById('manageBookmarksClose').addEventListener('click', event => {
        let tooltip = document.querySelector('#manageBookmarksTooltip');
        tooltip.classList.remove('active');
    });
};

drawList();
