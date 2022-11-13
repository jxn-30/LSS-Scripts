// ==UserScript==
// @name            [LSS] Chat Hider
// @namespace       https://jxn.lss-manager.de
// @version         2022.0.0
// @author          Jan (jxn_30)
// @description     Hides chat messages by type
// @description:de  Blendet einzelne Chatnachrichten entsprechend dem eingestellten Filter aus
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/chatHider.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/chatHider.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/18991-chat-hider/
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
 * @version 2022.0.0
 * @name  Chat Hider
 * @description Hides chat messages by type
 * @description:de Blendet einzelne Chatnachrichten entsprechend dem eingestellten Filter aus
 * @forum https://forum.leitstellenspiel.de/index.php?thread/18991-chat-hider/
 * @match /
 * @old chathider
 * @grant unsafeWindow
 */

(function () {
    'use strict';

    const btnGroup = document.createElement('div');
    btnGroup.classList.add('btn-group', 'pull-right');
    const btn = document.createElement('button');
    btn.classList.add('btn', 'btn-default', 'dropdown-toggle', 'btn-xs');
    btn.setAttribute('data-toggle', 'dropdown');
    btn.innerHTML = '<span class="glyphicon glyphicon-eye-open"></span>';
    const dropdown = document.createElement('ul');
    dropdown.classList.add('dropdown-menu');
    const inputs = [];
    const handlers = {
        private: input =>
            document
                .querySelectorAll('#mission_chat_messages li.chatWhisper')
                .forEach(msg =>
                    msg.classList[input.checked ? 'remove' : 'add']('hidden')
                ),
        mention: input =>
            document
                .querySelectorAll('#mission_chat_messages li.chatToSelf')
                .forEach(msg =>
                    msg.classList[input.checked ? 'remove' : 'add']('hidden')
                ),
        missions: input =>
            document
                .querySelectorAll(
                    '#mission_chat_messages li .glyphicon.glyphicon-bell'
                )
                .forEach(msg =>
                    msg.parentElement.parentElement.classList[
                        input.checked ? 'remove' : 'add'
                    ]('hidden')
                ),
        others: input =>
            document
                .querySelectorAll(
                    '#mission_chat_messages li:not(.chatWhisper):not(.chatToSelf)'
                )
                .forEach(
                    msg =>
                        !msg.querySelector('.glyphicon.glyphicon-bell') &&
                        msg.classList[input.checked ? 'remove' : 'add'](
                            'hidden'
                        )
                ),
    };
    ['private', 'mention', 'missions', 'others'].forEach(type => {
        const liEl = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = true;
        input.id = `chat-hider-${type}`;
        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        if (!document.body.classList.contains('dark')) {
            label.style.color = 'black';
        }
        label.textContent = type;
        liEl.append(input, label);
        input.setAttribute('data-toggle', type);
        input.onchange = () => handlers[type](input);
        inputs.push(input);
        dropdown.append(liEl);
    });

    const allianceChatOrig = unsafeWindow.allianceChat;

    unsafeWindow.allianceChat = (...args) => {
        allianceChatOrig(...args);
        inputs.forEach(input =>
            handlers[input.getAttribute('data-toggle')](input)
        );
    };

    btnGroup.append(btn, dropdown);

    document
        .getElementById('chat_panel_heading')
        .insertAdjacentElement('afterbegin', btnGroup);
})();
