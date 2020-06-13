// ==UserScript==
// @name         LSS-Lightbox-Lightbox
// @version      1.0.0
// @author       Jan (jxn_30)
// @description  Allows opening Lightboxes within a Lightbox
// @include      /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/.*$/
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById('lightbox_background')) return;
    const bg = document.createElement('div');
    bg.id = 'lightbox_background';
    bg.addEventListener('click', lightboxClose);
    const box = document.createElement('div');
    box.id = 'lightbox_box';
    const close = document.createElement('button');
    close.classList.add('close');
    close.type = 'button';
    close.id = 'lightbox_close';
    const times = document.createElement('span');
    times.innerHTML = '&times;';
    close.appendChild(times);
    close.addEventListener('click', lightboxClose);
    box.appendChild(close);
    document.body.appendChild(bg);
    document.body.appendChild(box);
})();
