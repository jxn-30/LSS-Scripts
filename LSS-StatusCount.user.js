// ==UserScript==
// @name         LSS-StatusCount
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Status-Zähler
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

    let s1 = {
        "show": true,     // Zähler wird eingeblendet bei true, bei false ausgeblendet (Wichtig: Überschreibt hide! => Wenn hide auf true aber show auf false ist, wird es trotzdem nie eingeblendet).
        "percent": true,  // Prozentsatz wird angezeigt bei true, bei false nicht.
        "hide": true      // Bei true wird der Zähler ausgeblendet, sollte er auf 0 stehen, bei false ist diese Funktion deaktiviert.
    };
    let s2 = {
        "show": true,
        "percent": true,
        "hide": false
    };
    let s3 = {
        "show": true,
        "percent": false,
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
        "show": false,
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
        s1.percentage = s1.percent ? parseInt(s1.amount/(sum/100)) : 0;
        s2.percentage = s2.percent ? parseInt(s2.amount/(sum/100)) : 0;
        s3.percentage = s3.percent ? parseInt(s3.amount/(sum/100)) : 0;
        s4.percentage = s4.percent ? parseInt(s4.amount/(sum/100)) : 0;
        s5.percentage = s5.percent ? parseInt(s5.amount/(sum/100)) : 0;
        s6.percentage = s6.percent ? parseInt(s6.amount/(sum/100)) : 0;
        s7.percentage = s7.percent ? parseInt(s7.amount/(sum/100)) : 0;
        s9.percentage = s9.percent ? parseInt(s9.amount/(sum/100)) : 0;
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
