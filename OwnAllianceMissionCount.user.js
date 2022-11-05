// ==UserScript==
// @name         LSS-Own-Alliance-Mission-Count
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  shows number of own alliance missions
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
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var Frei
    if (I18n.locale == "de_DE") Frei = "Frei: "
    else if (I18n.locale == "nl_NL") Frei = "Team: "
    else Frei = "Alliance: "

    $('#search_input_field_missions')
        .css('width', '80%')
        .after(`&nbsp;<span id="own_alliance_missions">` + Frei +`${$('#mission_list :not(.mission_deleted) .panel-success').length}</span>`);
    let missionMarkerAddOrig = missionMarkerAdd;
    missionMarkerAdd = (t) => {
        missionMarkerAddOrig(t);
        $('#own_alliance_missions').text(Frei + `${$('#mission_list :not(.mission_deleted) .panel-success').length}`);
    };
    let missionDeleteOrig = missionDelete;
    missionDelete = (e) => {
        missionDeleteOrig(e);
        $('#own_alliance_missions').text(Frei + `${$('#mission_list :not(.mission_deleted) .panel-success').length}`);
    }
})();
