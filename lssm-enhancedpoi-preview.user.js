// ==UserScript==
// @name         LSSM-EnhancedPOI-Preview
// @version      1.0.1
// @description  Colorizes same POI
// @author       Jan (jxn_30)
// @include      /^https?:\/\/(?:w{3}\.)?(?:operacni-stredisko\.cz|alarmcentral-spil\.dk|leitstellenspiel\.de|missionchief\.gr|(?:missionchief-australia|missionchief|hatakeskuspeli|missionchief-japan|missionchief-korea|nodsentralspillet|meldkamerspel|operador193|jogo-operador112|jocdispecerat112|dispecerske-centrum|112-merkez|dyspetcher101-game)\.com|missionchief\.co\.uk|centro-de-mando\.es|centro-de-mando\.mx|operateur112\.fr|operatore112\.it|operatorratunkowy\.pl|dispetcher112\.ru|larmcentralen-spelet\.se)\/?$/
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
    document.head.insertAdjacentHTML('beforeend', `<style>.poi.${poiHighlightedClass} {filter: contrast(500%) brightness(60%) invert(100%);}</style>`);

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

            Array.from(document.querySelectorAll(
                `.lefalet-marker-icon[caption="${
                    document.querySelector(
                        '#mission_position_poi_type option:checked'
                    ).textContent
                }"]`
            )).forEach(
                el =>
                    (el.style.filter = poiHighlightStyle)
            );
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
