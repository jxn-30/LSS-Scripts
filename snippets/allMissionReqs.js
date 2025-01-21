Promise.all([
    fetch('/einsaetze.json').then(res => res.json()),
    fetch('https://api.lss-manager.de/de_DE/einsaetze').then(res => res.json()),
])
    .then(([m, t]) => {
        const max = {};
        m.forEach(({ prerequisites }) =>
            Object.entries(prerequisites).forEach(
                ([req, cnt]) => (max[req] = Math.max(max[req] ?? 0, cnt))
            )
        );
        delete max.main_building;
        return Object.fromEntries(
            Object.entries(max).map(([req, cnt]) => {
                const name = t.prerequisites[req]?.split('|') ?? [req];
                return [
                    cnt > 1 ? (name[1] ?? name[0]).trim() : name[0].trim(),
                    cnt,
                ];
            })
        );
    })
    .then(console.log);
