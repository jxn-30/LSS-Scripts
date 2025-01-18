// requires LSSM V4 to be enabled

maxReqs = {};
fetch('/einsaetze.json')
    .then(res => res.json())
    .then(ms =>
        ms.forEach(m =>
            Object.entries(m.requirements).forEach(([req, amount]) => {
                maxReqs[req] = Math.max(maxReqs[req] ?? 0, amount);
            })
        )
    )
    .then(() =>
        console.log(
            Object.entries(maxReqs)
                .map(
                    ([req, amount]) =>
                        `${lssmv4.$tc(`modules.missionHelper.vehicles.captions.${req}`, amount)}: ${amount}`
                )
                .toSorted()
                .join('\n')
        )
    );
