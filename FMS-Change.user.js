// ==UserScript==
// @name         LSS-FMS-Change
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Bissle die LSS-FMS umschreiben
// @author       Jan (KBOE2)
// @match        https://www.leitstellenspiel.de/*
// @include      *://www.leitstellenspiel.de/
// @include      *://www.leitstellenspiel.de/*
// @include      *://www.missionchief.com/*
// @include      *://www.missionchief.com/
// @include      *://www.meldkamerspel.com/*
// @include      *://www.meldkamerspel.com/
// ==/UserScript==


(function() {
    'use strict';

    const statusDescription = true; //Setzte diesen Wert auf false, um sowas wie "Auf Anfahrt", "Am Einsatzort" etc auszublenden.

    let radioMessageBuffer = radioMessage;
    radioMessage = function(t){
        if (t.mission_id !== 0) {
            t.fms_text = (statusDescription ? t.fms_text + " <br>" : "") + $('#mission_caption_' + t.mission_id).text();
        }
        radioMessageBuffer(t);
    }
})();
