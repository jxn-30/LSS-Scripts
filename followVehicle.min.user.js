// ==UserScript==
// @name         LSS-FollowVehicle
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  try to take over the world!
// @author       Jan (jxn_30)
// @grant        none
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

!function(){"use strict";var i;$(".followVehicle").remove(),$(".building_list_vehicle_element").each(function(){$(this).prepend('<button class="followVehicle btn btn-xs btn-'+("1"==$(this).children()[1].innerText||"3"==$(this).children()[1].innerText||"7"==$(this).children()[1].innerText?"warning onMap":"danger")+'" vehicle_id="'+$(this).attr("vehicle_id")+'">FV</button>')}),$(".followVehicle.onMap").click(function(){var e=alliance_building_show;alliance_building_show=!1;var n=$(this).attr("vehicle_id");$(".followVehicle.onMap[vehicle_id!="+n+"]").removeClass("btn-success"),$(".followVehicle.onMap[vehicle_id!="+n+"]").addClass("btn-warning"),void 0!==i&&clearInterval(i),$(this).hasClass("btn-warning")?($(this).removeClass("btn-warning"),$(this).addClass("btn-success"),"1"!=$(this).parent().children()[2].innerText&&"3"!=$(this).parent().children()[2].innerText&&"7"!=$(this).parent().children()[2].innerText||(i=setInterval(function(){$(".vehicle_search[vehicle_id="+n+"]").click()},100))):($(this).removeClass("btn-success"),$(this).addClass("btn-warning"),$(".followVehicle").each(function(){$(this).removeClass("btn-danger"),$(this).removeClass("btn-warning"),$(this).removeClass("btn-success"),$(this).removeClass("onMap"),"1"==$(this).parent().children()[2].innerText||"3"==$(this).parent().children()[2].innerText||"7"==$(this).parent().children()[2].innerText?($(this).addClass("btn-warning"),$(this).addClass("onMap")):$(this).addClass("btn-danger")})),alliance_building_show=e})}();
