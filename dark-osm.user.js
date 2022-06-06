// ==UserScript==
// @name        LSS Dark OSM
// @version     1.0.1
// @description Sets a dark OSM Map
// @author      Jan (jxn_30)
// @namespace   https://jxn.lss-manager.de/
// @match       https://www.operacni-stredisko.cz/*
// @match       https://policie.operacni-stredisko.cz/*
// @match       https://www.alarmcentral-spil.dk/*
// @match       https://politi.alarmcentral-spil.dk/*
// @match       https://www.leitstellenspiel.de/*
// @match       https://polizei.leitstellenspiel.de/*
// @match       https://www.missionchief-australia.com/*
// @match       https://police.missionchief-australia.com/*
// @match       https://www.missionchief.co.uk/*
// @match       https://police.missionchief.co.uk/*
// @match       https://www.missionchief.com/*
// @match       https://police.missionchief.com/*
// @match       https://www.centro-de-mando.es/*
// @match       https://www.centro-de-mando.mx/*
// @match       https://www.hatakeskuspeli.com/*
// @match       https://poliisi.hatakeskuspeli.com/*
// @match       https://www.operateur112.fr/*
// @match       https://police.operateur112.fr/*
// @match       https://www.operatore112.it/*
// @match       https://polizia.operatore112.it/*
// @match       https://www.missionchief-japan.com/*
// @match       https://www.missionchief-korea.com/*
// @match       https://www.nodsentralspillet.com/*
// @match       https://politiet.nodsentralspillet.com/*
// @match       https://www.meldkamerspel.com/*
// @match       https://politie.meldkamerspel.com/*
// @match       https://www.operatorratunkowy.pl/*
// @match       https://policja.operatorratunkowy.pl/*
// @match       https://www.operador193.com/*
// @match       https://www.jogo-operador112.com/*
// @match       https://policia.jogo-operador112.com/*
// @match       https://www.jocdispecerat112.com/*
// @match       https://www.dispetcher112.ru/*
// @match       https://www.dispecerske-centrum.com/*
// @match       https://www.larmcentralen-spelet.se/*
// @match       https://polis.larmcentralen-spelet.se/*
// @match       https://www.112-merkez.com/*
// @match       https://www.dyspetcher101-game.com/*
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle('.leaflet-tile-pane{filter: brightness(60%) invert(100%) contrast(300%) hue-rotate(200deg) saturate(30%) brightness(50%) contrast(125%) saturate(500%);}');
