// ==UserScript==
// @name         LSS-FollowVehicle
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @author       Jan (KBOE2)
// @grant        none
// @include      https://www.leitstellenspiel.de/*
// @include      https://www.missionchief.com/*
// @include      https://www.meldkamerspel.com/*
// ==/UserScript==

(function() {
	'use strict';

	$('.followVehicle').remove();
    $('.building_list_vehicle_element').each(function () {
            $(this).prepend('<button class="followVehicle btn btn-xs btn-' + (($(this).children() [1].innerText == '1' || $(this).children() [1].innerText == '3' || $(this).children() [1].innerText == '7') ? 'warning onMap' : 'danger') + '" vehicle_id="' + $(this).attr('vehicle_id') + '">FV</button>');
        });
	var followVehicle;
	$('.followVehicle.onMap').click(function () {
        var alliance_building_show_orig = alliance_building_show;
        alliance_building_show = false;
		var vehicleId = $(this).attr('vehicle_id');
		$('.followVehicle.onMap[vehicle_id!=' + vehicleId + ']').removeClass('btn-success');
		$('.followVehicle.onMap[vehicle_id!=' + vehicleId + ']').addClass('btn-warning');
		if (typeof followVehicle != "undefined") {
			clearInterval(followVehicle);
		}
		if ($(this).hasClass('btn-warning')) {
			$(this).removeClass('btn-warning');
			$(this).addClass('btn-success');
			if ($(this).parent().children() [2].innerText == '1' || $(this).parent().children() [2].innerText == '3' || $(this).parent().children() [2].innerText == '7') {
				followVehicle = setInterval(function () {
					$('.vehicle_search[vehicle_id=' + vehicleId + ']').click();
				}, 100);
			}
		} else {
			$(this).removeClass('btn-success');
			$(this).addClass('btn-warning');
            $('.followVehicle').each(function () {
                $(this).removeClass('btn-danger');
                $(this).removeClass('btn-warning');
                $(this).removeClass('btn-success');
                $(this).removeClass('onMap');
                if ($(this).parent().children() [2].innerText == '1' || $(this).parent().children() [2].innerText == '3' || $(this).parent().children() [2].innerText == '7') {
                    $(this).addClass('btn-warning');
                    $(this).addClass('onMap');
                } else {
                    $(this).addClass('btn-danger');
                }
            });
		}
        alliance_building_show = alliance_building_show_orig;
	});
})();
