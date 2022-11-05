// ==UserScript==
// @name         LSSM-EnhancedPOI-Preview
// @version      1.0.3
// @description  Colorizes same POI
// @author       Jan (jxn_30)
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
// @run-at       document-idle
// ==/UserScript==

(async function() {
    'use strict';

    if ("undefined" !== typeof mapkit) return;

    const poiHighlightStyle = 'contrast(500%) brightness(60%) invert(100%)';
    /*
    ** 'sepia(100%) contrast(500%)'                    => braun
    ** 'sepia(100%) contrast(5000%)'                   => rot
    ** 'sepia(100%) contrast(500%) hue-rotate(100deg)' => grün
    ** 'contrast(500%) brightness(60%) invert(100%)'   => weiß
    **
    ** Lektüre: https://www.html5rocks.com/en/tutorials/filters/understanding-css/
    ** https://developer.mozilla.org/de/docs/Web/CSS/filter
    */

    const modifyMarker = (poi, caption) => {
        const el = poi.getElement();
        if (!el) return;
        poi.bindTooltip(caption);
        el.setAttribute('caption', caption);
        el.classList.add('poi');
    };

    let modifiedMarkers = false;

    const modifyMarkers = () =>
        fetch('/mission_positions')
            .then(res => res.json())
            .then(
                ({
                    mission_positions: pois,
                }) => {
                    if (pois) {
                        map_pois_service
                            .getMissionPoiMarkersArray()
                            .forEach(marker => {
                                const poi = pois.find(p => p.id === marker.id);
                                if (poi) modifyMarker(marker, poi.caption);
                            });
                        modifiedMarkers = true;
                    }
                }
            );

    await modifyMarkers();

    const leafletMissionPositionMarkerAddOrig = map_pois_service.leafletMissionPositionMarkerAdd;

    map_pois_service.leafletMissionPositionMarkerAdd = (e) => {
        leafletMissionPositionMarkerAddOrig(e);
        const poi = map_pois_service
                .getMissionPoiMarkersArray()
                .find(m => m.id === id);
            if (!poi) return;
        const el = poi.getElement();
        if (!el) return;
            poi.bindTooltip(caption);
            el.setAttribute('caption', caption);
            el.classList.add('poi');
    };

    let isPOIWindow = false;

    const poiHighlightedClass = 'poi-highlighted';
    document.head.insertAdjacentHTML('beforeend', `<style>.poi.${poiHighlightedClass} {filter: ${poiHighlightStyle};}</style>`);

    const colorMarkers = (caption) =>
        Array.from(document.querySelectorAll('.poi')).forEach(el =>
            el.classList[
                el.getAttribute('caption') === caption ? 'add' : 'remove'
            ](poiHighlightedClass)
        );

    map.addEventListener(
        'overlayadd',
        ({ name }) =>
            !modifiedMarkers && name.match(/app-pois-filter/) && modifyMarkers()
    );

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            const form = (mutation.target).querySelector(
                '#new_mission_position'
            );
            if (!form) {
                isPOIWindow = false;
                Array.from(document.querySelectorAll(
                    `.poi.${poiHighlightedClass}`
                )).forEach(el =>
                    el.classList.remove(poiHighlightedClass)
                );
                return;
            }
            if (isPOIWindow) return;
            isPOIWindow = true;

            colorMarkers(
                form.querySelector('option:checked').textContent || ''
            );
            form.querySelector(
                '#mission_position_poi_type'
            ).addEventListener('change', e =>
                colorMarkers(
                    e.target.querySelector(
                        'option:checked'
                    ).textContent || ''
                )
            );
        });
    });

    const buildingsElement = document.getElementById('buildings');
    buildingsElement && observer.observe(buildingsElement, { childList: true });

})();
