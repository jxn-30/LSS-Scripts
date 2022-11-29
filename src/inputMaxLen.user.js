// ==UserScript==
// @name            [LSS] Input max length
// @name:de         [LSS] Textlänge bei Eingabefeldern prüfen
// @namespace       https://jxn.lss-manager.de
// @version         2022.11.29+1050
// @author          Jan (jxn_30)
// @description     Shows a help about minimum and maximum length of text input fields
// @description:de  Zeigt eine Hilfe über die Mindest- und Maximaltextlänge von Eingabefeldern an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/inputMaxLen.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/inputMaxLen.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/11756-erledigt-textl%C3%A4nge-in-begrenzten-eingabefeldern-schon-bei-eingabe-pr%C3%BCfen/
// @match           https://www.operacni-stredisko.cz/*
// @match           https://policie.operacni-stredisko.cz/*
// @match           https://www.alarmcentral-spil.dk/*
// @match           https://politi.alarmcentral-spil.dk/*
// @match           https://www.leitstellenspiel.de/*
// @match           https://polizei.leitstellenspiel.de/*
// @match           https://www.missionchief-australia.com/*
// @match           https://police.missionchief-australia.com/*
// @match           https://www.missionchief.co.uk/*
// @match           https://police.missionchief.co.uk/*
// @match           https://www.missionchief.com/*
// @match           https://police.missionchief.com/*
// @match           https://www.centro-de-mando.es/*
// @match           https://www.centro-de-mando.mx/*
// @match           https://www.hatakeskuspeli.com/*
// @match           https://poliisi.hatakeskuspeli.com/*
// @match           https://www.operateur112.fr/*
// @match           https://police.operateur112.fr/*
// @match           https://www.operatore112.it/*
// @match           https://polizia.operatore112.it/*
// @match           https://www.missionchief-japan.com/*
// @match           https://www.missionchief-korea.com/*
// @match           https://www.nodsentralspillet.com/*
// @match           https://politiet.nodsentralspillet.com/*
// @match           https://www.meldkamerspel.com/*
// @match           https://politie.meldkamerspel.com/*
// @match           https://www.operatorratunkowy.pl/*
// @match           https://policja.operatorratunkowy.pl/*
// @match           https://www.operador193.com/*
// @match           https://www.jogo-operador112.com/*
// @match           https://policia.jogo-operador112.com/*
// @match           https://www.jocdispecerat112.com/*
// @match           https://www.dispetcher112.ru/*
// @match           https://www.dispecerske-centrum.com/*
// @match           https://www.larmcentralen-spelet.se/*
// @match           https://polis.larmcentralen-spelet.se/*
// @match           https://www.112-merkez.com/*
// @match           https://www.dyspetcher101-game.com/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Input max length
 * @name:de Textlänge bei Eingabefeldern prüfen
 * @description Shows a help about minimum and maximum length of text input fields
 * @description:de Zeigt eine Hilfe über die Mindest- und Maximaltextlänge von Eingabefeldern an
 * @forum https://forum.leitstellenspiel.de/index.php?thread/11756-erledigt-textl%C3%A4nge-in-begrenzten-eingabefeldern-schon-bei-eingabe-pr%C3%BCfen/
 * @old Input-Length
 * @grant GM_addStyle
 */

(function () {
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
        'vehicle_graphics[caption]': {
            min: 3,
            max: 30,
        },
        'mission_graphic[caption]': {
            min: 3,
            max: 30,
        },
        'alliance[caption]': {
            min: 3,
            max: 30,
        },
        'alliance_thread[caption]': {
            min: 1,
            max: 60,
        },
        'personal[name]': {
            min: 1,
            max: 40,
        },
        'note[message]': {
            min: 0,
            max: 1_048_576,
        },
        'friend[comment]': {
            min: 0,
            max: 65_535,
        },
    };

    GM_addStyle(
        `${Object.keys(lengthMap)
            .map(selector => `input[name=${JSON.stringify(selector)}]:invalid`)
            .join(',')} {border-color: #a94442;}`
    );

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
        if (!placeholder.endsWith(']')) {
            target.setAttribute(
                'placeholder',
                `${placeholder} [Dieses Eingabefeld muss zwischen ${minMax.min} und ${minMax.max} Zeichen haben!]]`.trim()
            );
        }
        const title = target.getAttribute('title') || '';
        if (!title.endsWith(']')) {
            target.setAttribute(
                'title',
                `${title} [Dieses Eingabefeld muss zwischen ${minMax.min} und ${minMax.max} Zeichen haben!]`.trim()
            );
        }
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
