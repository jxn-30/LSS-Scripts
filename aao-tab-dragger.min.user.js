// ==UserScript==
// @name         AAO-Tab-Dragger
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customize the order of your AAO-Tabs
// @author       Jan (KBOE2)
// @include      https://www.leitstellenspiel.de/missions/*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	const storageName="AAO-Drager";if(localStorage[storageName]){let tabs=[];$.each(JSON.parse(localStorage[storageName]),function(){tabs[tabs.length]=$('#aao-tabs li a[href="'+this+'"]').parent(),$('#aao-tabs li a[href="'+this+'"]').parent().remove()}),$.each(tabs,function(){$("#aao-tabs").append($(this))})}$("head").append('<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"><\/script>'),$("#aao-tabs li").each(function(){$(this).prepend('<i class="pullAAO glyphicon glyphicon-resize-horizontal"></i>&nbsp;')}),$(".pullAAO").css("cursor","e-resize"),$("#aao-tabs").sortable({handle:".pullAAO"}),$("#aao-tabs").before('<a class="btn btn-xs btn-primary" id="saveAAOOrder">AAO-Tab Reihenfolge speichern</a>'),$("#saveAAOOrder").click(function(){let a=[];$("#aao-tabs li").each(function(){a[a.length]=$(this).find("a").attr("href")}),localStorage[storageName]=JSON.stringify(a)});
})();
