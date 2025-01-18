// sorted by ID
fetch('/einsaetze.json')
    .then(res => res.json())
    .then(m =>
        m
            .filter(m => m.additional.patient_at_end_of_mission)
            .map(
                m =>
                    `<a href="https://leitstellenspiel.de/einsaetze/${m.base_mission_id}${m.additive_overlays ? `?additive_overlays=${m.additive_overlays}` : ''}${void 0 != m.overlay_index ? `?overlay_index=${m.overlay_index}` : ''}"><code>#${m.id.padEnd(8, ' ').replace(/ /g, '&nbsp;')}</code>&nbsp;${m.name.replace(/ /g, '&nbsp;')}</a>`
            )
            .join('<br>\n')
    )
    .then(console.log);

// sorted by Alphabet
fetch('/einsaetze.json')
    .then(res => res.json())
    .then(m =>
        m
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(m => m.additional.patient_at_end_of_mission)
            .map(
                m =>
                    `<a href="https://leitstellenspiel.de/einsaetze/${m.base_mission_id}${m.additive_overlays ? `?additive_overlays=${m.additive_overlays}` : ''}${void 0 != m.overlay_index ? `?overlay_index=${m.overlay_index}` : ''}"><code>#${m.id.padEnd(8, ' ').replace(/ /g, '&nbsp;')}</code>&nbsp;${m.name.replace(/ /g, '&nbsp;')}</a>`
            )
            .join('<br>\n')
    )
    .then(console.log);
