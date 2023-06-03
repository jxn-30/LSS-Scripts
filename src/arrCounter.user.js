// ==UserScript==
// @name            [LSS] ARR Counter
// @name:de         [LSS] AAO-Zähler
// @namespace       https://jxn.lss-manager.de
// @version         2023.06.03+1511
// @author          Jan (jxn_30)
// @description     Counts how often an ARR is clicked
// @description:de  Zeigt einen Zähler an, wie oft eine AAO geklickt wurde
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/arrCounter.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/arrCounter.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/19317-script-aao-z%C3%A4hler-standalone/
// @match           https://www.operacni-stredisko.cz/missions/*
// @match           https://policie.operacni-stredisko.cz/missions/*
// @match           https://www.alarmcentral-spil.dk/missions/*
// @match           https://politi.alarmcentral-spil.dk/missions/*
// @match           https://www.leitstellenspiel.de/missions/*
// @match           https://polizei.leitstellenspiel.de/missions/*
// @match           https://www.missionchief-australia.com/missions/*
// @match           https://police.missionchief-australia.com/missions/*
// @match           https://www.missionchief.co.uk/missions/*
// @match           https://police.missionchief.co.uk/missions/*
// @match           https://www.missionchief.com/missions/*
// @match           https://police.missionchief.com/missions/*
// @match           https://www.centro-de-mando.es/missions/*
// @match           https://www.centro-de-mando.mx/missions/*
// @match           https://www.hatakeskuspeli.com/missions/*
// @match           https://poliisi.hatakeskuspeli.com/missions/*
// @match           https://www.operateur112.fr/missions/*
// @match           https://police.operateur112.fr/missions/*
// @match           https://www.operatore112.it/missions/*
// @match           https://polizia.operatore112.it/missions/*
// @match           https://www.missionchief-japan.com/missions/*
// @match           https://www.missionchief-korea.com/missions/*
// @match           https://www.nodsentralspillet.com/missions/*
// @match           https://politiet.nodsentralspillet.com/missions/*
// @match           https://www.meldkamerspel.com/missions/*
// @match           https://politie.meldkamerspel.com/missions/*
// @match           https://www.operatorratunkowy.pl/missions/*
// @match           https://policja.operatorratunkowy.pl/missions/*
// @match           https://www.operador193.com/missions/*
// @match           https://www.jogo-operador112.com/missions/*
// @match           https://policia.jogo-operador112.com/missions/*
// @match           https://www.jocdispecerat112.com/missions/*
// @match           https://www.dispetcher112.ru/missions/*
// @match           https://www.dispecerske-centrum.com/missions/*
// @match           https://www.larmcentralen-spelet.se/missions/*
// @match           https://polis.larmcentralen-spelet.se/missions/*
// @match           https://www.112-merkez.com/missions/*
// @match           https://www.dyspetcher101-game.com/missions/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name ARR Counter
 * @name:de AAO-Zähler
 * @description Counts how often an ARR is clicked
 * @description:de Zeigt einen Zähler an, wie oft eine AAO geklickt wurde
 * @forum https://forum.leitstellenspiel.de/index.php?thread/19317-script-aao-z%C3%A4hler-standalone/
 * @match /missions/*
 */

(function () {
    'use strict';

    const ARRContainer = document.getElementById('mission-aao-group');

    if (!ARRContainer) return;

    const counter = true;
    const highlight = false;

    const counterClass = 'arr-counter-standalone';
    const highlightClass = 'arr-clicked-standalone';

    if (counter || highlight) {
        document.head.innerHTML += `<style>
.${counterClass}:not([data-amount]), .${counterClass}[data-amount="0"] {
    display: none;
}
.${counterClass}::after {
    content: " " attr(data-amount) "x"
}
.${highlightClass} {
    border: 2px solid #008000 !important;
}
</style>`;
    }

    const counterNodes = {};

    const resetCounters = () => {
        if (counter) {
            Object.values(counterNodes).forEach(counter => {
                counter.removeAttribute('data-amount');
                counter.parentElement?.classList.remove(highlightClass);
            });
        } else {
            Array.from(document.querySelectorAll(`.${highlightClass}`)).forEach(
                arr => arr.classList.remove(highlightClass)
            );
        }
        window.vehicleSelectionReset();
    };

    if (counter || highlight) {
        ARRContainer.addEventListener('mouseup', e => {
            const targetARR = e.target?.closest('.aao, .vehicle_group');

            if (
                !targetARR ||
                !ARRContainer.contains(targetARR) ||
                targetARR.querySelector('.label-danger')
            ) {
                return;
            }

            const arrId =
                targetARR.getAttribute('aao_id') ||
                targetARR.getAttribute('vehicle_group_id');
            if (!arrId) return;
            let counterNode = counterNodes[arrId];
            if (!counterNode) {
                counterNode = document.createElement('span');
                counterNode.classList.add(counterClass);
                counterNode.setAttribute('data-amount', '0');
                targetARR
                    .querySelector('.label')
                    ?.insertAdjacentElement('afterend', counterNode);
                counterNodes[arrId] = counterNode;
            }

            if (targetARR.getAttribute('reset') === 'true') resetCounters();

            if (counter) {
                counterNode.setAttribute(
                    'data-amount',
                    (
                        parseInt(
                            counterNode.getAttribute('data-amount') || '0'
                        ) + 1
                    ).toLocaleString()
                );
            }

            if (highlight) targetARR.classList.add(highlightClass);
        });
    }

    let resetBtnHolder = document.querySelector(
        '#container_navbar_alarm .navbar-right'
    );

    if (!resetBtnHolder) {
        resetBtnHolder = document.createElement('div');
        resetBtnHolder.classList.add(
            'nav',
            'navbar-nav',
            'navbar-right',
            'hidden-xs'
        );
        resetBtnHolder.id = 'navbar-right-help-button';
        document
            .querySelector('#container_navbar_alarm .container-fluid')
            ?.appendChild(resetBtnHolder);
    }
    document
        .getElementById('navbar-right-help-button')
        ?.classList.add('btn-group');

    const resetBtnTexts = [];

    if (counter) resetBtnTexts.push('counter');
    if (highlight) resetBtnTexts.push('highlight');
    resetBtnTexts.push('selection');

    const resetBtnTextTranslations = {
        counter: 'AAO-Zähler',
        highlight: 'AAO-Umrandung',
        selection: 'Fahrzeugauswahl',
        counter_highlight: 'AAO-Zähler / -Umrandung',
        counter_selection: 'AAO-Zähler und Fahrzeugauswahl',
        highlight_selection: 'AAO-Umrandung und Fahrzeugauswahl',
        counter_highlight_selection:
            'AAO-Zähler / -Umrandung und Fahrzeugauswahl',
    };

    const resetBtn = document.createElement('a');
    resetBtn.classList.add(
        'btn',
        'btn-default',
        'btn-xs',
        'navbar-btn',
        'hidden-xs'
    );
    resetBtn.onclick = resetCounters;
    resetBtn.textContent = `${
        resetBtnTextTranslations[resetBtnTexts.join('_')]
    } zurücksetzen`;
    resetBtnHolder.appendChild(resetBtn);
})();
