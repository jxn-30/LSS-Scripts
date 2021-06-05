// ==UserScript==
// @name         LSS-Message-Templates
// @version      1.0.2
// @description  Add multiple Templates for private messages
// @author       Jan (jxn_30)
// @include      /^https?:\/\/(?:w{3}\.)?(?:leitstellenspiel\.de|(?:meldkamerspel|missionchief|missionchief-australia|nodsentralspillet|112-merkez|jogo-operador112|operador193|dyspetcher101-game|missionchief-japan|jocdispecerat112|missionchief-korea|hatakeskuspeli|dispecerske-centrum)\.com|missionchief\.co\.uk|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|operacni-stredisko\.cz|centro-de-mando\.mx)\/messages/((new\/?)|(\d+\/?))/
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
