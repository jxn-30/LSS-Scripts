// ==UserScript==
// @name         LSS – extra alarm & close button
// @namespace    https://jxn.lss-manager.de
// @version      1.0.0
// @description  adds an extra button for closing the alarm window after alarming
// @author       jxn_30
// @match        https://www.leitstellenspiel.de/missions/*
// @grant        none
// @run-at       document-start
// ==/UserScript==


const adjustCloseSetting = async (close = true) => {
    const settings = await fetch('/api/settings').then(res => res.json());
    const formData = new FormData();
    Object.entries(settings).forEach(([key, value]) => formData.append(`user[${key}]`, key === 'mission_alarmed_successfull_close_window' ? +close : typeof value === 'boolean' ? +value : value));
    formData.append('utf8', '✓');
    formData.append('_method', 'put');
    formData.append('authenticity_token', document.querySelector('[name="csrf-token"]')?.getAttribute('content') ?? '');
    fetch('/einstellungen', {
        "body": formData,
        "method": "POST",
        "mode": "cors"
    });
}

if (document.location.pathname === '/missions/close') window.parent.eval(`(${adjustCloseSetting.toString()})(false)`);

const alarmAndCloseBtn = document.createElement('button');
alarmAndCloseBtn.classList.add('btn', 'btn-success', 'navbar-btn', 'btn-sm');
alarmAndCloseBtn.textContent = 'Alarmieren & Schließen';

alarmAndCloseBtn.addEventListener('click', async e => {
    e.preventDefault();
    adjustCloseSetting().then(() => document.getElementById('mission_alarm_btn')?.click());
});

document.addEventListener('DOMContentLoaded', () => document.getElementById('mission_alarm_btn')?.after(alarmAndCloseBtn));
