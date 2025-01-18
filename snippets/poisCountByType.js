// POIs need to be enabled on map
fetch('/mission_positions')
    .then(res => res.json())
    .then(({ mission_positions }) =>
        mission_positions
            .map(p => p.caption)
            .reduce((a, b) => ((a[b] = (a[b] ?? 0) + 1), a), {})
    )
    .then(console.log);
