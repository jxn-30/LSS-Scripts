// ==UserScript==
// @name         AAO-Tab-Dragger
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Customize the order and names of your AAO-Tabs
// @author       Jan (KBOE2)
// @include      *://www.leitstellenspiel.de/missions/*
// @include      *://www.leitstellenspiel.de/aaos*
// @include      *://www.missionchief.com/missions/*
// @include      *://www.missionchief.com/aaos*
// @include      *://www.meldkamerspel.com/missions/*
// @include      *://www.meldkamerspel.com/aaos*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	const storageName="AAO-Drager";if(localStorage[storageName]||(localStorage[storageName]=JSON.stringify({taborder:[],tabnames:{}})),localStorage[storageName]&&JSON.parse(localStorage[storageName]).taborder){let tabs=[];$.each(JSON.parse(localStorage[storageName]).taborder,function(){tabs[tabs.length]=$('#aao-tabs li a[href="'+this+'"]').parent(),$('#aao-tabs li a[href="'+this+'"]').parent().remove()}),$.each(tabs,function(){$("#aao-tabs").append($(this))})}localStorage[storageName]&&JSON.parse(localStorage[storageName]).tabnames&&$.each(JSON.parse(localStorage[storageName]).tabnames,function(a,e){$('#aao-tabs a[href="'+a+'"').text(e)}),document.URL.match(/aaos/)&&($("head").append('<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"><\/script>'),$("#aao-tabs li").each(function(){$(this).prepend('<i class="pullAAO glyphicon glyphicon-resize-horizontal"></i>&nbsp;'),$(this).find("a").html("<span>"+$(this).find("a").html()+"</span>"),$(this).find("a").append('&nbsp;<a class="btn btn-default btn-xs renameAAOTab"><span title="Bearbeiten" class="glyphicon glyphicon-pencil"></span></a>')}),$(".pullAAO").css("cursor","e-resize"),$("#aao-tabs").sortable({handle:".pullAAO"}),$("#aao-tabs").before('<a class="btn btn-xs btn-primary" id="saveAAOOrder">AAO-Tab Reihenfolge speichern</a>'),$("#saveAAOOrder").click(function(){let a=[];$("#aao-tabs li").each(function(){a[a.length]=$(this).find("a").attr("href")});let e=JSON.parse(localStorage[storageName]).tabnames||{};localStorage[storageName]=JSON.stringify({taborder:a,tabnames:e})}),$(".renameAAOTab").click(function(){$(this).toggle();let a='<span id="'+$(this).parent().attr("href")+'"><input placeholder="'+$(this).parent().text()+'"><span class="label label-danger abortName"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span><span class="label label-success approveName"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></span></span>';$(this).parent().before(a),$(".abortName").css("cursor","pointer"),$(".approveName").css("cursor","pointer"),$(".abortName").click(function(){$(this).parent().remove()}),$(".approveName").click(function(){let a=JSON.parse(localStorage[storageName]).tabnames||{},e=JSON.parse(localStorage[storageName]).taborder||[];a[$(this).parent().attr("id")]=$(this).parent().find("input").val().trim()||$(this).parent().find("input").attr("placeholder").trim(),localStorage[storageName]=JSON.stringify({taborder:e,tabnames:a}),$($(this).parent().parent().find("a span")[0]).html(a[$(this).parent().attr("id")]),$(this).parent().parent().find("a a").toggle(),$(this).parent().remove()})}));
})();
