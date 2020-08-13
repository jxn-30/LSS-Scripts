// ==UserScript==
// @name         LSS-Chat-Hider
// @version      1.0.0
// @author       Jan (jxn_30)
// @description  Hidet einzelne Chat messages
// @include      /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
// @run-at       document-idle
// ==/UserScript==

(function() {
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
        private: input => document.querySelectorAll('#mission_chat_messages li.chatWhisper').forEach(msg => msg.classList[input.checked ? 'remove' : 'add']('hidden')),
        mention: input => document.querySelectorAll('#mission_chat_messages li.chatToSelf').forEach(msg => msg.classList[input.checked ? 'remove' : 'add']('hidden')),
        missions: input => document.querySelectorAll('#mission_chat_messages li .glyphicon.glyphicon-bell').forEach(msg => msg.parentElement.parentElement.classList[input.checked ? 'remove' : 'add']('hidden')),
        others: input => document.querySelectorAll('#mission_chat_messages li:not(.chatWhisper):not(.chatToSelf)').forEach(msg => !msg.querySelector('.glyphicon.glyphicon-bell') && msg.classList[input.checked ? 'remove' : 'add']('hidden')),
    };
    ['private', 'mention', 'missions', 'others'].forEach(type => {
        const liEl = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = true;
        input.id = `chat-hider-${type}`;
        const label = document.createElement('label');
        label.setAttribute('for', input.id);
        label.style.color = 'black';
        label.textContent = type;
        liEl.append(input, label);
        input.setAttribute('data-toggle', type);
        input.onchange = () => handlers[type](input);
        inputs.push(input);
        dropdown.append(liEl);
    });

    const allianceChatOrig = allianceChat;

    allianceChat = (...args) => {
        allianceChatOrig(...args);
        inputs.forEach(input => handlers[input.getAttribute('data-toggle')](input));
    }

    btnGroup.append(btn, dropdown);

    document.getElementById('chat_panel_heading').insertAdjacentElement('afterbegin', btnGroup)
})();
