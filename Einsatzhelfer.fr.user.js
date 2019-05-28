// ==UserScript==
// @name         Einsatzhelfer French
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Jan (KBOE2)
// @include      https://www.leitstellenspiel.de/missions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Einsatzhelfer
(($, win, I18n) => {
    if (!window.location.href.match(/missions/g)) return;

    I18n.translations.de.missionHelpFr = {
        diyMission: 'Cette mission semble être une grande mission auto-créée',
        vge: 'Grande mission',
        siwa: " Agent de sécurité ",
        missionNotDefined:'Cette mission n\'est pas encore répertoriée',
        patients:'Patients',
        transport: "Transport",
        tragehilfe: "Aide au transport",
        prisoners: 'prisonniers',
        averageMinimumEmployeesFire: " Nombre minimal moyen de pompiers requis ",
        averageMinimumEmployeesPolice: " Nombre minimum moyen d'agents de police requis ",
        to : "jusqu'à",
        water:'Demande en eau',
        vehicles : {
            lf : "Voitures de pompiers",
            dlk:'échelles à plateaux tournants',
            rw:'Monter le wagon/échafaudage AB',
            elw1:'ELW 1',
            elw2:'ELW 2',
            atem:'Protection respiratoire GW',
            oel:'GW oil',
            mess:'GW measurement technology',
            gefahr : "Marchandises dangereuses GW",
            gwl2:'Enrouleur de tuyau',
            dekon:'Dekon-P',
            fwk:'Grue de pompiers',
            hoehen:'GW Height Rescue',
            fustw:'Voiture de police',
            boot:'bateau',
            leBefKw: 'Véhicule de commandement léger',
            fukw:'voiture de fonction',
            grukw : "Véhicule à moteur du groupe",
            gefkw:'Voiture de prisonnier',
            wawe:'Canon à eau',
            nef:'NEF',
            rth:'RTH',
            Ina:'KdoW-LNA',
            orgl:'KdoW-OrgL',
            rtw:'RTW',
            ktw:'KTW ou RTW',
            lfogkworw:'LF ou GKW ou RW',
            gkw:'Equipment truck',
            mzkw : "Véhicule polyvalent",
            mtwtz:'MTW-TZ',
            radlader:'chargeuse sur pneus (BRmG R) avec camion K 9',
            anhdle:'Production d\'air comprimé sur remorque',
            polheli:'Hélicoptère de police',
            flf : "Véhicule de lutte contre les incendies d'aérodrome",
            rtf:'Véhicule d\'escalier de secours',
            taucher:'plongeur',
            mek:'Véhicules MEK',
            sek:'Véhicules SEK',
            gwwerk:'GW plant fire brigade',
            ulf:'ULF avec bras extincteur',
            tm:'Mâts télescopiques',
            turbo: 'Turbo extincteur'
        },
        pois : [
            "Park",
            "Mer",
            "Hôpital",
            "Forest",
            "Arrêt de bus",
            "Arrêt de tramway.",
            "Station (régionale)",
            "Station (régionale et longue distance)",
            "Gare de marchandises",
            "Supermarché (Petit)",
            "Supermarché.",
            "Station-service",
            "L'école",
            "Musée",
            "Centre commercial",
            "Atelier automobile.",
            "Sortie d'autoroute.",
            "Marché de Noël.",
            "Entrepôt",
            "Discothèque",
            "Stade",
            "Ferme",
            "Complexe de bureaux.",
            "Piscine",
            "Passage à niveau",
            "Théâtre",
            "Fairground",
            "River",
            "Magasin de bricolage.",
            "Aéroport (petit) : Piste",
            "Aéroport (petit) : Bâtiment",
            "Aéroport (petit) : stand d'avion",
            "Aéroport (grand) : Piste",
            "Aéroport (grand) : Terminal",
            "Aéroport (grand) : Tablier / Stands",
            "Aéroport (grand) : parking à plusieurs étages",
            "Usine de biogaz",
            "Banque",
            "Église",
            "Chemical Park.",
            "Industire General.",
            "Industrie automobile.",
            "Incinérateur de déchets.",
            "Patinoire"
        ]
    };

    let missionHelp = $('#mission_help');

    let aaoText = '';
    let markup = '<div class="alert alert-warning" id="missionHelper"><div class="handle"></div><a class="pull-right" id="pinMissionHelper"><i class="glyphicon glyphicon-pushpin"></i></a>';

    if (missionHelp.length > 0) {
        $.getJSON(`https://lssm.ledbrain.de/lss-manager-v3/dev/modules/lss-missionHelper/missions.${I18n.locale}.json`, {_: new Date().getTime()}) // simple way to "disable" cache
            .done(missions => {
                let missionId = missionHelp.attr('href').split("/").pop().replace(/\?.*/, '');
                let mission = missions[missionId];
                if (mission) {
                    aaoText += `<h3>${mission['name']}&nbsp;<sub><sub>ID: ${window.location.href.replace(/\D/g, "")}</sub>&nbsp;<sub>Type: ${missionId}</sub>&nbsp;<sub>${mission.poi ? `POI: ${I18n.t(`missionHelpFr.pois.${mission.poi}`)} <sub>[${mission.poi}]</sub>` : ""}</sub></sub></h3><br>`;
                    if (mission['onlyRd'] !== true) {
                        // not Ambulance-only Missions
                        // If VGE
                        if (mission['vge'] === true) {
                            aaoText += '<h4>' + I18n.t('missionHelpFr.vge') + '</h4>';
                        }
                        // If Sicherheitswache
                        if (mission['siwa'] === true) {
                            aaoText += '<h4>' + I18n.t('missionHelpFr.siwa') + '</h4>';
                        } else {
                            // Number of patients
                            if ($(".mission_patient").length > 0) {
                                aaoText += '<span class="badge">' + $(".mission_patient").length + (($(".mission_patient").length > 1) ? ' Patienten' : ' Patient') + '</span><br><br>';
                            }
                            // Add Wasserbedarf
                            aaoText += mission['water'] ? I18n.t('missionHelpFr.water') + ": " + mission['water'].toLocaleString() + ' Liter<br>' : "";
                            // Add vehicles
                            let vehicles = mission['vehicles'];
                            $.each(vehicles, function (key, val) {
                                aaoText += val + 'x ' + I18n.t('missionHelpFr.vehicles.' + key);
                                if (mission['percentages'] && mission['percentages'][key]) {
                                    aaoText += ' (' + mission['percentages'][key] + '%)<br>';
                                } else {
                                    aaoText += ' (100%)<br>';
                                }
                            });
                            // Add patients
                            if (mission['patients']) {
                                if (mission['patients']['min'] != mission['patients']['max']) {
                                    aaoText += '<br>' + I18n.t('missionHelpFr.patients') + ': ' + (mission['patients']['min']||0) + ' ' + I18n.t('missionHelpFr.to') + ' ' + mission['patients']['max'];
                                } else {
                                    aaoText += '<br>' + I18n.t('missionHelpFr.patients') + ': ' + mission['patients']['max'];
                                }
                                if (mission['patients']['transport'] || mission['patients']['specialisation']) {
                                    aaoText += '<br>' + I18n.t('missionHelpFr.transport') + ': ';
                                    if (mission['patients']['transport']) {
                                        aaoText += mission['patients']['transport'] + '%';
                                    }
                                    if (mission['patients']['specialisation']) {
                                        aaoText += ' (' + mission['patients']['specialisation'] + ')';
                                    }
                                }
                                if (mission['patients']['nef']) {
                                    aaoText += '<br>' + I18n.t('missionHelpFr.vehicles.nef') + ': ' + mission['patients']['nef'] + '%';
                                }
                                if (mission['patients']['rth']) {
                                    aaoText += '<br>' + I18n.t('missionHelpFr.vehicles.rth') + ': ' + mission['patients']['rth'] + '%';
                                }
                                if (mission['patients']['tragehilfe']) {
                                    aaoText += '<br>' + I18n.t('missionHelpFr.tragehilfe') + ': ' + mission['patients']['tragehilfe'] + '%';
                                }
                                if ($(".mission_patient").length >= 5) {
                                    aaoText += '<br>1x ' + I18n.t('missionHelpFr.vehicles.lna') + ' (100%)';
                                }
                                if ($(".mission_patient").length >= 10) {
                                    aaoText += '<br>1x ' + I18n.t('missionHelpFr.vehicles.orgl') + ' (100%)';
                                }
                                aaoText += '<br>';
                            }
                            // Add prisoners
                            if (mission['prisoners']) {
                                if (mission['prisoners']['min'] != mission['prisoners']['max']) {
                                    aaoText += '<br>' + I18n.t('missionHelpFr.prisoners') + ': ' + (mission['prisoners']['min']||0) + ' ' + I18n.t('missionHelpFr.to') + ' ' + mission['prisoners']['max'];
                                } else {
                                    aaoText += '<br>' + I18n.t('missionHelpFr.prisoners') + ': ' + mission['prisoners']['max'];
                                }
                            }
                            // Add minuimum needed averageMinimumEmployees
                            if (mission['special'] && mission['special']['averageMinimumEmployeesFire']) {
                                aaoText += '<br>' + I18n.t('missionHelpFr.averageMinimumEmployeesFire') + ': ' + mission['special']['averageMinimumEmployeesFire'] + '<br>';
                            }
                            if (mission['special'] && mission['special']['averageMinimumEmployeesPolice']) {
                                aaoText += '<br>' + I18n.t('missionHelpFr.averageMinimumEmployeesPolice') + ': ' + mission['special']['averageMinimumEmployeesPolice'] + '<br>';
                            }
                            // Add Credits
                            if (mission["credits"]) {
                                aaoText += '<br><span class="badge badge-secondary"> ~ ' + parseInt(mission['credits']).toLocaleString() + ' Credits</span>';
                            }
                            if (mission['expansions']) {
                                aaoText += '<br>';
                                $.each(mission['expansions'], function () {
                                    aaoText += `<a href="../einsaetze/${this}"><span class="badge">${missions[this] ? missions[this].name : this}</span></a>`;
                                });
                            }
                        }
                    } else {
                        // Ambulance-only Missions
                        if (mission['transport'] || mission['specialisation']) {
                            aaoText += '<br>' + I18n.t('missionHelpFr.transport') + ': ';
                            if (mission['transport']) {
                                aaoText += mission['transport'] + '%';
                            }
                            if (mission['specialisation']) {
                                aaoText += ' (' + mission['specialisation'] + ')';
                            }
                        }
                        if (mission['nef']) {
                            aaoText += '<br>' + I18n.t('missionHelpFr.vehicles.nef') + ': ' + mission['nef'] + '%';
                        }
                        if (mission['rth']) {
                            aaoText += '<br>' + I18n.t('missionHelpFr.vehicles.rth') + ': ' + mission['rth'] + '%';
                        }
                        if (mission['tragehilfe']) {
                            aaoText += '<br>' + I18n.t('missionHelpFr.tragehilfe') + ': ' + mission['tragehilfe'] + '%';
                        }
                        aaoText += '<br>';
                    }
                } else {
                    aaoText += `${I18n.t('missionHelpFr.missionNotDefined')}<sub>ID: ${window.location.href.replace(/\D/g, "")}</sub>&nbsp;<sub>Type: ${missionId}</sub>`;
                    if (I18n.locale === "de") $.getScript(`${lssm.config.server}/modules/lss-missionHelper/loadMissionData.js`);
                }
                $('#missionHelper').append(aaoText)
                    .css("left", $('#iframe-inside-container').width() * 0.97 - $("#missionHelper").width());

            })
            .fail((jqxhr, textStatus, error) => {
                $('#missionHelper').append(`<pre>${error}</pre>`)
                    .css("left", $('#iframe-inside-container').width() * 0.97 - $("#missionHelper").width());
            });
    } else {
        aaoText += I18n.t('missionHelpFr.diyMission');
    }
    // Set markup
    markup += `${aaoText}</div>`;

    localStorage["lssm_missionHelper_state"] === "unpin" ? unpin(markup) : pin(markup);

    $('#pinMissionHelper').css("cursor", "pointer");
})($, window, I18n);

function pin(markup) {
    $('#mission-form').prepend(markup||$('#missionHelper'));
    $('#missionHelper .handle').css("display", "none");
    $('#missionHelper').css("position", "unset");
    $('#pinMissionHelper').attr("onclick", "unpin(null)");
    localStorage["lssm_missionHelper_state"] = "pin";
}

function unpin(markup) {
    $('#iframe-inside-container').append(markup||$('#missionHelper'));
    $('#missionHelper .handle').css("width", "100%")
        .css("height", "5px")
        .css("cursor", "move")
        .css("display", "block")
        .css("background", "repeating-linear-gradient(\n" +
            "-45deg,\n" +
            "transparent,\n" +
            "transparent 10px,\n" +
            "#ccc 10px,\n" +
            "#ccc 20px\n" +
            ")");
    $('#missionHelper').draggable({
        handle: ".handle",
        containment: "#iframe-inside-container",
        scroll: true,
        stack: "#iframe-inside-container"
    })
        .css("position", "absolute")
        .css("top", "3%")
        .css("max-width", "33.3333%");
    $('#pinMissionHelper').attr("onclick", "pin(null)");
    localStorage["lssm_missionHelper_state"] = "unpin";
}

})();
