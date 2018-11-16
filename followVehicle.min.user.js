// ==UserScript==
// @name         LSS-FollowVehicle
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Jan (KBOE2)
// @grant        none
// @include      https://www.leitstellenspiel.de/*
// ==/UserScript==

!function(){"use strict";var i;$(".followVehicle").remove(),$(".building_list_vehicle_element").each(function(){$(this).prepend('<button class="followVehicle btn btn-xs btn-'+("1"==$(this).children()[1].innerText||"3"==$(this).children()[1].innerText||"7"==$(this).children()[1].innerText?"warning onMap":"danger")+'" vehicle_id="'+$(this).attr("vehicle_id")+'">FV</button>')}),$(".followVehicle.onMap").click(function(){var e=alliance_building_show;alliance_building_show=!1;var n=$(this).attr("vehicle_id");$(".followVehicle.onMap[vehicle_id!="+n+"]").removeClass("btn-success"),$(".followVehicle.onMap[vehicle_id!="+n+"]").addClass("btn-warning"),void 0!==i&&clearInterval(i),$(this).hasClass("btn-warning")?($(this).removeClass("btn-warning"),$(this).addClass("btn-success"),"1"!=$(this).parent().children()[2].innerText&&"3"!=$(this).parent().children()[2].innerText&&"7"!=$(this).parent().children()[2].innerText||(i=setInterval(function(){$(".vehicle_search[vehicle_id="+n+"]").click()},100))):($(this).removeClass("btn-success"),$(this).addClass("btn-warning"),$(".followVehicle").each(function(){$(this).removeClass("btn-danger"),$(this).removeClass("btn-warning"),$(this).removeClass("btn-success"),$(this).removeClass("onMap"),"1"==$(this).parent().children()[2].innerText||"3"==$(this).parent().children()[2].innerText||"7"==$(this).parent().children()[2].innerText?($(this).addClass("btn-warning"),$(this).addClass("onMap")):$(this).addClass("btn-danger")})),alliance_building_show=e})}();
