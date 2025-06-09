// ==UserScript==
// @name            [LSS] AAO Config Lite (DE)
// @namespace       https://jxn.lss-manager.de
// @version         2025.06.09+1706
// @author          JuMaHo & Jan (jxn_30)
// @description     This Script is for leitstellenspiel.de only!
// @description:de  Blendet Eingabefelder in der AAO-Konfiguration nach Bedarf ein oder aus.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/aaoConfigLite.de.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/aaoConfigLite.de.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/14751-aao-config-lite/
// @match           https://www.leitstellenspiel.de/aaos/new
// @match           https://www.leitstellenspiel.de/aaos/*/edit
// @match           https://www.leitstellenspiel.de/aaos/*/copy
// @match           https://polizei.leitstellenspiel.de/aaos/new
// @match           https://polizei.leitstellenspiel.de/aaos/*/edit
// @match           https://polizei.leitstellenspiel.de/aaos/*/copy
// @run-at          document-idle
// @grant           GM_addStyle
// @grant           GM_listValues
// @grant           GM_setValue
// @grant           GM_getValue
// ==/UserScript==

/**
 * @name  AAO Config Lite (DE)
 * @description This Script is for leitstellenspiel.de only!
 * @description:de Blendet Eingabefelder in der AAO-Konfiguration nach Bedarf ein oder aus.
 * @author JuMaHo
 * @author Jan (jxn_30)
 * @forum https://forum.leitstellenspiel.de/index.php?thread/14751-aao-config-lite/
 * @locale de_DE
 * @match /aaos/new
 * @match /aaos/*\/edit
 * @match /aaos/*\/copy
 * @grant GM_addStyle
 * @grant GM_listValues
 * @grant GM_setValue
 * @grant GM_getValue
 */

// This has originally been a working fork of https://github.com/JuMaH0/lss/blob/master/aaolite.user.js
// It is now further developed to adapt to ingame changes
// Configuration does not happen via the script itself but via UI since 2025-06-09

const getHiddenSelectors = () =>
    GM_listValues()
        .map(
            tab =>
                `#${tab} .form-group:where(${GM_getValue(tab, []).map(entry => `:has(label[for="${entry}"])`)})`
        )
        .join(',\n');

const style = GM_addStyle();

const globalToggle = document.createElement('span');
globalToggle.classList.add('glyphicon', 'glyphicon-eye-open', 'pull-right');
globalToggle.style.setProperty('cursor', 'pointer');
globalToggle.style.setProperty('margin-right', '0.5em');

const updateStyle = () =>
    (style.textContent =
        globalToggle.classList.contains('glyphicon-eye-open') ?
            `${getHiddenSelectors()} {
    display: none;
}`
        :   '');
updateStyle();

const add = (tab, entry) => {
    const hidden = new Set(GM_getValue(tab, []));
    hidden.add(entry);
    GM_setValue(tab, Array.from(hidden));
    updateStyle();
};
const remove = (tab, entry) => {
    const hidden = new Set(GM_getValue(tab, []));
    hidden.delete(entry);
    GM_setValue(tab, Array.from(hidden));
    updateStyle();
};

globalToggle.addEventListener('click', e => {
    e.preventDefault();
    globalToggle.classList.toggle('glyphicon-eye-open');
    globalToggle.classList.toggle('glyphicon-eye-close');
    if (globalToggle.classList.contains('glyphicon-eye-close')) {
        style.textContent = '';
    } else updateStyle();
});

(() => {
    const initiallyHidden = Object.fromEntries(
        GM_listValues().map(tab => [tab, GM_getValue(tab, [])])
    );

    console.log(initiallyHidden);

    document.querySelectorAll('#tab_panels .tab-pane').forEach(tab =>
        tab.querySelectorAll('.form-group label').forEach(label => {
            const toggleBtn = document.createElement('span');
            toggleBtn.classList.add(
                'glyphicon',
                initiallyHidden[tab.id]?.includes(label.htmlFor) ?
                    'glyphicon-eye-close'
                :   'glyphicon-eye-open'
            );
            toggleBtn.style.setProperty('cursor', 'pointer');
            toggleBtn.style.setProperty('margin-left', '0.5em');

            toggleBtn.addEventListener('click', e => {
                e.preventDefault();
                if (toggleBtn.classList.contains('glyphicon-eye-open')) {
                    add(tab.id, label.htmlFor);
                } else remove(tab.id, label.htmlFor);
                toggleBtn.classList.toggle('glyphicon-eye-open');
                toggleBtn.classList.toggle('glyphicon-eye-close');
            });

            label.append(toggleBtn);
        })
    );

    document.getElementById('tabs').append(globalToggle);
})();
