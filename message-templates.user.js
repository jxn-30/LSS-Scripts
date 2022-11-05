// ==UserScript==
// @name         LSS-Message-Templates
// @version      1.0.3
// @description  Add multiple Templates for private messages
// @author       Jan (jxn_30)
// @match        https://www.operacni-stredisko.cz/messages/new
// @match        https://policie.operacni-stredisko.cz/messages/new
// @match        https://www.alarmcentral-spil.dk/messages/new
// @match        https://politi.alarmcentral-spil.dk/messages/new
// @match        https://www.leitstellenspiel.de/messages/new
// @match        https://polizei.leitstellenspiel.de/messages/new
// @match        https://www.missionchief-australia.com/messages/new
// @match        https://police.missionchief-australia.com/messages/new
// @match        https://www.missionchief.co.uk/messages/new
// @match        https://police.missionchief.co.uk/messages/new
// @match        https://www.missionchief.com/messages/new
// @match        https://police.missionchief.com/messages/new
// @match        https://www.centro-de-mando.es/messages/new
// @match        https://www.centro-de-mando.mx/messages/new
// @match        https://www.hatakeskuspeli.com/messages/new
// @match        https://poliisi.hatakeskuspeli.com/messages/new
// @match        https://www.operateur112.fr/messages/new
// @match        https://police.operateur112.fr/messages/new
// @match        https://www.operatore112.it/messages/new
// @match        https://polizia.operatore112.it/messages/new
// @match        https://www.missionchief-japan.com/messages/new
// @match        https://www.missionchief-korea.com/messages/new
// @match        https://www.nodsentralspillet.com/messages/new
// @match        https://politiet.nodsentralspillet.com/messages/new
// @match        https://www.meldkamerspel.com/messages/new
// @match        https://politie.meldkamerspel.com/messages/new
// @match        https://www.operatorratunkowy.pl/messages/new
// @match        https://policja.operatorratunkowy.pl/messages/new
// @match        https://www.operador193.com/messages/new
// @match        https://www.jogo-operador112.com/messages/new
// @match        https://policia.jogo-operador112.com/messages/new
// @match        https://www.jocdispecerat112.com/messages/new
// @match        https://www.dispetcher112.ru/messages/new
// @match        https://www.dispecerske-centrum.com/messages/new
// @match        https://www.larmcentralen-spelet.se/messages/new
// @match        https://polis.larmcentralen-spelet.se/messages/new
// @match        https://www.112-merkez.com/messages/new
// @match        https://www.dyspetcher101-game.com/messages/new
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const messages = [
        {
            title: "Das ist ein Beispiel-Template",
            body:
`Diese Nachricht wurde mit einem automatischen Template eingefügt!
Auch Zeilenumbrüche funktionieren natürlich reibungslos!
    => Selbstverständlich werden auch Einrückungen berücksichtigt ;)`,
        },
        {
            title: "Noch ein zweites Template",
            body:
`Das dient einfach nur der Demonstration!`,
        },
    ];

    const group = document.createElement('div');
    group.classList.add('btn-group', 'pull-right');
    const insert = document.createElement('button');
    insert.classList.add('btn', 'btn-default', 'dropdown-toggle');
    insert.setAttribute('data-toggle', 'dropdown');
    insert.innerHTML = 'Template einfügen&nbsp;<span class="caret"></span>';
    const optionList = document.createElement('ul');
    optionList.classList.add('dropdown-menu');
    messages.forEach(({title, body}) => {
        const liEl = document.createElement('li');
        const aEl = document.createElement('a');
        aEl.textContent = title;
        aEl.onclick = () => {
            const titleEl = document.getElementById('message_subject');
            if (titleEl) titleEl.value = title;
            const bodyEl = document.getElementById('message_body');
            if (bodyEl) bodyEl.value = body.replace(
                    /{{username}}/g,
                    document
                        .querySelector('#message_recipients')
                        ?.value?.trim() ?? '{{username}}'
                ).replace(
                        /{{today(?<offset>[+-]\d+)?}}/g,
                        (_, offsetString) =>
                            new Date(Date.now() + parseInt(offsetString ?? '0') * 1000 * 60 * 60 * 24).toLocaleDateString('de-DE', {dateStyle: "short"})
                    );
        };
        liEl.append(aEl);
        optionList.append(liEl);
    });
    group.append(insert, optionList);
    document.querySelector('.page-header').append(group);
})();
