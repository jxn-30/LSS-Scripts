// ==UserScript==
// @name         LSS-AAO-Counter-standalone
// @version      1.0.0
// @description  Counts how often an ARR is clicked :)
// @author       Jan (jxn_30)
// @include      /^https?:\/\/(?:w{3}\.)?(?:leitstellenspiel\.de|(?:meldkamerspel|missionchief|missionchief-australia|nodsentralspillet|112-merkez|jogo-operador112|operador193|dyspetcher101-game|missionchief-japan|jocdispecerat112|missionchief-korea|hatakeskuspeli|dispecerske-centrum)\.com|missionchief\.co\.uk|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|operacni-stredisko\.cz|centro-de-mando\.mx)\/missions/\d+$/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const ARRContainer = document.getElementById('mission-aao-group');

    if (!ARRContainer) return;

    const counter = true;
    const highlight = false;

    const counterClass = 'arr-counter-standalone';
    const highlightClass = 'arr-clicked-standalone';

    if (counter || highlight)
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

    const counterNodes = {};

    const resetCounters = () => {
        if (counter)
            Object.values(counterNodes).forEach(counter => {
                counter.removeAttribute('data-amount');
                counter.parentElement?.classList.remove(highlightClass);
            });
        else
            Array.from(
                document.querySelectorAll(`.${highlightClass}`)
            ).forEach(arr => arr.classList.remove(highlightClass));
        window.vehicleSelectionReset();
    };

    (counter || highlight) &&
        ARRContainer.addEventListener('mouseup', e => {
            const targetARR = e.target?.closest('.aao, .vehicle_group');

            if (
                !targetARR ||
                !ARRContainer.contains(targetARR) ||
                targetARR.querySelector('.label-danger')
            )
                return;

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

            if (counter)
                counterNode.setAttribute(
                    'data-amount',
                    (
                        parseInt(
                            counterNode.getAttribute('data-amount') || '0'
                        ) + 1
                    ).toLocaleString()
                );

            if (highlight) targetARR.classList.add(highlightClass);
        });

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
