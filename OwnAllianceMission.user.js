// ==UserScript==
// @name         LSS-Own-Alliance-Mission
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  shows number of own alliance missions
// @author       You
// @include      https://www.leitstellenspiel.de/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('#search_input_field_missions')
        .css('width', '80%')
        .after(`&nbsp;<span id="own_alliance_missions">Frei: ${$('#mission_list .panel-success').length}</span>`);
    let missionMarkerAddOrig = missionMarkerAdd;
    missionMarkerAdd = (t) => {
        missionMarkerAddOrig(t);
        $('#own_alliance_missions').text(`Frei: ${$('#mission_list .panel-success').length}`);
    };
})();
