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

!function(){"use strict";let t=missionTimer;missionTimer=function(e){var i=1e3*e.date_end-(new Date).getTime();if(0<i){var n=new Date(i-36e5),o="";0!=n.getHours()&&(n.getHours()<10&&(o+="0"),o+=n.getHours()+":"),0!=n.getMinutes()?(n.getMinutes()<10&&(o+="0"),o+=n.getMinutes()+":"):o+="00:",0!=n.getSeconds()?(n.getSeconds()<10&&(o+="0"),o+=n.getSeconds()):o+="00",$("#mission_overview_countdown_"+e.id).html(o),$("#mission_out_"+e.id)[0]&&($("#mission_out_"+e.id).find(".btn-danger")[0]?$("#mission_overview_countdown_"+e.id).appendTo("#mission_caption_"+e.id):$("#mission_overview_countdown_"+e.id).prependTo($("#mission_bar_outer_"+e.id).parent()))}t(e)}}();
