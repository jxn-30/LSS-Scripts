// ==UserScript==
// @name         LSS-Einsatzdauer_compressed
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Zeigt die Einsatzdauer in der Einsatzliste an
// @author       KBOE2
// @match        https://www.leitstellenspiel.de/*
// @grant        none
// @include      https://www.leitstellenspiel.de/*
// ==/UserScript==
(function(){"use strict";let a=missionTimer;missionTimer=function(b){var c=1e3*b.date_end-new Date().getTime();if(0<c){var d=new Date(c-3600000),e="";0!=d.getHours()&&(10>d.getHours()&&(e+="0"),e+=d.getHours()+":"),0==d.getMinutes()?e+="00:":(10>d.getMinutes()&&(e+="0"),e+=d.getMinutes()+":"),0==d.getSeconds()?e+="00":(10>d.getSeconds()&&(e+="0"),e+=d.getSeconds()),$("#mission_overview_countdown_"+b.id).html(e)$("#mission_out_"+t.id)[0]&&($("#mission_out_"+t.id).find(".btn-danger")[0]?$("#mission_overview_countdown_"+t.id).appendTo("#mission_caption_"+t.id):$("#mission_overview_countdown_"+t.id).prependTo($("#mission_bar_outer_"+t.id).parent()));}a(b)}})();
