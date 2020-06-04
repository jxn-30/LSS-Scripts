// ==UserScript==
// @name         LSS-Alliance-Member-Notes
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Customizable Notes for each alliance member
// @author       Jan (jxn_30)
// @grant        none
// @include      /^https?:\/\/(?:w{3}\.)?(?:leitstellenspiel\.de|(?:meldkamerspel|missionchief|missionchief-australia|nodsentralspillet|112-merkez|jogo-operador112|operador193|dyspetcher101-game|missionchief-japan|jocdispecerat112|missionchief-korea|hatakeskuspeli|dispecerske-centrum)\.com|missionchief\.co\.uk|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|operacni-stredisko\.cz|centro-de-mando\.mx)\/verband\/mitglieder\/?\d*(\?.*)?$/
// ==/UserScript==

(function() {
	'use strict';

    const showIfNote = false;

    const notes = JSON.parse(window.localStorage.memberlistNotes || '{}');

    document.querySelectorAll('tbody tr td:nth-of-type(1)').forEach(user => {
        const userId = user.querySelector('a[href^="/profile/"]').href.match(/\d+$/)[0];
        const noteBtn = document.createElement('button');
        noteBtn.classList.add('btn', 'btn-xs', 'btn-default');
        noteBtn.innerText = '📝';
        noteBtn.style.marginRight = '1em';
        const noteField = document.createElement('textarea')
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
        showIfNote && notes[userId] && noteBtn.click();
        saveBtn.addEventListener('click', () => {
            const notes = JSON.parse(window.localStorage.memberlistNotes || '{}');
            notes[userId] = noteField.value;
            window.localStorage.setItem('memberlistNotes', JSON.stringify(notes));
            noteBtn.classList.toggle('hidden');
            noteField.classList.toggle('hidden');
            saveBtn.classList.toggle('hidden');
        });
        user.insertAdjacentElement('afterbegin', saveBtn);
        user.insertAdjacentElement('afterbegin', noteField);
        user.insertAdjacentElement('afterbegin', noteBtn);
    });
})();
