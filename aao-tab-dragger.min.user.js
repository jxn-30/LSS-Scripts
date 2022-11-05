// ==UserScript==
// @name         AAO-Tab-Dragger
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Customize the order and names of your AAO-Tabs
// @author       Jan (jxn_30)
// @match        https://www.operacni-stredisko.cz/missions/*
// @match        https://www.operacni-stredisko.cz/aaos*
// @match        https://policie.operacni-stredisko.cz/missions/*
// @match        https://policie.operacni-stredisko.cz/aaos*
// @match        https://www.alarmcentral-spil.dk/missions/*
// @match        https://www.alarmcentral-spil.dk/aaos*
// @match        https://politi.alarmcentral-spil.dk/missions/*
// @match        https://politi.alarmcentral-spil.dk/aaos*
// @match        https://www.leitstellenspiel.de/missions/*
// @match        https://www.leitstellenspiel.de/aaos*
// @match        https://polizei.leitstellenspiel.de/missions/*
// @match        https://polizei.leitstellenspiel.de/aaos*
// @match        https://www.missionchief-australia.com/missions/*
// @match        https://www.missionchief-australia.com/aaos*
// @match        https://police.missionchief-australia.com/missions/*
// @match        https://police.missionchief-australia.com/aaos*
// @match        https://www.missionchief.co.uk/missions/*
// @match        https://www.missionchief.co.uk/aaos*
// @match        https://police.missionchief.co.uk/missions/*
// @match        https://police.missionchief.co.uk/aaos*
// @match        https://www.missionchief.com/missions/*
// @match        https://www.missionchief.com/aaos*
// @match        https://police.missionchief.com/missions/*
// @match        https://police.missionchief.com/aaos*
// @match        https://www.centro-de-mando.es/missions/*
// @match        https://www.centro-de-mando.es/aaos*
// @match        https://www.centro-de-mando.mx/missions/*
// @match        https://www.centro-de-mando.mx/aaos*
// @match        https://www.hatakeskuspeli.com/missions/*
// @match        https://www.hatakeskuspeli.com/aaos*
// @match        https://poliisi.hatakeskuspeli.com/missions/*
// @match        https://poliisi.hatakeskuspeli.com/aaos*
// @match        https://www.operateur112.fr/missions/*
// @match        https://www.operateur112.fr/aaos*
// @match        https://police.operateur112.fr/missions/*
// @match        https://police.operateur112.fr/aaos*
// @match        https://www.operatore112.it/missions/*
// @match        https://www.operatore112.it/aaos*
// @match        https://polizia.operatore112.it/missions/*
// @match        https://polizia.operatore112.it/aaos*
// @match        https://www.missionchief-japan.com/missions/*
// @match        https://www.missionchief-japan.com/aaos*
// @match        https://www.missionchief-korea.com/missions/*
// @match        https://www.missionchief-korea.com/aaos*
// @match        https://www.nodsentralspillet.com/missions/*
// @match        https://www.nodsentralspillet.com/aaos*
// @match        https://politiet.nodsentralspillet.com/missions/*
// @match        https://politiet.nodsentralspillet.com/aaos*
// @match        https://www.meldkamerspel.com/missions/*
// @match        https://www.meldkamerspel.com/aaos*
// @match        https://politie.meldkamerspel.com/missions/*
// @match        https://politie.meldkamerspel.com/aaos*
// @match        https://www.operatorratunkowy.pl/missions/*
// @match        https://www.operatorratunkowy.pl/aaos*
// @match        https://policja.operatorratunkowy.pl/missions/*
// @match        https://policja.operatorratunkowy.pl/aaos*
// @match        https://www.operador193.com/missions/*
// @match        https://www.operador193.com/aaos*
// @match        https://www.jogo-operador112.com/missions/*
// @match        https://www.jogo-operador112.com/aaos*
// @match        https://policia.jogo-operador112.com/missions/*
// @match        https://policia.jogo-operador112.com/aaos*
// @match        https://www.jocdispecerat112.com/missions/*
// @match        https://www.jocdispecerat112.com/aaos*
// @match        https://www.dispetcher112.ru/missions/*
// @match        https://www.dispetcher112.ru/aaos*
// @match        https://www.dispecerske-centrum.com/missions/*
// @match        https://www.dispecerske-centrum.com/aaos*
// @match        https://www.larmcentralen-spelet.se/missions/*
// @match        https://www.larmcentralen-spelet.se/aaos*
// @match        https://polis.larmcentralen-spelet.se/missions/*
// @match        https://polis.larmcentralen-spelet.se/aaos*
// @match        https://www.112-merkez.com/missions/*
// @match        https://www.112-merkez.com/aaos*
// @match        https://www.dyspetcher101-game.com/missions/*
// @match        https://www.dyspetcher101-game.com/aaos*
// @grant        none
// ==/UserScript==

(function() {
	'use strict';

	const storageName="AAO-Drager";if(localStorage[storageName]||(localStorage[storageName]=JSON.stringify({taborder:[],tabnames:{},tabcolors:{}})),!JSON.parse(localStorage[storageName]).tabcolors){let storage=JSON.parse(localStorage[storageName]);storage.tabcolors={},localStorage[storageName]=JSON.stringify(storage)}if(localStorage[storageName]&&JSON.parse(localStorage[storageName]).taborder){let tabs=[];$.each(JSON.parse(localStorage[storageName]).taborder,function(){tabs[tabs.length]=$('#aao-tabs li a[href="'+this+'"]').parent(),$('#aao-tabs li a[href="'+this+'"]').parent().remove()}),$.each(tabs,function(){$("#aao-tabs").append($(this)),$(this).css("background-color",JSON.parse(localStorage[storageName]).tabcolors[$(this).find("a").attr("href")]||"#ffffff"),document.URL.match(/aaos/)||$(this).css("padding-top","1em")})}localStorage[storageName]&&JSON.parse(localStorage[storageName]).tabnames&&$.each(JSON.parse(localStorage[storageName]).tabnames,function(a,t){$('#aao-tabs a[href="'+a+'"').text(t)}),document.URL.match(/aaos/)&&($("head").append('<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"><\/script>'),$("#aao-tabs li").each(function(){$(this).prepend('<i class="pullAAO glyphicon glyphicon-resize-horizontal"></i>&nbsp;'),$(this).find("a").html("<span>"+$(this).find("a").html()+"</span>"),$(this).find("a").append('&nbsp;<a class="btn btn-default btn-xs renameAAOTab"><span title="Bearbeiten" class="glyphicon glyphicon-pencil"></span></a>')}),$(".pullAAO").css("cursor","e-resize"),$("#aao-tabs").sortable({handle:".pullAAO"}),$("#aao-tabs").before('<a class="btn btn-xs btn-primary" id="saveAAOOrder">AAO-Tab Reihenfolge speichern</a><a class="btn btn-xs btn-info" id="exportAAO">Einstellungen exportieren</a><a class="btn btn-xs btn-success" id="importAAO">Einstellungen importieren</a><input type="file" accept=".AAODrag" style="display:none" id="importAAOInputField">'),$("#saveAAOOrder").click(function(){let a=[];$("#aao-tabs li").each(function(){a[a.length]=$(this).find("a").attr("href")});let t=JSON.parse(localStorage[storageName]).tabnames||{};localStorage[storageName]=JSON.stringify({taborder:a,tabnames:t})}),$("#exportAAO").click(function(){let a="text/json;charset=utf-8,"+encodeURIComponent(localStorage[storageName]);this.setAttribute("href","data:"+a),this.setAttribute("download","settings.AAODrag")}),$("#importAAO").click(function(){$("#importAAOInputField").click()}),$("#importAAOInputField:file").change(function(){let a=document.getElementById("importAAOInputField").files[0];if(a){let t=new FileReader;t.readAsText(a),t.onload=function(a){localStorage[storageName]=a.target.result,alert("Please reload to see result of import!")}}}),$(".renameAAOTab").click(function(){$(this).toggle();let a='<span id="'+$(this).parent().attr("href")+'"><input type="color" value="'+(JSON.parse(localStorage[storageName]).tabcolors[$(this).parent().attr("href")]||"#ffffff")+'"><br><input placeholder="'+$(this).parent().text()+'" type="text"><span class="label label-danger abortName"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span><span class="label label-success approveName"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></span></span>';$(this).parent().before(a),$(".abortName").css("cursor","pointer"),$(".approveName").css("cursor","pointer"),$(".abortName").click(function(){$(this).parent().remove()}),$(".approveName").click(function(){let a=JSON.parse(localStorage[storageName]).tabnames||{},t=JSON.parse(localStorage[storageName]).taborder||[],e=JSON.parse(localStorage[storageName]).tabcolors||{};a[$(this).parent().attr("id")]=$(this).parent().find("input[type='text']").val().trim()||$(this).parent().find("input[type='text']").attr("placeholder").trim(),e[$(this).parent().attr("id")]=$(this).parent().find("input[type='color']").val(),$(this).parent().parent().css("background-color",$(this).parent().find("input[type='color']").val()),localStorage[storageName]=JSON.stringify({taborder:t,tabnames:a,tabcolors:e}),$($(this).parent().parent().find("a span")[0]).html(a[$(this).parent().attr("id")]),$(this).parent().parent().find("a a").toggle(),$(this).parent().remove()})}));
})();
