// ==UserScript==
// @name         LSS-FollowVehicle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       KBOE2
// @grant        none
// @include      https://www.leitstellenspiel.de/*
// ==/UserScript==

(function() {
	'use strict';

	$('.followVehicle').remove();
	var followVehicle;
	$('.building_list_vehicle_element').each(function () {
		$(this).prepend('<button class="followVehicle btn btn-xs btn-' + (($(this).children() [1].innerText == '1' || $(this).children() [1].innerText == '3' || $(this).children() [1].innerText == '7') ? 'warning onMap' : 'danger') + '" vehicle_id="' + $(this).attr('vehicle_id') + '">FV</button>');
	});
	$('.followVehicle.onMap').click(function () {
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
		}
	});
})();
