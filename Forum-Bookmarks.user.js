// ==UserScript==
// @name         LSS-Forum-Bookmarks
// @version      1.2.0
// @description  Ein Interner Lesezeichen-Manager für das allgemeine Forum
// @author       Jan (jxn_30)
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
    const t = document.getElementById("exportBookmarks");
    t.setAttribute("href", `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(e))}`),
    document.getElementById("setBookmark").addEventListener("click", () => {
        document.querySelector("#setBookmarkTooltip").classList.add("active");
    }), document.getElementById("setBookmarkSave").addEventListener("click", () => {
        let e = document.querySelector("#setBookmarkTooltip"), o = JSON.parse(localStorage.bookmarks || "{}");
        o[e.querySelector('input[name="url"]').value] = e.querySelector('input[name="title"]').value,
        localStorage.bookmarks = JSON.stringify(o), drawList(), e.classList.remove("active"),
        t.setAttribute("href", `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(o))}`);
    }), document.getElementById("setBookmarkAbort").addEventListener("click", () => {
        document.querySelector("#setBookmarkTooltip").classList.remove("active");
    });
    const o = () => {
        let e = document.querySelector("#manageBookmarksList");
        e.innerHTML = "";
        let t = JSON.parse(localStorage.bookmarks || "{}");
        window.changeBookmark = (t => {
            let o = JSON.parse(localStorage.bookmarks || "{}");
            o[t] = e.querySelector(`input[name=${t}_title]`).value, localStorage.bookmarks = JSON.stringify(o);
        }), window.removeBookmark = (e => {
            let t = JSON.parse(localStorage.bookmarks || "{}");
            delete t[e], localStorage.bookmarks = JSON.stringify(t), o();
        }), window.moveBookmarkUp = (e => {
            let t = JSON.parse(localStorage.bookmarks || "{}"), a = Object.entries(t);
            [a[e - 1], a[e]] = [ a[e], a[e - 1] ], t = Object.fromEntries(a), localStorage.bookmarks = JSON.stringify(t),
            o();
        }), window.moveBookmarkDown = (e => {
            let t = JSON.parse(localStorage.bookmarks || "{}"), a = Object.entries(t);
            [a[e], a[e + 1]] = [ a[e + 1], a[e] ], t = Object.fromEntries(a), localStorage.bookmarks = JSON.stringify(t),
            o();
        }), Object.keys(t).forEach((o, a) => {
            e.insertAdjacentHTML("beforeend", `<div style="display: flex; justify-content: space-between;"><input type="text" name="url" value="${o}" placeholder="URL" style="width: 100%">` + `<input type="text" name="${o}_title" value="${t[o]}" placeholder="Name" style="width: 100%">` + `<input onclick="changeBookmark('${o}')" type="submit" style="width: 20%;" value="Ändern"/>` + `<input onclick="removeBookmark('${o}')" type="submit" style="width: 20%;" value="Löschen"/>` + `<input onclick="moveBookmarkUp(${a})" type="submit" value="↑" class="${0 === a ? "disabled" : ""}" ${0 === a ? 'disabled="true"' : ""}/>` + `<input onclick="moveBookmarkDown(${a})" type="submit" value="↓" class="${a === Object.keys(t).length - 1 ? "disabled" : ""}" ${a === Object.keys(t).length - 1 ? 'disabled="true"' : ""}/>` + "</div><hr>");
        }), drawList();
    };
    document.getElementById("manageBookmarks").addEventListener("click", () => {
        let e = document.querySelector("#manageBookmarksTooltip");
        o(), e.classList.add("active");
    }), document.getElementById("manageBookmarksClose").addEventListener("click", () => {
        document.querySelector("#manageBookmarksTooltip").classList.remove("active");
    }), document.getElementById("importBookmarks").addEventListener("click", () => {
        document.getElementById("importBookmarksInput").click();
    }), document.getElementById("importBookmarksInput").addEventListener("change", () => {
        const {files: e} = document.getElementById("importBookmarksInput");
        if (!e) return;
        const t = e[0], o = new FileReader();
        o.readAsText(t), o.onload = (async () => {
            const e = JSON.parse(o.result);
            localStorage.bookmarks = JSON.stringify(e), drawList();
        });
    });
};

drawList();
