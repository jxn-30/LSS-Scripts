// ==UserScript==
// @name            [LSS] Mission Alarm Time
// @namespace       https://jxn.lss-manager.de
// @version         2023.08.18+0347
// @author          Jan (jxn_30)
// @description     Shows maximum travel time on alarm button
// @description:de  Zeigt die maximale Anfahrtszeit auf dem Alarmierungsknopf an
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/missionAlarmTime.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/missionAlarmTime.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/16776-script-mission-alarm-time/
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
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name  Mission Alarm Time
 * @description Shows maximum travel time on alarm button
 * @description:de Zeigt die maximale Anfahrtszeit auf dem Alarmierungsknopf an
 * @forum https://forum.leitstellenspiel.de/index.php?thread/16776-script-mission-alarm-time/
 * @match /missions/*
 * @grant GM_addStyle
 * @old Mission-Alarm-Time
 */

(() => {
    const alarmBtn = document.querySelector('#mission_alarm_btn');
    if (!alarmBtn) return;

    GM_addStyle(`
#mission_alarm_btn::after {
    content: " " attr(data-alarm-time);
}`);
    const getLastVehicleTime = () => {
        const vehicles = Array.from(
            document.querySelectorAll(
                '#vehicle_list_step #all .vehicle_checkbox:checked'
            )
        );
        const lastVehicle = vehicles.at(-1);
        const vehicleId = lastVehicle?.getAttribute('value');
        const alarmTime =
            document.querySelector(
                `#vehicle_list_step #all #vehicle_sort_${vehicleId}`
            )?.childNodes[0]?.textContent ?? '';
        return { lastVehicle, alarmTime };
    };

    const setAlarmTime = alarmTime => {
        alarmBtn.setAttribute('data-alarm-time', alarmTime || '');
    };

    const observer = new MutationObserver((_, observer) => {
        const { lastVehicle, alarmTime } = getLastVehicleTime();
        setAlarmTime(alarmTime);
        const vehicleId = lastVehicle?.getAttribute('value');
        const sortValue =
            document
                .querySelector(`#vehicle_sort_${vehicleId}`)
                ?.getAttribute('sortvalue')
                ?.toString() || '99999999999';
        if (!sortValue.startsWith('9999999999')) observer.disconnect();
    });

    const update = () => {
        const { lastVehicle, alarmTime } = getLastVehicleTime();
        setAlarmTime(alarmTime);
        const calcTimeBtn =
            lastVehicle?.parentElement?.parentElement?.querySelector(
                '.calculateTime'
            );
        if (calcTimeBtn && calcTimeBtn.parentElement) {
            calcTimeBtn.click();
            observer.observe(calcTimeBtn.parentElement, {
                childList: true,
            });
        }
    };

    const amountObserver = new MutationObserver(update);

    const amountElement = document.querySelector('#vehicle_amount');

    if (amountElement) {
        amountObserver.observe(amountElement, {
            childList: true,
            characterData: true,
        });
    }

    update();
})();
