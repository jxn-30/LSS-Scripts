// ==UserScript==
// @name         LSS-Own-Alliance-Mission-Count
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  shows number of own alliance missions
// @author       Jan (KBOE2)
// @include      https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('#search_input_field_missions')
        .css('width', '80%')
        .after(`&nbsp;<span id="own_alliance_missions">Frei: ${$('#mission_list :not(.mission_deleted) .panel-success').length}</span>`);
    let missionMarkerAddOrig = missionMarkerAdd;
    missionMarkerAdd = (t) => {
        missionMarkerAddOrig(t);
        $('#own_alliance_missions').text(`Frei: ${$('#mission_list :not(.mission_deleted) .panel-success').length}`);
    };
    let missionDeleteOrig = missionDelete;
    missionDelete = (e) => {
        missionDeleteOrig(e);
        $('#own_alliance_missions').text(`Frei: ${$('#mission_list :not(.mission_deleted) .panel-success').length}`);
    }
})();
