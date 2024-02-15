// ==UserScript==
// @name            [LSS] AAO Config Lite (DE)
// @namespace       https://jxn.lss-manager.de
// @version         2024.01.30+1857
// @author          JuMaHo & Jan (jxn_30)
// @description     This Script is for leitstellenspiel.de only!
// @description:de  Blendet Eingabefelder in der AAO-Konfiguration nach Bedarf ein oder aus.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/aaoConfigLite.de.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/aaoConfigLite.de.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/14751-aao-config-lite/
// @match           https://www.leitstellenspiel.de/aaos/new
// @match           https://www.leitstellenspiel.de/aaos/*/edit
// @match           https://polizei.leitstellenspiel.de/aaos/new
// @match           https://polizei.leitstellenspiel.de/aaos/*/edit
// @run-at          document-idle
// ==/UserScript==

/**
 * @name  AAO Config Lite (DE)
 * @description This Script is for leitstellenspiel.de only!
 * @description:de Blendet Eingabefelder in der AAO-Konfiguration nach Bedarf ein oder aus.
 * @author JuMaHo
 * @author Jan (jxn_30)
 * @forum https://forum.leitstellenspiel.de/index.php?thread/14751-aao-config-lite/
 * @locale de_DE
 * @match /aaos/new
 * @match /aaos/*\/edit
 */

// This is a working fork of https://github.com/JuMaH0/lss/blob/master/aaolite.user.js

(function () {
    // 0 = Fahrzeuge werden in der Liste ausgeblendet 1 = Fahrzeuge werden eingeblendet
    const aaos = {
        // Feuerwehr
        'fire': 1, // Löschfahrzeuge oder Tanklöschfahrzeuge
        'lf_only': 1, // Löschfahrzeuge
        'tlf_only': 1, // Tanklöschfahrzeuge
        'wasser_amount': 1, // Liter Wasser
        'wasser_amount_tlf': 1, // Liter Wasser - Nur TLF
        'water_amount_water_carrier': 1, // Liter Wasser - Nur Großtankfahrzeuge
        'water_amount_tlf_water_carrier': 1, // Liter Wasser - Nur TLF oder Großtankfahrzeuge
        'water_damage_pump_value': 1, // Pumpenleistung
        'water_damage_pump_value_only_pumps': 1, // Pumpenleistung - Nur Schmutzwasserpumpen
        'elw': 1, // Einsatzleitfahrzeuge 1
        'elw2': 1, // Einsatzleitfahrzeuge 2
        'elw1_or_elw2': 1, // ELW 1, ELW 2 oder AB-Einsatzleitung
        'ab_einsatzleitung_only': 1, // AB-Einsatzleitung
        'elw2_or_ab_elw': 1, // ELW 2 oder AB-Einsatzleitung
        'elw1_or_elw_drone': 1, // ELW1 oder ELW Drohne
        'elw2_or_elw2_drone': 1, // ELW2 oder ELW2 Drohne
        'dlk': 1, // Drehleitern
        'dlk_or_tm50': 1, // DLK oder TM 50
        'hlf_only': 1, // HLF
        'hlf_or_rw_and_lf': 1, // HLF oder RW und LF
        'rw': 1, // Rüstwagen oder HLF
        'rw_only': 1, // Rüstwagen
        'ab_ruest': 1, // AB Rüst
        'ab_ruest_rw': 1, // AB Rüst oder Rüstwagen oder HLF
        'gwa': 1, // GW-A oder AB-Atemschutz
        'ab_atemschutz_only': 1, // AB-Atemschutz
        'gw_atemschutz_only': 1, // GW-A
        'gwoel': 1, // GW-Öl oder AB-Öl
        'ab_oel_only': 1, // AB-Öl
        'gw_oel_only': 1, // GW-Öl
        'gwl2wasser': 1, // Schlauchwagen oder AB-Schlauch
        'gwl2wasser_only': 1, // Nur Schlauchwagen
        'abl2wasser_only': 1, // AB-Schlauch
        'gwl2wasser_all': 1, // Alle Schlauchfahrzeuge
        'gwmesstechnik': 1, // GW-Messtechnik
        'gwgefahrgut': 1, // GW-Gefahrgut oder AB-Gefahrgut
        'gw_gefahrgut_only': 1, // GW-Gefahrgut
        'ab_gefahrgut_only': 1, // AB-Gefahrgut
        'gwhoehenrettung': 1, // GW-Höhenrettung
        'dekon_p': 1, // Dekon-P oder AB-Dekon-P
        'only_dekon_p': 1, // Dekon-P
        'only_ab_dekon_p': 1, // AB-Dekon-P
        'mtw': 1, // MTW
        'fwk': 1, // Feuerwehrkran
        'arff': 1, // Flugfeldlöschfahrzeug
        'rettungstreppe': 1, // Rettungstreppe
        'turboloescher': 1, // Turbolöscher
        'tm50': 1, // TM 50
        'ulf': 1, // ULF mit Löscharm
        'gw_werkfeuerwehr': 1, // GW-Werkfeuerwehr
        'ventilation': 1, // Lüfter
        'vehicle_type_ids[104]': 1, // GW-L1
        'vehicle_type_ids[105]': 1, // GW-L2
        'vehicle_type_ids[106]': 1, // MTF-L
        'water_carrier': 1, // Beliebiges Großtankfahrzeug
        'vehicle_type_ids[118]': 1, // Kleintankwagen
        'vehicle_type_ids[120]': 1, // Tankwagen
        'vehicle_type_ids[121]': 1, // GTLF
        'vehicle_type_ids[117]': 1, // AB-Tank
        'vehicle_type_ids[119]': 1, // AB-Lösch
        'vehicle_type_ids[126]': 1, // MTF Drohne
        'vehicle_type_ids[128]': 1, // ELW Drohne
        'vehicle_type_ids[129]': 1, // ELW2 Drohne

        // Rettungsdienst
        'rtw': 1, // Rettungswagen
        'ktw': 1, // Krankentransportwagen
        'ktw_or_rtw': 1, // KTW oder RTW
        'ktw_or_rtw_2': 1, // KTW oder RTW oder ITW
        'nef': 1, // Notarzteinsatzfahrzeug oder Rettungshubschrauber
        'rth_only': 1, // Rettungshubschrauber
        'nef_only': 1, // Notarzteinsatzfahrzeug
        'vehicle_type_ids[74]': 1, // NAW
        'vehicle_type_ids[97]': 1, // ITW
        'naw': 1, // NAW oder ITW
        'naw_or_rtw_and_nef': 1, // NAW oder ITW oder NEF+RTW
        'naw_or_rtw_and_nef_or_rth': 1, // NAW oder ITW oder NEF/RTH+RTW
        'kdow_lna': 1, // KdoW-LNA
        'kdow_orgl': 1, // KdoW-OrgL
        'grtw': 1, // GRTW
        'grtw0': 1, // GRTW (7 Patienten - ohne Notarzt)
        'grtw1': 1, // GRTW (3 Patienten - inkl. Notarzt)

        // Polizei
        'fustw': 1, // Funkstreifenwagen
        'lebefkw': 1, // Leichter Befehlskraftwagen (leBefKw)
        'fukw': 1, // FüKw (Führungskraftwagen)
        'grukw': 1, // GruKw (Gruppenkraftwagen)
        'gefkw': 1, // GefKw (Gefangenenkraftwagen)
        'polizeihubschrauber': 1, // Polizeihubschrauber
        'wasserwerfer': 1, // Wasserwerfer
        'sek_zf': 1, // SEK - ZF
        'sek_mtf': 1, // SEK - MTF
        'mek_zf': 1, // MEK - ZF
        'mek_mtf': 1, // MEK - MTF
        'k9': 1, // Diensthundeführerkraftwagen
        'police_motorcycle': 1, // Polizeimotorrad
        'fustw_or_police_motorcycle': 1, // Funkstreifenwagen oder Polizeimotorrad
        'helicopter_bucket': 1, // Außenlastbehälter (allgemein)
        'vehicle_type_ids[98]': 1, // Zivilstreifenwagen
        'vehicle_type_ids[103]': 1, // FuStW (DGL)
        'police_car_or_service_group_leader': 1, // FuStW oder FuStW (DGL)
        'fustkw_or_civil_patrolcar': 1, // FuStW oder Zivilstreifenwagen
        'police_horse_count': 1, // Polizeipferde
        'vehicle_type_ids[134]': 1, // Pferdetransporter klein
        'vehicle_type_ids[135]': 1, // Pferdetransporter groß
        'vehicle_type_ids[136]': 1, // Anh Pferdetransport
        'vehicle_type_ids[137]': 1, // Zugfahrzeug Pferdetransport

        // THW
        'gkw': 1, // Gerätekraftwagen (GKW)
        'thw_mtw': 1, // Mannschaftstransportwagen Technischer Zug (MTW-TZ - THW)
        'thw_mzkw': 1, // Mehrzweck-Gerätewagen (FGr N)
        'vehicle_type_ids[124]': 1, // MTW-OV
        'thw_lkw': 1, // Lastkraftwagen-Kipper 9 t (LKW K 9)
        'thw_brmg_r': 1, // Radlader groß (BRmG R)
        'thw_dle': 1, // Anhänger Drucklufterzeugung (Anh DLE)
        'vehicle_type_ids[100]': 1, // MLW 4
        'thw_mlw5': 1, // Mannschaftslastwagen Typ V (MLW 5)
        'thw_tauchkraftwagen': 1, // Tauchkraftwagen
        'thw_tauchkraftwagen_or_gw_taucher': 1, // Tauchkraftwagen oder GW-Taucher
        'thw_anh_mzab': 1, // Anh MzAB
        'thw_anh_schlb': 1, // Anh SchlB
        'thw_anh_mzb': 1, // Anh MzB
        'thw_lkw_7_lkr_19_tm': 1, // LKW 7 Lkr 19 tm
        'rescue_dogs_thw': 1, // Anhänger Hundetransport
        'pump': 1, // Schmutzwasserpumpen
        'water_damage_pump': 1, // Feuerlöschpumpen
        'vehicle_type_ids[123]': 1, // LKW 7 Lbw (FGr WP)
        'vehicle_type_ids[101]': 1, // Anh SwPu
        'vehicle_type_ids[102]': 1, // Anh 7
        'vehicle_type_ids[109]': 1, // MzGW SB
        'vehicle_type_ids[122]': 1, // LKW 7 Lbw (FGr E)
        'energy_supply': 1, // NEA50
        'energy_supply_2': 1, // NEA200
        'drone': 1, // Beliebige Drohneneinheit
        'vehicle_type_ids[125]': 1, // MTW-Tr UL

        // SEG
        'ktw_b': 1, // KTW Typ B
        'seg_elw': 1, // ELW 1 (SEG)
        'gw_san': 1, // GW-San
        'rescue_dogs_seg': 1, // Rettungshundefahrzeug
        'vehicle_type_ids[127]': 1, // GW UAS
        'vehicle_type_ids[131]': 1, // Bt-Kombi
        'care_service_equipment': 1, // Betreuungs- und Verpflegungsausstattung
        'vehicle_type_ids[130]': 1, // GW-Bt
        'vehicle_type_ids[133]': 1, // Bt LKW
        'vehicle_type_ids[132]': 1, // FKH

        // Wasserrettung
        'gw_taucher': 1, // GW-Taucher
        'gw_wasserrettung': 1, // GW-Wasserrettung
        'boot': 1, // Boote (Allgemein)
        'mzb': 1, // Mehrzweckboot

        // Rettungshundestaffel
        'rescue_dogs': 1, // Anhänger Hundetransport oder Rettungshundefahrzeug
    };
    Object.entries(aaos).forEach(
        ([key, show]) =>
            !show &&
            document
                .querySelectorAll(`[for="aao_${key}"]`)
                .forEach(el =>
                    el.parentElement.parentElement.classList.add('hidden')
                )
    );
})();

// Code to generate the list:
/*
Array.from(document.querySelectorAll('#tabs > li > a'))
    .map(tab =>
        [
            `// ${tab.textContent.trim()}`,
            ...Array.from(
                document.querySelectorAll(`${new URL(tab.href).hash} label`)
            ).map(
                label =>
                    `'${label
                        .getAttribute('for')
                        .replace(
                            /^aao_/,
                            ''
                        )}': 1, // ${label.textContent.trim()}`
            ),
        ].join('\n')
    )
    .join('\n\n');
*/
