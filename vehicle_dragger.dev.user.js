// ==UserScript==
// @name         Fahrzeuge dragger
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Eigene Positionen von Fahrzeugen in der Gebäudeliste
// @author       Jan (jxn_30)
// @grant        none
// @include      https://www.leitstellenspiel.de/*
// ==/UserScript==

(function() {
	'use strict';

	var localStorageName = 'vehicleSort';

	$('#btn-group-building-select').after('<a class="btn btn-xs btn-primary" id="saveOrderOfVehicles">Fahrzeugreihenfolge speichern</a>');

	$('#saveOrderOfVehicles').click(function() {
		alert('Speichern der Ordnung in der Gebäudeliste geht noch net! 😛');
	});

	function orderVehicles() {
		$('.pullVehicle').remove();
		$('#building_panel_body .vehicle_search').before('<i class="pullVehicle glyphicon glyphicon-resize-vertical"></i>');
		$('.building_list_vehicles').sortable({
			handle: '.pullVehicle'
		});
		var buildings = $('.building_list_li div a.lightbox-open');
		for (var k = 0; k < buildings.length; k++) {
			var buildingId = $(buildings[k]).attr('href').replace(/\D*/, '');
			if (typeof vehicleOrder[buildingId] != "undefined") {
				var vehicles = $('#vehicle_building_' + buildingId + ' li.building_list_vehicle_element');
				$('#vehicle_building_' + buildingId + ' li.building_list_vehicle_element').remove();
				for (var l = 0; l < vehicleOrder[buildingId].length; l++) {
					for (var m = 0; m < vehicles.length; m++) {
						if ($(vehicles[m]).attr('vehicle_id') == vehicleOrder[buildingId][l]) {
							$('#vehicle_building_' + buildingId).append(vehicles[m]);
							vehicles.slice(m, 1);
						}
					}
				}
			}
		}
	}

	$('#building_panel_body').hover(function() {
		orderVehicles();
	});

	if (!localStorage[localStorageName]) {
		localStorage[localStorageName] = JSON.stringify({});
	}

	var vehicleOrder = JSON.parse(localStorage[localStorageName]);


	if (window.location.href.match(/building/) && $('#vehicle_table')[0]) {
		var buildingId = window.location.href.replace(/\D*/, '');

		$('head').append('<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>');

		$('.vehicle_image_reload').each(function() {
			$(this).before('<i class="pullVehicle glyphicon glyphicon-resize-vertical"></i>&nbsp;');
		});

		$('.pullVehicle').css('cursor', 'move');

		$('dl.dl-horizontal').append('<dd><a class="btn btn-xs btn-primary" id="saveVehicleOrder">Fahrzeugreihenfolge speichern</a></dd>');

		$('#saveVehicleOrder').click(function() {
			vehicleOrder[buildingId] = []
			for (var i = 0; i < $('#vehicle_table > tbody > tr').length; i++) {
				vehicleOrder[buildingId][i] = $($($('#vehicle_table > tbody > tr')[i]).children()[1]).children().attr('href').replace(/\D*/, '');
			};
			localStorage[localStorageName] = JSON.stringify(vehicleOrder);
			alert('Fahrzeugreihenfolge wurde erfolgreich gespeichert!');
		});

		$('#vehicle_table > tbody').sortable({
			handle: '.pullVehicle'
		});

		if (vehicleOrder[buildingId]) {
			var vehicles = $('#vehicle_table > tbody > tr');
			$('#vehicle_table > tbody > tr').remove();
			for (var i = 0; i < vehicleOrder[buildingId].length; i++) {
				var vehicleId = vehicleOrder[buildingId][i];
				for (var j = 0; j < vehicles.length; j++) {
					if ($($(vehicles[j]).children()[1]).children().attr('href').replace(/\D*/, '') == vehicleId) {
						$('#vehicle_table > tbody').append(vehicles[j]);
					}
				}
			}
		}
	} else {
		orderVehicles();
	}
})();
