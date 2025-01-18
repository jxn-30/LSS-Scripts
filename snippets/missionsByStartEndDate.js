// call with getMissions()
fetch('/einsaetze.json')
    .then(res => res.json())
    .then(m => {
        const g = {};
        m.forEach(e => {
            const d = `${e.additional.date_start} - ${e.additional.date_end}`;
            if (!g[d]) {
                g[d] = [];
            }
            g[d].push(e);
        });
        console.log(g);
    });

// prettified output
fetch('/einsaetze.json')
    .then(res => res.json())
    .then(m => {
        const g = {};
        m.filter(e => e.additional.date_start).forEach(e => {
            const d = `${e.additional.date_start} - ${e.additional.date_end}`;
            if (!g[d]) {
                g[d] = [];
            }
            g[d].push(e);
        });
        return g;
    })
    .then(g =>
        Object.entries(g)
            .map(
                ([date, missions]) =>
                    `${date}:\n${missions.map(m => `${m.id.padStart(6, ' ')} ${m.name}`).join('\n')}`
            )
            .join('\n\n')
    )
    .then(console.log);
