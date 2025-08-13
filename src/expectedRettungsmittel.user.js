// ==UserScript==
// @name            [LSS] Expected Patient resources
// @name:de         [LSS] Erwartete Rettungsmittel
// @namespace       https://jxn.lss-manager.de
// @version         2025.08.13+1552
// @author          Jan (jxn_30)
// @description     Calculates what resources for patients are expected to be required.
// @description:de  Berechnet, wie viele Rettungsmittel für die Patienten vermutlich benötigt werden.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/expectedRettungsmittel.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/expectedRettungsmittel.user.js
// @supportURL      https://github.com/jxn-30/LSS-Scripts
// @match           https://www.operacni-stredisko.cz/missions/*
// @match           https://policie.operacni-stredisko.cz/missions/*
// @match           https://www.alarmcentral-spil.dk/missions/*
// @match           https://politi.alarmcentral-spil.dk/missions/*
// @match           https://www.leitstellenspiel.de/missions/*
// @match           https://polizei.leitstellenspiel.de/missions/*
// @match           https://www.missionchief-australia.com/missions/*
// @match           https://police.missionchief-australia.com/missions/*
// @match           https://www.missionchief.co.uk/missions/*
// @match           https://police.missionchief.co.uk/missions/*
// @match           https://www.missionchief.com/missions/*
// @match           https://police.missionchief.com/missions/*
// @match           https://www.centro-de-mando.es/missions/*
// @match           https://www.centro-de-mando.mx/missions/*
// @match           https://www.hatakeskuspeli.com/missions/*
// @match           https://poliisi.hatakeskuspeli.com/missions/*
// @match           https://www.operateur112.fr/missions/*
// @match           https://police.operateur112.fr/missions/*
// @match           https://www.operatore112.it/missions/*
// @match           https://polizia.operatore112.it/missions/*
// @match           https://www.missionchief-japan.com/missions/*
// @match           https://www.missionchief-korea.com/missions/*
// @match           https://www.nodsentralspillet.com/missions/*
// @match           https://politiet.nodsentralspillet.com/missions/*
// @match           https://www.meldkamerspel.com/missions/*
// @match           https://politie.meldkamerspel.com/missions/*
// @match           https://www.operatorratunkowy.pl/missions/*
// @match           https://policja.operatorratunkowy.pl/missions/*
// @match           https://www.operador193.com/missions/*
// @match           https://www.jogo-operador112.com/missions/*
// @match           https://policia.jogo-operador112.com/missions/*
// @match           https://www.jocdispecerat112.com/missions/*
// @match           https://www.dispetcher112.ru/missions/*
// @match           https://www.dispecerske-centrum.com/missions/*
// @match           https://www.larmcentralen-spelet.se/missions/*
// @match           https://polis.larmcentralen-spelet.se/missions/*
// @match           https://www.112-merkez.com/missions/*
// @match           https://www.dyspetcher101-game.com/missions/*
// @require         https://raw.githubusercontent.com/LUFSI/framework/refs/heads/main/src/sharedAPIStorage.js
// @run-at          document-idle
// ==/UserScript==

/**
 * @name Expected Patient resources
 * @name:de Erwartete Rettungsmittel
 * @description Calculates what resources for patients are expected to be required.
 * @description:de Berechnet, wie viele Rettungsmittel für die Patienten vermutlich benötigt werden.
 * @match /missions/*
 * @lufsi SharedAPIStorage
 */

const CONFIDENCE = 95; // Mit 95 % Wahrscheinlichkeit reichen die berechneten Rettungsmittel aus.

// Ab hier bitte nichts mehr ändern :)
/* global sharedAPIStorage */

// This is semantically copied from https://stackoverflow.com/a/69510308
const invErrFn = x => {
    const a = 0.147;
    const b = 2 / (Math.PI * a) + Math.log(1 - x ** 2) / 2;
    const sqrt1 = Math.sqrt(b ** 2 - Math.log(1 - x ** 2) / a);
    const sqrt2 = Math.sqrt(sqrt1 - b);
    return sqrt2 * Math.sign(x);
};

// this calculates the z-score for our confidence percentile via the quantile function described in https://en.wikipedia.org/wiki/Normal_distribution#Quantile_function
const Z_SCORE = Math.sqrt(2) * invErrFn(2 * (CONFIDENCE / 100) - 1);

const estimateNeed = (patients, ...probabilities) => {
    const probability = probabilities
        .map(p => p / 100)
        .reduce((a, b) => a * b, 1);
    const mean = patients * probability;
    const standardDeviation = Math.sqrt(
        patients * probability * (1 - probability)
    );

    // We want to round up (to be sure), also results cannot be less than 0 and not larger than the amount of patients.
    return Math.max(0, Math.min(patients, Math.ceil(mean + Z_SCORE * standardDeviation)));
};

const getMissionType = () => {
    const missionHelpBtn = document.getElementById('mission_help');
    if (!missionHelpBtn) {
        return '-1';
    }
    let missionType = new URL(
        missionHelpBtn.getAttribute('href') ?? '',
        window.location.origin
    ).pathname.split('/')[2];
    const overlayIndex =
        document
            .getElementById('mission_general_info')
            ?.getAttribute('data-overlay-index') ?? 'null';
    if (overlayIndex && overlayIndex !== 'null') {
        missionType += `-${overlayIndex}`;
    }
    const additionalOverlay =
        document
            .getElementById('mission_general_info')
            ?.getAttribute('data-additive-overlays') ?? 'null';
    if (additionalOverlay && additionalOverlay !== 'null') {
        missionType += `/${additionalOverlay}`;
    }
    return missionType;
};

sharedAPIStorage.getMissionTypes(getMissionType()).then(specs => {
    const patients = document.querySelectorAll('.mission_patient').length;

    if (patients === 0) return;

    const transport_chance = specs.chances?.patient_transport ?? 30; // 30% default transport chance according to Dennis (msg ID Bg3C8WLTvttsu8hye)
    const notarzt_chance = specs.chances?.nef ?? 0;
    const rth_chance = specs.chances?.helicopter ?? 0;

    const transport_expected = estimateNeed(patients, transport_chance);
    const notarzt_expected = estimateNeed(
        patients,
        transport_chance,
        notarzt_chance
    );
    const rth_expected = estimateNeed(
        patients,
        transport_chance,
        notarzt_chance,
        rth_chance
    );

    const patientTextEl = document.getElementById('patient_button_text');
    if (!patientTextEl) return;
    patientTextEl.textContent += ` | Erwartung: RTW: ${transport_expected} – NEF: ${notarzt_expected} – RTH: ${rth_expected}`;
    patientTextEl.title = `Für die ${patients}\xa0Patienten reichen mit einer Wahrscheinlichkeit von ${CONFIDENCE}\xa0% aus: ${transport_expected}\xa0Transportmittel, ${notarzt_expected}\xa0Notärzte und ${rth_expected}\xa0RTHs`;
});
