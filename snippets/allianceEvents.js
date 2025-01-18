const tables = [];
Promise.all([
    fetch('https://www.leitstellenspiel.de/alliance_event_types.json').then(
        res => res.json()
    ),
    fetch('https://www.leitstellenspiel.de/einsaetze.json')
        .then(res => res.json())
        .then(missions => Object.fromEntries(missions.map(m => [m.id, m]))),
])

    .then(([events, missions]) =>
        events
            .sort((a, b) => a.caption.localeCompare(b.caption))
            .map(({ caption, mission_type_ids }) => ({
                caption,
                mission_type_ids: mission_type_ids
                    .filter(id => missions[id])
                    .sort(),
                sumAveragePatients: mission_type_ids
                    .map(id => missions[id])
                    .filter(Boolean)
                    .map(
                        m =>
                            ((m.additional?.possible_patient ?? 0) -
                                (m.additional?.possible_patient_min ?? 0)) /
                            2
                    )
                    .reduce((a, b) => a + b),
            }))
            .map(({ caption, mission_type_ids, sumAveragePatients }) => ({
                caption,
                mission_type_ids,
                sumAveragePatients,
                averageCredits:
                    mission_type_ids
                        .map(id => missions[id].average_credits ?? 0)
                        .reduce((a, b) => a + b) / mission_type_ids.length,
                sumAveragePatientCredits: mission_type_ids
                    .map(id => missions[id])
                    .map(
                        m =>
                            (((m.additional?.possible_patient ?? 0) -
                                (m.additional?.possible_patient_min ?? 0)) /
                                2) *
                            (250 +
                                (m.chances.patient_transport ?? 0) *
                                    0.01 *
                                    (250 +
                                        (m.chances.nef ?? 0) *
                                            0.01 *
                                            (200 +
                                                (m.chances.helicopter ?? 0) *
                                                    0.01 *
                                                    50)))
                    )
                    .reduce((a, b) => a + b),
                numFormat: num =>
                    num.toLocaleString(undefined, { maximumFractionDigits: 2 }),
                now: new Date().toLocaleString(),
            }))
            .map(
                ({
                    caption,
                    mission_type_ids,
                    sumAveragePatients,
                    averageCredits,
                    sumAveragePatientCredits,
                    numFormat,
                    now,
                }) => {
                    const table = `<table><thead><tr><th>${caption}</th><th></th><th>Alle 30 Sekunden</th><th>Alle 45 Sekunden</th><th>Alle 60 Sekunden</th></tr></thead><tbody><tr><td class="text-right"><b>${numFormat(
                        averageCredits
                    )}</b></td><td>Credits pro Einsatz</td><td>${numFormat(
                        averageCredits * 360
                    )} Credits</td><td>${numFormat(
                        averageCredits * 240
                    )} Credits</td><td>${numFormat(
                        averageCredits * 180
                    )} Credits</td></tr><tr><td class="text-right"><b>${numFormat(
                        sumAveragePatients / mission_type_ids.length
                    )}</b></td><td>Patienten pro Einsatz</td><td>${numFormat(
                        (sumAveragePatients / mission_type_ids.length) * 360
                    )} Patienten</td><td>${numFormat(
                        (sumAveragePatients / mission_type_ids.length) * 240
                    )} Patienten</td><td>${numFormat(
                        (sumAveragePatients / mission_type_ids.length) * 180
                    )} Patienten</td></tr><tr><td class="text-right"><b>${(
                        sumAveragePatientCredits / sumAveragePatients
                    )
                        .toFixed(2)
                        .replace(
                            '.',
                            ','
                        )}</b></td><td>Verdienst pro Patient</td><td>${numFormat(
                        (sumAveragePatientCredits / sumAveragePatients) *
                            (sumAveragePatients / mission_type_ids.length) *
                            360
                    )} Credits</td><td>${numFormat(
                        (sumAveragePatientCredits / sumAveragePatients) *
                            (sumAveragePatients / mission_type_ids.length) *
                            240
                    )} Credits</td><td>${numFormat(
                        (sumAveragePatientCredits / sumAveragePatients) *
                            (sumAveragePatients / mission_type_ids.length) *
                            180
                    )} Credits</td></tr></tbody></table>`;
                    tables.push(table);
                    return [
                        `<h1><b>${caption}</b></h1><i>Es handelt sich bei den folgenden Zahlen stets um Durchschnittszahlen, um einen groben Erwartungswert zu haben. Echte Zahlen werden dank Captain Zufall einige Variationen haben! Weiter rechnen sie ohne zusÃ¤tzliche Verdienste durch Zuschaltungen, wie z. B. DGL, Schwere Bergung etc.
Stand: ${now}</i>`,
                        table,
                        `<i>Stand: ${now}</i><woltlab-spoiler data-label="${caption}"><ul>${mission_type_ids
                            .map(
                                id =>
                                    `<li>${missions[id].name} (<a href="https://leitstellenspiel.de/einsaetze/${id}">#${id}</a>)</li>`
                            )
                            .join('')}</ul></woltlab-spoiler>`,
                    ].join('\n\n');
                }
            )
            .forEach(event => console.log(event))
    )
    .then(() => console.log(tables.join('\n\n')));
