// ==UserScript==
// @name         LSS-StatusCount
// @namespace    http://tampermonkey.net/
// @version      1.1.0
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

    const s1 = true;
    const s2 = true;
    const s3 = true;
    const s4 = true;
    const s5 = true;
    const s5blink = false; // Wenn dieser Wert auf false ist, blinkt das S5 nur, wenn mind. 1 Sprechwunsch vorhanden ist.
    const s6 = true;
    const s7 = true;
    const s9 = true;

    function renderStatus() {
        $('#statusCount').empty();
        s1 ? $("#statusCount").append('<span class="building_list_fms building_list_fms_1" title="Status 1: ' + $('#building_panel_body .building_list_fms_1').length + '">' + $('#building_panel_body .building_list_fms_1').length + '</span>') : null;
        s2 ? $("#statusCount").append('<span class="building_list_fms building_list_fms_2" title="Status 2: ' + $('#building_panel_body .building_list_fms_2').length + '">' + $('#building_panel_body .building_list_fms_2').length + '</span>') : null;
        s3 ? $("#statusCount").append('<span class="building_list_fms building_list_fms_3" title="Status 3: ' + $('#building_panel_body .building_list_fms_3').length + '">' + $('#building_panel_body .building_list_fms_3').length + '</span>') : null;
        s4 ? $("#statusCount").append('<span class="building_list_fms building_list_fms_4" title="Status 4: ' + $('#building_panel_body .building_list_fms_4').length + '">' + $('#building_panel_body .building_list_fms_4').length + '</span>') : null;
        s5 ? $("#statusCount").append('<span class="building_list_fms building_list_fms_5" title="Status 5: ' + $('#building_panel_body .building_list_fms_5').length + '">' + $('#building_panel_body .building_list_fms_5').length + '</span>') : null;
        s6 ? $("#statusCount").append('<span class="building_list_fms building_list_fms_6" title="Status 6: ' + $('#building_panel_body .building_list_fms_6').length + '">' + $('#building_panel_body .building_list_fms_6').length + '</span>') : null;
        s7 ? $("#statusCount").append('<span class="building_list_fms building_list_fms_7" title="Status 7: ' + $('#building_panel_body .building_list_fms_7').length + '">' + $('#building_panel_body .building_list_fms_7').length + '</span>') : null;
        s9 ? $("#statusCount").append('<span class="building_list_fms building_list_fms_9" title="Status 9: ' + $('#building_panel_body .building_list_fms_9').length + '">' + $('#building_panel_body .building_list_fms_9').length + '</span>') : null;

        $('#statusCount .building_list_fms_5').click(function() {
            $('#building_panel_body .building_list_fms_5').parent().find('a').click();
        });

        $('#statusCount .building_list_fms_5').css('background-image', (!s5blink && $('#building_panel_body .building_list_fms_5').length === 0) ? 'url()' : 'url(/images/fms5_background.gif)');
    }

    let radioMessageBuffer = radioMessage;
    $("#radio_panel_heading").append("<span id='statusCount'></span>");
    renderStatus();
    radioMessage = function(t){
        radioMessageBuffer(t);
        renderStatus();
    }
})();
