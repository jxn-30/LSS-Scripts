fetch('/einsaetze.json')
    .then(res => res.json())
    .then(missions => {
        const missionsByPatientSpecialisation = {};
        missions.forEach(mission => {
            let specialisation =
                mission.additional.patient_specializations ?? '–';
            if (Array.isArray(specialisation))
                specialisation = [...new Set(specialisation)].sort().join(', ');
            if (!missionsByPatientSpecialisation.hasOwnProperty(specialisation))
                missionsByPatientSpecialisation[specialisation] = [];
            missionsByPatientSpecialisation[specialisation].push(mission.name);
        });
        console.log(
            Object.entries(missionsByPatientSpecialisation)
                .map(
                    ([specialisation, missions]) =>
                        `${specialisation}: ${missions.length}`
                )
                .join('\n')
        );
    });
