fetch('/einsaetze.json')
    .then(res => res.json())
    .then(missions => {
        const manVPatients = [];
        missions.forEach(mission => {
            let patients = mission.additional.possible_patient ?? 0;
            if (patients >= 5) {
                manVPatients.push(mission.id);
            }
        });
        console.log(manVPatients);
    });
