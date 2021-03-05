// ==UserScript==
// @name         LSS-Input-Length
// @version      1.0.2
// @author       Jan (jxn_30)
// @description  Shows current input length and sets minlength and maxlength
// @include      /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/.*$/
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    const lengthMap = {
        'building[name]': {
            min: 2,
            max: 40,
        },
        'vehicle[caption]': {
            min: 2,
            max: 150,
        },
        'vehicle[vehicle_type_caption]': {
            min: 0,
            max: 255,
        },
        'mission_position[mission_custom][caption]': {
            min: 3,
            max: 30,
        },
        /*
        'user[username]': {
            min: 0,
            max: 0,
        },
        'user[email]': {
            min: 0,
            max: 0,
        },
        'user[password]': {
            min: 0,
            max: 0,
        },
        'user[password_confirmation]': {
            min: 0,
            max: 0,
        },
        'alliance_chat[message]': {
            min: 0,
            max: 0,
        },
        'mission_reply[content]': {
            min: 0,
            max: 0,
        },
        */
        'aao[caption]': {
            min: 1,
            max: 60,
        },
        'aao_category[caption]': {
            min: 1,
            max: 60,
        },
        'vehicle_group[caption]': {
            min: 2,
            max: 60,
        },
        'patrol[caption]': {
            min: 2,
            max: 40,
        },
        'vehicle_graphic[caption]': {
            min: 3,
            max: 30,
        },
        'mission_graphic[caption]': {
            min: 3,
            max: 30,
        }
    };

    document.head.insertAdjacentHTML('beforeend', `<style type="text/css">${Object.keys(lengthMap)
        .map(selector => `input[name=${JSON.stringify(selector)}]:invalid`)
        .join(',')} {border-color: #a94442;}</style>`);

    document.addEventListener('input', e => {
        const target = e.target;
        if (!target || target.nodeName !== 'INPUT') return;
        const entry = Object.entries(lengthMap).find(([selector]) =>
                                                     target.matches(`input[name=${JSON.stringify(selector)}]`)
                                                    );
        if (!entry) return;
        const minMax = entry[1];
        target.setAttribute('minlength', minMax.min.toString());
        target.setAttribute('maxlength', minMax.max.toString());
        const placeholder = target.getAttribute('placeholder') || '';
        if (!placeholder.endsWith(']'))
            target.setAttribute(
                'placeholder',
                `${placeholder} [Dieses Eingabefeld muss zwischen ${minMax.min} und ${minMax.max} Zeichen haben!]]`.trim()
            );
        const title = target.getAttribute('title') || '';
        if (!title.endsWith(']'))
            target.setAttribute(
                'title',
                `${title} [Dieses Eingabefeld muss zwischen ${minMax.min} und ${minMax.max} Zeichen haben!]`.trim()
            );
        let counter = document.getElementById(
            `inputlength_${target.id}_${entry[0]}`
        );
        if (!counter) {
            counter = document.createElement('small');
            counter.id = `inputlength_${target.id}_${entry[0]}`;
            counter.style.marginLeft = '1ch';
            const label = document.querySelector(`label[for="${target.id}"]`);
            label.appendChild(counter);
        }
            counter.classList.remove('text-success', 'text-danger');
            counter.classList.add(
            target.value.length <= minMax.max &&
                target.value.length >= minMax.min
                ? 'text-success'
            : 'text-danger'
            );
            counter.textContent = `(${target.value.length}/${minMax.max})`;
        });
    })();
