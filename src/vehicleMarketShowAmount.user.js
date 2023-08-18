// ==UserScript==
// @name            [LSS] Vehicle market: Show amount
// @name:de         [LSS] Fahrzeugmarkt: Anzahl anzeigen
// @namespace       https://jxn.lss-manager.de
// @version         2023.08.18+0758
// @author          Jan (jxn_30)
// @description     Shows in the vehicle market how many vehicles of the respective type are already available on the currently built station.
// @description:de  Zeigt im Fahrzeugmarkt wie viele Fahrzeuge auf der aktuell gebauten Wache bereits vorhanden sind vom jeweiligen Typ.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/vehicleMarketShowAmount.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/vehicleMarketShowAmount.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/21816-fahrzeuganzahl-im-markt-anzeigen
// @match           https://www.operacni-stredisko.cz/*
// @match           https://policie.operacni-stredisko.cz/*
// @match           https://www.alarmcentral-spil.dk/*
// @match           https://politi.alarmcentral-spil.dk/*
// @match           https://www.leitstellenspiel.de/*
// @match           https://polizei.leitstellenspiel.de/*
// @match           https://www.missionchief-australia.com/*
// @match           https://police.missionchief-australia.com/*
// @match           https://www.missionchief.co.uk/*
// @match           https://police.missionchief.co.uk/*
// @match           https://www.missionchief.com/*
// @match           https://police.missionchief.com/*
// @match           https://www.centro-de-mando.es/*
// @match           https://www.centro-de-mando.mx/*
// @match           https://www.hatakeskuspeli.com/*
// @match           https://poliisi.hatakeskuspeli.com/*
// @match           https://www.operateur112.fr/*
// @match           https://police.operateur112.fr/*
// @match           https://www.operatore112.it/*
// @match           https://polizia.operatore112.it/*
// @match           https://www.missionchief-japan.com/*
// @match           https://www.missionchief-korea.com/*
// @match           https://www.nodsentralspillet.com/*
// @match           https://politiet.nodsentralspillet.com/*
// @match           https://www.meldkamerspel.com/*
// @match           https://politie.meldkamerspel.com/*
// @match           https://www.operatorratunkowy.pl/*
// @match           https://policja.operatorratunkowy.pl/*
// @match           https://www.operador193.com/*
// @match           https://www.jogo-operador112.com/*
// @match           https://policia.jogo-operador112.com/*
// @match           https://www.jocdispecerat112.com/*
// @match           https://www.dispetcher112.ru/*
// @match           https://www.dispecerske-centrum.com/*
// @match           https://www.larmcentralen-spelet.se/*
// @match           https://polis.larmcentralen-spelet.se/*
// @match           https://www.112-merkez.com/*
// @match           https://www.dyspetcher101-game.com/*
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Vehicle market: Show amount
 * @name:de Fahrzeugmarkt: Anzahl anzeigen
 * @description Shows in the vehicle market how many vehicles of the respective type are already available on the currently built station.
 * @description:de Zeigt im Fahrzeugmarkt wie viele Fahrzeuge auf der aktuell gebauten Wache bereits vorhanden sind vom jeweiligen Typ.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/21816-fahrzeuganzahl-im-markt-anzeigen
 * @old vehiclemarket-show-amount
 */

const buildingId = window.location.pathname.split('/')[2];

fetch(`/api/buildings/${buildingId}/vehicles`)
    .then(res => res.json())
    .then(vehicles =>
        document
            .querySelectorAll(
                `a[href^="/buildings/${buildingId}/vehicle/${buildingId}/"][href*="/credits?building=${buildingId}"]`
            )
            .forEach(creditsBtn => {
                const vehicleType = parseInt(
                    new URL(creditsBtn.href).pathname.split('/')[5]
                );
                const amountSpan = document.createElement('span');
                amountSpan.textContent = `Haben: ${
                    vehicles.filter(
                        ({ vehicle_type }) => vehicle_type === vehicleType
                    ).length
                }`;
                amountSpan.classList.add('pull-right');
                creditsBtn.parentElement.prepend(amountSpan);
            })
    );
