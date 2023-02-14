// ==UserScript==
// @name            [LSS] Alliance members panel
// @name:de         [LSS] Verbandsmitglieder panel
// @namespace       https://jxn.lss-manager.de
// @version         2023.01.30+1359
// @author          Jan (jxn_30)
// @description     Adds a panel to view the list of alliance members directly on the games main page
// @description:de  Fügt ein Panel hinzu, um die Mitgliederliste des Verbands direkt auf der Hauptseite zu sehen
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/allianceMembersPanel.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/allianceMembersPanel.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/23543-skriptwunsch-mitglieder-online-status/
// @match           https://www.operacni-stredisko.cz/
// @match           https://policie.operacni-stredisko.cz/
// @match           https://www.alarmcentral-spil.dk/
// @match           https://politi.alarmcentral-spil.dk/
// @match           https://www.leitstellenspiel.de/
// @match           https://polizei.leitstellenspiel.de/
// @match           https://www.missionchief-australia.com/
// @match           https://police.missionchief-australia.com/
// @match           https://www.missionchief.co.uk/
// @match           https://police.missionchief.co.uk/
// @match           https://www.missionchief.com/
// @match           https://police.missionchief.com/
// @match           https://www.centro-de-mando.es/
// @match           https://www.centro-de-mando.mx/
// @match           https://www.hatakeskuspeli.com/
// @match           https://poliisi.hatakeskuspeli.com/
// @match           https://www.operateur112.fr/
// @match           https://police.operateur112.fr/
// @match           https://www.operatore112.it/
// @match           https://polizia.operatore112.it/
// @match           https://www.missionchief-japan.com/
// @match           https://www.missionchief-korea.com/
// @match           https://www.nodsentralspillet.com/
// @match           https://politiet.nodsentralspillet.com/
// @match           https://www.meldkamerspel.com/
// @match           https://politie.meldkamerspel.com/
// @match           https://www.operatorratunkowy.pl/
// @match           https://policja.operatorratunkowy.pl/
// @match           https://www.operador193.com/
// @match           https://www.jogo-operador112.com/
// @match           https://policia.jogo-operador112.com/
// @match           https://www.jocdispecerat112.com/
// @match           https://www.dispetcher112.ru/
// @match           https://www.dispecerske-centrum.com/
// @match           https://www.larmcentralen-spelet.se/
// @match           https://polis.larmcentralen-spelet.se/
// @match           https://www.112-merkez.com/
// @match           https://www.dyspetcher101-game.com/
// @run-at          document-idle
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name Alliance members panel
 * @name:de Verbandsmitglieder panel
 * @description Adds a panel to view the list of alliance members directly on the games main page
 * @description:de Fügt ein Panel hinzu, um die Mitgliederliste des Verbands direkt auf der Hauptseite zu sehen
 * @forum https://forum.leitstellenspiel.de/index.php?thread/23543-skriptwunsch-mitglieder-online-status/
 * @match /
 * @grant unsafeWindow
 */

/**
 * Where to add the new panel:
 * 'chat': toggle between chat and alliance members
 * 'radio': toggle between radio and alliance members
 * 'own': add a new panel (recommended for window design or wide screens only)
 *  In window design, will always be 'own'!
 */
const mode = 'own'; // chat, radio, own

const roles = {
    admin: {
        title: 'Admin',
        icon: '♛',
    },
    coadmin: {
        title: 'Co-Admin',
        icon: '♚',
    },
    schooling: {
        title: 'Lehrgangsmeister',
        icon: '🕮',
    },
    finance: {
        title: 'Finanzminister',
        icon: '💰',
    },
    staff: {
        title: 'Verbands-Personal',
        icon: '👤',
    },
    transport_requests: {
        title: 'Sprechwunsch-Admin',
        icon: '📣',
    },
    view_logs: {
        title: 'Aufsichtsrat',
        icon: '🔍️',
    },
};

const createRoleFlagSpan = role => {
    const span = document.createElement('span');
    span.textContent = roles[role].icon;
    span.title = roles[role].title;
    return span;
};

const updateMembersList = () => {
    fetch('/api/allianceinfo')
        .then(res => res.json())
        .then(allianceinfo => {
            try {
                localStorage.setItem(
                    'aAlliance',
                    JSON.stringify({
                        lastUpdate: Date.now(),
                        value: allianceinfo,
                        userId: unsafeWindow.user_id,
                    })
                );
            } catch (e) {
                // could not set the item due to storage overflow => do nothing and do not store
            }
            return allianceinfo.users;
        })
        .then(users => {
            // empty the table
            tableBody.replaceChildren();

            let onlineCounter = 0;

            users
                .sort(({ name: nameA }, { name: nameB }) =>
                    nameA.localeCompare(nameB)
                )
                .forEach(user => {
                    const row = tableBody.insertRow();

                    const iconCell = row.insertCell();
                    const icon = document.createElement('img');
                    icon.src = `/images/user_${
                        ['gray', 'green'][Number(user.online)]
                    }.png`;
                    iconCell.append(icon);

                    const nameCell = row.insertCell();
                    const link = document.createElement('a');
                    link.classList.add('lightbox-open');
                    link.href = `/profile/${user.id}`;
                    link.textContent = user.name;
                    nameCell.append(link);

                    if (user.role_flags.admin) {
                        row.insertCell().append(createRoleFlagSpan('admin'));
                    } else {
                        row.insertCell().append(
                            ...Object.keys(user.role_flags)
                                .filter(role => user.role_flags[role])
                                .sort()
                                .map(createRoleFlagSpan)
                        );
                    }

                    row.dataset.online = user.online;
                    row.dataset.userName = user.name;

                    if (user.online) onlineCounter++;
                });

            panelTitle.textContent = `Verbandsmitglieder (${onlineCounter}/${users.length})`;
        })
        .then(() => {
            let countdown = 5 * 60; // 5 minutes
            const updateCountdown = setInterval(() => {
                countdown--;
                countdownSpan.textContent = `${Math.floor(countdown / 60)}:${(
                    countdown % 60
                )
                    .toString()
                    .padStart(2, '0')}`;
                if (countdown === 0) {
                    clearInterval(updateCountdown);
                    updateMembersList();
                }
            }, 1000);
        });
};

const bigMapMenu = document.querySelector('#bigMapMenu');

const prefix = `s${crypto.randomUUID()}`; // ensure that the prefix starts with a letter
const bigmapStorageKey = 'alliance_members_outer';

const filterStyle = document.createElement('style');
const offlineStyle = document.createElement('style');
document.head.append(filterStyle, offlineStyle);

const panel = document.createElement('div');
panel.classList.add('panel', 'panel-default');

const panelHeading = document.createElement('div');
panelHeading.classList.add('panel-heading', 'big_map_window_head');
panelHeading.style.setProperty('display', 'flex');
panelHeading.style.setProperty('flex-flow', 'wrap');

const panelTitle = document.createElement('span');
panelTitle.id = `${prefix}_panel_title`;
panelTitle.textContent = 'Verbandsmitglieder';

const search = document.createElement('input');
search.classList.add('search_input_field');
search.style.setProperty('flex-grow', '1');
search.style.setProperty('font-size', '12px');
search.style.setProperty('border', '1px solig #ccc');
search.style.setProperty('border-radius', '4px');
search.style.setProperty('margin-left', '1em');

search.addEventListener('keyup', () => {
    const filter = search.value.trim().toLowerCase();
    filterStyle.textContent = filter
        ? `#${tableBody.id} tr:not([data-user-name*="${filter}"i]) { display: none; }`
        : '';
});

panelHeading.append(panelTitle, search);

const panelBody = document.createElement('div');
panelBody.classList.add('panel-body');
if (!bigMapMenu) {
    panelBody.style.setProperty('height', '500px');
    panelBody.style.setProperty('max-height', '500px');
    panelBody.style.setProperty('overflow', 'auto');
}

const table = document.createElement('table');
table.classList.add('table', 'table-striped', 'table-hover', 'table-condensed');
const tableBody = document.createElement('tbody');
tableBody.id = `${prefix}_table_body`;

table.append(tableBody);

const countdownSpan = document.createElement('span');
countdownSpan.id = `${prefix}_countdown`;
countdownSpan.classList.add('text-muted', 'pull-right');
countdownSpan.textContent = '0:00';
countdownSpan.style.setProperty('position', 'absolute');
countdownSpan.style.setProperty('right', 'calc(3ch + 1em)');

const offlineBtn = document.createElement('button');
offlineBtn.classList.add('btn', 'btn-default', 'btn-xs');
offlineBtn.style.setProperty('position', 'absolute');
offlineBtn.style.setProperty('right', 'calc(3ch + 1em)');
offlineBtn.style.setProperty('transform', 'translateY(100%)');
const offlineImg = document.createElement('img');
offlineImg.src = '/images/user_gray.png';
offlineBtn.append(offlineImg);

offlineBtn.addEventListener('click', () => {
    const offline = offlineStyle.textContent;
    offlineStyle.textContent = offline
        ? ''
        : `#${tableBody.id} tr[data-online="false"] { display: none; }`;
});
offlineBtn.click();

panelBody.append(countdownSpan, offlineBtn, table);

panel.append(panelHeading, panelBody);

updateMembersList(panelBody);

const wrapper = document.createElement('div');
wrapper.id = 'alliance_members_outer';
wrapper.classList.add('overview_outer', 'bigMapWindow');

wrapper.append(panel);

if (mode === 'own' || bigMapMenu) {
    wrapper.classList.add('col-sm-3');
    document
        .querySelector('#buildings_outer')
        ?.classList.replace('col-sm-4', 'col-sm-3');
    document
        .querySelector('#chat_outer')
        ?.classList.replace('col-sm-4', 'col-sm-3');
    const radioWrapper = document.querySelector('#radio_outer');
    radioWrapper?.classList.replace('col-sm-4', 'col-sm-3');
    radioWrapper?.after(wrapper);

    if (bigMapMenu) {
        const menuBtn = document.createElement('img');
        menuBtn.src = '/images/alliance.svg';
        menuBtn.classList.add('bigMapMenuButton');

        menuBtn.addEventListener('click', () =>
            unsafeWindow.bigMapMenuOpenClose(unsafeWindow.$(wrapper))
        );

        wrapper.style.setProperty('position', 'absolute');
        wrapper.style.setProperty('padding', '0');
        wrapper.style.setProperty('border', '2px solid #c9302c');
        wrapper.style.setProperty('overflow', 'hidden');

        panel.style.setProperty('height', '100%');
        panel.style.setProperty('margin', '0');
        panel.style.setProperty('overflow', 'auto');

        panelHeading.style.setProperty('border', 'none');
        panelHeading.style.setProperty('padding', '5px');
        panelHeading.style.setProperty('background-color', '#424242');
        panelHeading.style.setProperty('color', 'white');
        panelHeading.style.setProperty('margin', '0');
        panelHeading.style.setProperty('background-image', 'none');
        panelHeading.style.setProperty('border-radius', '0');

        unsafeWindow
            .$(wrapper)
            .draggable(unsafeWindow.$('#missions_outer').draggable('option'))
            .resizable(unsafeWindow.$('#missions_outer').resizable('option'));

        bigMapMenu.append(menuBtn);
        bigMapMenu.style.setProperty('width', '280px');
        Array.from(bigMapMenu.childNodes)
            .filter(node => node.nodeType === 3)
            .forEach(node => node.remove());

        const bigMapWindowPositionSaveOrig =
            unsafeWindow.bigMapWindowPositionSave;
        unsafeWindow.bigMapWindowPositionSave = () => {
            bigMapWindowPositionSaveOrig();
            localStorage.setItem(
                bigmapStorageKey,
                JSON.stringify(
                    unsafeWindow.bigMapWindowPositionGet(
                        unsafeWindow.$(wrapper)
                    )
                )
            );
        };

        if (bigmapStorageKey in localStorage) {
            unsafeWindow.bigMapWindowPositionRestoreWindow(
                unsafeWindow.$(wrapper),
                JSON.parse(localStorage.getItem(bigmapStorageKey))
            );
        }
    }
} else {
    wrapper.classList.add('col-sm-4', 'hidden');

    const switchWrapper = document.querySelector(`#${mode}_outer`);
    if (switchWrapper) {
        const heading = switchWrapper.querySelector('.panel-heading');
        const toggleBtn = document.createElement('button');
        toggleBtn.classList.add('btn', 'btn-default', 'btn-xs', 'pull-right');
        const offlineImg = document.createElement('img');
        offlineImg.src = '/images/user_green.png';
        const toggleSpan = document.createElement('span');
        toggleSpan.classList.add('hidden', 'glyphicon', 'glyphicon-remove');
        toggleBtn.append(offlineImg, toggleSpan);

        const toggleWrapper =
            mode === 'chat'
                ? heading?.querySelector('.btn-group')
                : heading?.querySelector('.row > div:first-child');

        toggleWrapper.append(toggleBtn);

        switchWrapper.after(wrapper);

        toggleBtn.addEventListener('click', () => {
            switchWrapper.classList.toggle('hidden');
            wrapper.classList.toggle('hidden');

            if (wrapper.classList.contains('hidden')) {
                toggleWrapper.append(toggleBtn);
                offlineImg.classList.remove('hidden');
                toggleSpan.classList.add('hidden');
            } else {
                offlineImg.classList.add('hidden');
                toggleSpan.classList.remove('hidden');
                panelHeading.append(toggleBtn);
            }
        });
    }
}
