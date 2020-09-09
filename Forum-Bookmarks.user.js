// ==UserScript==
// @name         LSS-Forum-Bookmarks
// @version      1.1.0
// @description  Ein Interner Lesezeichen-Manager für das allgemeine Forum
// @author       Jan (KBOE2)
// @include      https://forum.leitstellenspiel.de/*
// @grant        none
// ==/UserScript==

document.querySelector(".boxMenu").insertAdjacentHTML("afterbegin", '<li class="boxMenuHasChildren"><a class="boxMenuLink"><span class="icon icon16 fa-bookmark-o"></span></a><ol class="boxMenuDepth1" id="bookmarkList"></ol></li><div id="setBookmarkTooltip" class="balloonTooltip" style="pointer-events: unset; width: 100%; max-width: 100%; background-color: rgb(0, 0, 0);">' + `<b>Lesezeichen setzen</b><input type="text" name="url" value="${window.location.href}" placeholder="URL" style="width: 100%">` + `<br><input type="text" name="title" value="${document.querySelector(".contentTitle").innerText.replace(/"/g, "&#34;")}" placeholder="Name" style="width: 100%;">` + '<br><input id="setBookmarkSave" type="submit" value="Setzen">&nbsp;<input id="setBookmarkAbort" type="submit" value="Abbrechen"/></div><div id="manageBookmarksTooltip" class="balloonTooltip" style="pointer-events: unset; width: 100%; max-width: 100%; background-color: rgb(0, 0, 0);"><div id="manageBookmarksList"></div><br><input id="manageBookmarksClose" type="submit" value="Schliessen"/></div></div>');

const drawList = () => {
    document.querySelector("#bookmarkList").innerHTML = "";
    let e = JSON.parse(localStorage.bookmarks || "{}");
    Object.keys(e).forEach(t => {
        document.querySelector("#bookmarkList").insertAdjacentHTML("beforeend", `<li><a class="boxMenuLink" href="${t}"><span class="boxMenuLinkTitle">${e[t]}</span></a></li>`);
    }), document.querySelector("#bookmarkList").insertAdjacentHTML("beforeend", '<li><hr></hr></li><li><a class="boxMenuLink" id="setBookmark">Lesezeichen setzen</a></li><li><a id="manageBookmarks" class="boxMenuLink">Lesezeichen verwalten</a></li><li><a id="exportBookmarks" class="boxMenuLink" download="lss_forum_lesezeichen.json">Lesezeichen exportieren</a></li><li><a id="importBookmarks" class="boxMenuLink">Lesezeichen importieren</a><input id="importBookmarksInput" style="display: none" type="file" accept="application/json,.json"/></li>');
    const exportBtn = document.getElementById("exportBookmarks");
exportBtn.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(e))}`);
        document.getElementById("setBookmark").addEventListener("click", () => {
        document.querySelector("#setBookmarkTooltip").classList.add("active");
    }), document.getElementById("setBookmarkSave").addEventListener("click", () => {
        let e = document.querySelector("#setBookmarkTooltip"), t = JSON.parse(localStorage.bookmarks || "{}");
        t[e.querySelector('input[name="url"]').value] = e.querySelector('input[name="title"]').value,
        localStorage.bookmarks = JSON.stringify(t), drawList(), e.classList.remove("active");
exportBtn.setAttribute('href', `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(t))}`);
    }), document.getElementById("setBookmarkAbort").addEventListener("click", () => {
        document.querySelector("#setBookmarkTooltip").classList.remove("active");
    });
    const t = () => {
        let e = document.querySelector("#manageBookmarksList");
        e.innerHTML = "";
        let o = JSON.parse(localStorage.bookmarks || "{}");
        window.changeBookmark = (t => {
            let o = JSON.parse(localStorage.bookmarks || "{}");
            o[t] = e.querySelector(`input[name=${t}_title]`).value, localStorage.bookmarks = JSON.stringify(o);
        }), window.removeBookmark = (e => {
            let o = JSON.parse(localStorage.bookmarks || "{}");
            delete o[e], localStorage.bookmarks = JSON.stringify(o), t();
        }), Object.keys(o).forEach(t => {
            e.insertAdjacentHTML("beforeend", `<div><input type="text" name="url" value="${t}" placeholder="URL" style="width: 40%">` + `<input type="text" name="${t}_title" value="${o[t]}" placeholder="Name" style="width: 40%">` + `<input onclick="changeBookmark('${t}')" type="submit" style="width: 10%;" value="Ändern"/>` + `<input onclick="removeBookmark('${t}')" type="submit" style="width: 10%;" value="Löschen"/></div><hr>`);
        }), drawList();
    };
    document.getElementById("manageBookmarks").addEventListener("click", () => {
        let e = document.querySelector("#manageBookmarksTooltip");
        t(), e.classList.add("active");
    }), document.getElementById("manageBookmarksClose").addEventListener("click", () => {
        document.querySelector("#manageBookmarksTooltip").classList.remove("active");
    });
    document.getElementById("importBookmarks").addEventListener("click", () => {
        let e = document.getElementById("importBookmarksInput");
        e.click();
    });
    document.getElementById("importBookmarksInput").addEventListener("change", () => {
        const { files } = document.getElementById("importBookmarksInput");
            if (!files) return;
            const file = files[0];
            const fileReader = new FileReader();

            fileReader.readAsText(file);

            fileReader.onload = async () => {
                const result = JSON.parse(fileReader.result);
                localStorage.bookmarks = JSON.stringify(result), drawList();
            };
    });
};

drawList();
