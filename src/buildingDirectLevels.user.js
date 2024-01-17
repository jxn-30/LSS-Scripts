// ==UserScript==
// @name            [LSS] Direct levels for buildings
// @name:de         [LSS] Gebäude-Direktausbau
// @namespace       https://jxn.lss-manager.de
// @version         2024.01.17+1128
// @author          Jan (jxn_30)
// @description     update buildings to a certain level without opening the "Expand" menu
// @description:de  Gebäude auf eine Stufe direkt ausbauen, ohne erst das Ausbauen-Menü zu öffnen
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/buildingDirectLevels.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/buildingDirectLevels.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/23881-sktiptwunsch-ausbaustufen-in-der-geb%C3%A4ude%C3%BCbersicht/
// @match           https://www.operacni-stredisko.cz/buildings/*
// @match           https://policie.operacni-stredisko.cz/buildings/*
// @match           https://www.alarmcentral-spil.dk/buildings/*
// @match           https://politi.alarmcentral-spil.dk/buildings/*
// @match           https://www.leitstellenspiel.de/buildings/*
// @match           https://polizei.leitstellenspiel.de/buildings/*
// @match           https://www.missionchief-australia.com/buildings/*
// @match           https://police.missionchief-australia.com/buildings/*
// @match           https://www.missionchief.co.uk/buildings/*
// @match           https://police.missionchief.co.uk/buildings/*
// @match           https://www.missionchief.com/buildings/*
// @match           https://police.missionchief.com/buildings/*
// @match           https://www.centro-de-mando.es/buildings/*
// @match           https://www.centro-de-mando.mx/buildings/*
// @match           https://www.hatakeskuspeli.com/buildings/*
// @match           https://poliisi.hatakeskuspeli.com/buildings/*
// @match           https://www.operateur112.fr/buildings/*
// @match           https://police.operateur112.fr/buildings/*
// @match           https://www.operatore112.it/buildings/*
// @match           https://polizia.operatore112.it/buildings/*
// @match           https://www.missionchief-japan.com/buildings/*
// @match           https://www.missionchief-korea.com/buildings/*
// @match           https://www.nodsentralspillet.com/buildings/*
// @match           https://politiet.nodsentralspillet.com/buildings/*
// @match           https://www.meldkamerspel.com/buildings/*
// @match           https://politie.meldkamerspel.com/buildings/*
// @match           https://www.operatorratunkowy.pl/buildings/*
// @match           https://policja.operatorratunkowy.pl/buildings/*
// @match           https://www.operador193.com/buildings/*
// @match           https://www.jogo-operador112.com/buildings/*
// @match           https://policia.jogo-operador112.com/buildings/*
// @match           https://www.jocdispecerat112.com/buildings/*
// @match           https://www.dispetcher112.ru/buildings/*
// @match           https://www.dispecerske-centrum.com/buildings/*
// @match           https://www.larmcentralen-spelet.se/buildings/*
// @match           https://polis.larmcentralen-spelet.se/buildings/*
// @match           https://www.112-merkez.com/buildings/*
// @match           https://www.dyspetcher101-game.com/buildings/*
// @run-at          document-idle
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @name Direct levels for buildings
 * @name:de Gebäude-Direktausbau
 * @description update buildings to a certain level without opening the "Expand" menu
 * @description:de Gebäude auf eine Stufe direkt ausbauen, ohne erst das Ausbauen-Menü zu öffnen
 * @forum https://forum.leitstellenspiel.de/index.php?thread/23881-sktiptwunsch-ausbaustufen-in-der-geb%C3%A4ude%C3%BCbersicht/
 * @match /buildings/*
 * @grant unsafeWindow
 */

const expandBtn = document.querySelector(
    'a[href^="/buildings/"][href$="/expand"]'
);

if (expandBtn && unsafeWindow.location.pathname.split('/').length === 3) {
    const expandBar = document.createElement('div');
    expandBar.classList.add('btn-group');

    const expandBtnCredits = document.createElement('a');
    expandBtnCredits.classList.add(
        'btn',
        'btn-success',
        'btn-xs',
        'disable_after_click'
    );
    expandBtnCredits.textContent = 'Credits';

    const expandBtnCoins = document.createElement('a');
    expandBtnCoins.classList.add(
        'btn',
        'btn-success',
        'btn-xs',
        'disable_after_click'
    );
    expandBtnCoins.textContent = 'Coins';

    const [, , buildingId] = unsafeWindow.location.pathname.split('/');

    Promise.all([
        fetch(`/api/buildings/${buildingId}`).then(r => r.json()),
        fetch(
            `https://api.lss-manager.de/${unsafeWindow.I18n.locale}/buildings`
        ).then(r => r.json()),
        fetch(
            `https://api.lss-manager.de/${unsafeWindow.I18n.locale}/small_buildings`
        ).then(r => r.json()),
    ]).then(([building, buildingTypes, smallBuildings]) => {
        const currentLevel = building.level;
        const { maxLevel, levelPrices } =
            buildingTypes[
                building.small_building ?
                    smallBuildings[building.building_type]
                :   building.building_type
            ];

        if (currentLevel >= maxLevel) return;

        let currentSelectedBtn;

        const levels = Array(maxLevel)
            .fill(0)
            .map((_, i) => i + 1)
            .slice(currentLevel);

        const updatePrices = () => {
            if (!currentSelectedBtn) return;
            const selectedLevel = parseInt(currentSelectedBtn.dataset.level);
            const credits = levelPrices.credits
                .slice(currentLevel, selectedLevel)
                .reduce((a, b) => a + b, 0);
            const coins = levelPrices.coins
                .slice(currentLevel, selectedLevel)
                .reduce((a, b) => a + b, 0);

            expandBtnCredits.textContent = `Credits: ${credits.toLocaleString()}`;
            expandBtnCredits.href = `/buildings/${buildingId}/expand_do/credits?level=${
                selectedLevel - 1
            }`;
            expandBtnCoins.textContent = `Coins: ${coins.toLocaleString()}`;
            expandBtnCoins.href = `/buildings/${buildingId}/expand_do/coins?level=${
                selectedLevel - 1
            }`;
            expandBtnCoins.dataset.confirm = `Möchtest du wirklich ${coins.toLocaleString()} Coins ausgeben, um dieses Gebäude auf Stufe ${selectedLevel} auszubauen?`;
        };

        expandBar.append(
            ...levels.map(level => {
                const btn = document.createElement('a');
                btn.classList.add('btn', 'btn-default', 'btn-xs');
                if (level === currentLevel + 1) {
                    btn.classList.replace('btn-default', 'btn-success');
                    currentSelectedBtn = btn;
                }
                btn.href = '#';
                btn.dataset.level = level;
                btn.textContent = level;
                return btn;
            })
        );

        updatePrices();

        expandBar.addEventListener('click', e => {
            const { target } = e;
            if (!(target instanceof HTMLElement)) return;

            const btn = target.closest('a');
            if (!btn) return;

            currentSelectedBtn.classList.replace('btn-success', 'btn-default');
            currentSelectedBtn = btn;
            currentSelectedBtn.classList.replace('btn-default', 'btn-success');

            updatePrices();
        });

        expandBtn.after(
            document.createElement('br'),
            expandBar,
            document.createElement('br'),
            expandBtnCredits,
            ' ',
            expandBtnCoins
        );
    });
}
