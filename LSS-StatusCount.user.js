// ==UserScript==
// @name         LSS-StatusCount
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  Status-Zähler
// @author       Jan (jxn_30)
// @match        https://www.operacni-stredisko.cz/
// @match        https://policie.operacni-stredisko.cz/
// @match        https://www.alarmcentral-spil.dk/
// @match        https://politi.alarmcentral-spil.dk/
// @match        https://www.leitstellenspiel.de/
// @match        https://polizei.leitstellenspiel.de/
// @match        https://www.missionchief-australia.com/
// @match        https://police.missionchief-australia.com/
// @match        https://www.missionchief.co.uk/
// @match        https://police.missionchief.co.uk/
// @match        https://www.missionchief.com/
// @match        https://police.missionchief.com/
// @match        https://www.centro-de-mando.es/
// @match        https://www.centro-de-mando.mx/
// @match        https://www.hatakeskuspeli.com/
// @match        https://poliisi.hatakeskuspeli.com/
// @match        https://www.operateur112.fr/
// @match        https://police.operateur112.fr/
// @match        https://www.operatore112.it/
// @match        https://polizia.operatore112.it/
// @match        https://www.missionchief-japan.com/
// @match        https://www.missionchief-korea.com/
// @match        https://www.nodsentralspillet.com/
// @match        https://politiet.nodsentralspillet.com/
// @match        https://www.meldkamerspel.com/
// @match        https://politie.meldkamerspel.com/
// @match        https://www.operatorratunkowy.pl/
// @match        https://policja.operatorratunkowy.pl/
// @match        https://www.operador193.com/
// @match        https://www.jogo-operador112.com/
// @match        https://policia.jogo-operador112.com/
// @match        https://www.jocdispecerat112.com/
// @match        https://www.dispetcher112.ru/
// @match        https://www.dispecerske-centrum.com/
// @match        https://www.larmcentralen-spelet.se/
// @match        https://polis.larmcentralen-spelet.se/
// @match        https://www.112-merkez.com/
// @match        https://www.dyspetcher101-game.com/
// ==/UserScript==

(function() {
    'use strict';

    const round = 0; // Auf so viele Nachkommastellen werden die Prozente gerundet.

    let s1 = {
        "show": true,     // Zähler wird eingeblendet bei true, bei false ausgeblendet (Wichtig: Überschreibt hide! => Wenn hide auf true aber show auf false ist, wird es trotzdem nie eingeblendet).
        "percent": true,  // Prozentsatz wird angezeigt bei true, bei false nicht.
        "hide": false      // Bei true wird der Zähler ausgeblendet, sollte er auf 0 stehen, bei false ist diese Funktion deaktiviert.
    };
    let s2 = {
        "show": true,
        "percent": true,
        "hide": false
    };
    let s3 = {
        "show": true,
        "percent": true,
        "hide": false
    };
    let s4 = {
        "show": true,
        "percent": true,
        "hide": false
    };
    let s5 = {
        "show": true,
        "percent": true,
        "hide": false,
        "blink": false     // Wenn dieser Wert auf false ist, blinkt der S5-Zähler nur, wenn mind. 1 Sprechwunsch vorhanden ist.
    };
    let s6 = {
        "show": true,
        "percent": true,
        "hide": false
    };
    let s7 = {
        "show": true,
        "percent": true,
        "hide": false
    };
    let s9 = {
        "show": true,
        "percent": true,
        "hide": false
    };

    function renderStatus() {
        $('#statusCount').empty();
        s1.amount = s1.show ? $('#building_panel_body .building_list_fms_1').length : 0;
        s2.amount = s2.show ? $('#building_panel_body .building_list_fms_2').length : 0;
        s3.amount = s3.show ? $('#building_panel_body .building_list_fms_3').length : 0;
        s4.amount = s4.show ? $('#building_panel_body .building_list_fms_4').length : 0;
        s5.amount = s5.show ? $('#radio_messages_important .building_list_fms_5:visible').length : 0;
        s6.amount = s6.show ? $('#building_panel_body .building_list_fms_6').length : 0;
        s7.amount = s7.show ? $('#building_panel_body .building_list_fms_7').length : 0;
        s9.amount = s9.show ? $('#building_panel_body .building_list_fms_9').length : 0;
        let sum = s1.amount + s2.amount + s3.amount + s4.amount + s5.amount + s6.amount + s7.amount;
        s1.percentage = s1.percent ? parseFloat(s1.amount/(sum/100)).toFixed(round) : 0;
        s2.percentage = s2.percent ? parseFloat(s2.amount/(sum/100)).toFixed(round) : 0;
        s3.percentage = s3.percent ? parseFloat(s3.amount/(sum/100)).toFixed(round) : 0;
        s4.percentage = s4.percent ? parseFloat(s4.amount/(sum/100)).toFixed(round) : 0;
        s5.percentage = s5.percent ? parseFloat(s5.amount/(sum/100)).toFixed(round) : 0;
        s6.percentage = s6.percent ? parseFloat(s6.amount/(sum/100)).toFixed(round) : 0;
        s7.percentage = s7.percent ? parseFloat(s7.amount/(sum/100)).toFixed(round) : 0;
        s9.percentage = s9.percent ? parseFloat(s9.amount/(sum/100)).toFixed(round) : 0;
        (s1.show && !s1.hide) || (s1.show && s1.hide && s1.amount) ? $("#statusCount").append('<span class="building_list_fms building_list_fms_1" title="Status 1: ' + s1.amount + '">' + s1.amount + (s1.percent ? " (" + s1.percentage + "%)" : "") + '</span>') : null;
        (s2.show && !s2.hide) || (s2.show && s2.hide && s2.amount) ? $("#statusCount").append('<span class="building_list_fms building_list_fms_2" title="Status 2: ' + s2.amount + '">' + s2.amount + (s2.percent ? " (" + s2.percentage + "%)" : "") + '</span>') : null;
        (s3.show && !s3.hide) || (s3.show && s3.hide && s3.amount) ? $("#statusCount").append('<span class="building_list_fms building_list_fms_3" title="Status 3: ' + s3.amount + '">' + s3.amount + (s3.percent ? " (" + s3.percentage + "%)" : "") + '</span>') : null;
        (s4.show && !s4.hide) || (s4.show && s4.hide && s4.amount) ? $("#statusCount").append('<span class="building_list_fms building_list_fms_4" title="Status 4: ' + s4.amount + '">' + s4.amount + (s4.percent ? " (" + s4.percentage + "%)" : "") + '</span>') : null;
        (s5.show && !s5.hide) || (s5.show && s5.hide && s5.amount) ? $("#statusCount").append('<span class="building_list_fms building_list_fms_5" title="Status 5: ' + s5.amount + '">' + s5.amount + (s5.percent ? " (" + s5.percentage + "%)" : "") + '</span>') : null;
        (s6.show && !s6.hide) || (s6.show && s6.hide && s6.amount) ? $("#statusCount").append('<span class="building_list_fms building_list_fms_6" title="Status 6: ' + s6.amount + '">' + s6.amount + (s6.percent ? " (" + s6.percentage + "%)" : "") + '</span>') : null;
        (s7.show && !s7.hide) || (s7.show && s7.hide && s7.amount) ? $("#statusCount").append('<span class="building_list_fms building_list_fms_7" title="Status 7: ' + s7.amount + '">' + s7.amount + (s7.percent ? " (" + s7.percentage + "%)" : "") + '</span>') : null;
        (s9.show && !s9.hide) || (s9.show && s9.hide && s9.amount) ? $("#statusCount").append('<span class="building_list_fms building_list_fms_9" title="Status 9: ' + s9.amount + '">' + s9.amount + (s9.percent ? " (" + s9.percentage + "%)" : "") + '</span>') : null;

        $('#statusCount .building_list_fms_5').click(function() {
            $('#building_panel_body .building_list_fms_5').parent().find('a').click();
        });

        $('#statusCount .building_list_fms_5').css('background-image', (!s5.blink && $('#radio_messages_important .building_list_fms_5:visible').length === 0) ? 'url()' : 'url(/images/fms5_background.gif)');

        $('#statusCount').click(function() {
            renderStatus();
        });

        $('.radio_message_close').click(function() {
            renderStatus();
        });
    }

    let radioMessageBuffer = radioMessage;
    $("#radio_panel_heading").append("<span id='statusCount'></span>");
    renderStatus();
    radioMessage = function(t){
        radioMessageBuffer(t);
        renderStatus();
    };
})();
