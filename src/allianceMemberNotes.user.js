// ==UserScript==
// @name            [LSS] Alliance Member Notes
// @namespace       https://jxn.lss-manager.de
// @version         2022.11.26+1803
// @author          Jan (jxn_30)
// @description     Customizable Notes for each alliance member
// @description:de  Frei anpassbare Notizen für jedes Verbandsmitglied
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/allianceMemberNotes.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/allianceMemberNotes.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/18517-scriptwunsch-notizen-bei-mitgliedern
// @match           https://www.operacni-stredisko.cz/verband/mitglieder
// @match           https://www.operacni-stredisko.cz/verband/mitglieder/*
// @match           https://policie.operacni-stredisko.cz/verband/mitglieder
// @match           https://policie.operacni-stredisko.cz/verband/mitglieder/*
// @match           https://www.alarmcentral-spil.dk/verband/mitglieder
// @match           https://www.alarmcentral-spil.dk/verband/mitglieder/*
// @match           https://politi.alarmcentral-spil.dk/verband/mitglieder
// @match           https://politi.alarmcentral-spil.dk/verband/mitglieder/*
// @match           https://www.leitstellenspiel.de/verband/mitglieder
// @match           https://www.leitstellenspiel.de/verband/mitglieder/*
// @match           https://polizei.leitstellenspiel.de/verband/mitglieder
// @match           https://polizei.leitstellenspiel.de/verband/mitglieder/*
// @match           https://www.missionchief-australia.com/verband/mitglieder
// @match           https://www.missionchief-australia.com/verband/mitglieder/*
// @match           https://police.missionchief-australia.com/verband/mitglieder
// @match           https://police.missionchief-australia.com/verband/mitglieder/*
// @match           https://www.missionchief.co.uk/verband/mitglieder
// @match           https://www.missionchief.co.uk/verband/mitglieder/*
// @match           https://police.missionchief.co.uk/verband/mitglieder
// @match           https://police.missionchief.co.uk/verband/mitglieder/*
// @match           https://www.missionchief.com/verband/mitglieder
// @match           https://www.missionchief.com/verband/mitglieder/*
// @match           https://police.missionchief.com/verband/mitglieder
// @match           https://police.missionchief.com/verband/mitglieder/*
// @match           https://www.centro-de-mando.es/verband/mitglieder
// @match           https://www.centro-de-mando.es/verband/mitglieder/*
// @match           https://www.centro-de-mando.mx/verband/mitglieder
// @match           https://www.centro-de-mando.mx/verband/mitglieder/*
// @match           https://www.hatakeskuspeli.com/verband/mitglieder
// @match           https://www.hatakeskuspeli.com/verband/mitglieder/*
// @match           https://poliisi.hatakeskuspeli.com/verband/mitglieder
// @match           https://poliisi.hatakeskuspeli.com/verband/mitglieder/*
// @match           https://www.operateur112.fr/verband/mitglieder
// @match           https://www.operateur112.fr/verband/mitglieder/*
// @match           https://police.operateur112.fr/verband/mitglieder
// @match           https://police.operateur112.fr/verband/mitglieder/*
// @match           https://www.operatore112.it/verband/mitglieder
// @match           https://www.operatore112.it/verband/mitglieder/*
// @match           https://polizia.operatore112.it/verband/mitglieder
// @match           https://polizia.operatore112.it/verband/mitglieder/*
// @match           https://www.missionchief-japan.com/verband/mitglieder
// @match           https://www.missionchief-japan.com/verband/mitglieder/*
// @match           https://www.missionchief-korea.com/verband/mitglieder
// @match           https://www.missionchief-korea.com/verband/mitglieder/*
// @match           https://www.nodsentralspillet.com/verband/mitglieder
// @match           https://www.nodsentralspillet.com/verband/mitglieder/*
// @match           https://politiet.nodsentralspillet.com/verband/mitglieder
// @match           https://politiet.nodsentralspillet.com/verband/mitglieder/*
// @match           https://www.meldkamerspel.com/verband/mitglieder
// @match           https://www.meldkamerspel.com/verband/mitglieder/*
// @match           https://politie.meldkamerspel.com/verband/mitglieder
// @match           https://politie.meldkamerspel.com/verband/mitglieder/*
// @match           https://www.operatorratunkowy.pl/verband/mitglieder
// @match           https://www.operatorratunkowy.pl/verband/mitglieder/*
// @match           https://policja.operatorratunkowy.pl/verband/mitglieder
// @match           https://policja.operatorratunkowy.pl/verband/mitglieder/*
// @match           https://www.operador193.com/verband/mitglieder
// @match           https://www.operador193.com/verband/mitglieder/*
// @match           https://www.jogo-operador112.com/verband/mitglieder
// @match           https://www.jogo-operador112.com/verband/mitglieder/*
// @match           https://policia.jogo-operador112.com/verband/mitglieder
// @match           https://policia.jogo-operador112.com/verband/mitglieder/*
// @match           https://www.jocdispecerat112.com/verband/mitglieder
// @match           https://www.jocdispecerat112.com/verband/mitglieder/*
// @match           https://www.dispetcher112.ru/verband/mitglieder
// @match           https://www.dispetcher112.ru/verband/mitglieder/*
// @match           https://www.dispecerske-centrum.com/verband/mitglieder
// @match           https://www.dispecerske-centrum.com/verband/mitglieder/*
// @match           https://www.larmcentralen-spelet.se/verband/mitglieder
// @match           https://www.larmcentralen-spelet.se/verband/mitglieder/*
// @match           https://polis.larmcentralen-spelet.se/verband/mitglieder
// @match           https://polis.larmcentralen-spelet.se/verband/mitglieder/*
// @match           https://www.112-merkez.com/verband/mitglieder
// @match           https://www.112-merkez.com/verband/mitglieder/*
// @match           https://www.dyspetcher101-game.com/verband/mitglieder
// @match           https://www.dyspetcher101-game.com/verband/mitglieder/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Alliance Member Notes
 * @description Customizable Notes for each alliance member
 * @description:de Frei anpassbare Notizen für jedes Verbandsmitglied
 * @forum https://forum.leitstellenspiel.de/index.php?thread/18517-scriptwunsch-notizen-bei-mitgliedern
 * @match /verband/mitglieder
 * @match /verband/mitglieder/*
 * @old Alliance-Member-Notes
 */

(function () {
    'use strict';

    const showIfNote = false;

    const notes = JSON.parse(window.localStorage.memberlistNotes || '{}');

    document.querySelectorAll('tbody tr td:nth-of-type(1)').forEach(user => {
        const userId = user
            .querySelector('a[href^="/profile/"]')
            .href.match(/\d+$/)[0];
        const noteBtn = document.createElement('button');
        noteBtn.classList.add('btn', 'btn-xs', 'btn-default');
        noteBtn.innerText = '📝';
        noteBtn.style.marginRight = '1em';
        const noteField = document.createElement('textarea');
        noteField.setAttribute('placeholder', `Notiz für ${userId}`);
        noteField.style.marginRight = '1em';
        noteField.classList.add('hidden');
        noteField.value = notes[userId] || '';
        const saveBtn = document.createElement('button');
        saveBtn.classList.add('btn', 'btn-xs', 'btn-success', 'hidden');
        saveBtn.innerText = '💾';
        saveBtn.style.marginRight = '1em';
        noteBtn.addEventListener('click', () => {
            noteBtn.classList.toggle('hidden');
            noteField.classList.toggle('hidden');
            saveBtn.classList.toggle('hidden');
        });
        if (showIfNote && notes[userId]) noteBtn.click();
        saveBtn.addEventListener('click', () => {
            const notes = JSON.parse(
                window.localStorage.memberlistNotes || '{}'
            );
            notes[userId] = noteField.value;
            window.localStorage.setItem(
                'memberlistNotes',
                JSON.stringify(notes)
            );
            noteBtn.classList.toggle('hidden');
            noteField.classList.toggle('hidden');
            saveBtn.classList.toggle('hidden');
        });
        user.prepend(saveBtn, noteField, noteBtn);
    });
})();
