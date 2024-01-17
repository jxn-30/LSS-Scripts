// ==UserScript==
// @name            [LSS] extra alarm & close button
// @namespace       https://jxn.lss-manager.de
// @version         2023.11.15+1530
// @author          Jan (jxn_30)
// @description     adds an extra button for closing the alarm window after alarming
// @description:de  Zeigt im Einsatzfenster einen zusätzlichen Knopf zum alarmieren und schließen an.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/extraAlarmAndCloseBtn.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/extraAlarmAndCloseBtn.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/23205-scriptwunsch-alarmieren-und-fenster-schlie%C3%9Fen/
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
 * @name  extra alarm & close button
 * @description adds an extra button for closing the alarm window after alarming
 * @description:de Zeigt im Einsatzfenster einen zusätzlichen Knopf zum alarmieren und schließen an.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/23205-scriptwunsch-alarmieren-und-fenster-schlie%C3%9Fen/
 * @match /missions/*
 */

const btnText = 'Alarmieren & Schließen';

const adjustCloseSetting = async (close = true) => {
    const settings = await fetch('/api/settings').then(res => res.json());
    const formData = new FormData();
    Object.entries(settings).forEach(([key, value]) =>
        formData.append(
            `user[${key}]`,
            key === 'mission_alarmed_successfull_close_window' ? Number(close)
            : typeof value === 'boolean' ? Number(value)
            : value
        )
    );
    formData.append('utf8', '✓');
    formData.append('_method', 'put');
    formData.append(
        'authenticity_token',
        document
            .querySelector('[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
    fetch('/einstellungen', {
        body: formData,
        method: 'POST',
        mode: 'cors',
    }).then();
};

if (document.location.pathname === '/missions/close') {
    window.parent.eval(`(${adjustCloseSetting.toString()})(false)`);
}

const alarmAndCloseBtn = document.createElement('button');
alarmAndCloseBtn.classList.add('btn', 'btn-success', 'navbar-btn', 'btn-sm');
alarmAndCloseBtn.textContent = btnText;

alarmAndCloseBtn.addEventListener('click', async e => {
    e.preventDefault();
    adjustCloseSetting().then(() =>
        document.getElementById('mission_alarm_btn')?.click()
    );
});

document.addEventListener('DOMContentLoaded', () =>
    document.getElementById('mission_alarm_btn')?.after(alarmAndCloseBtn)
);
