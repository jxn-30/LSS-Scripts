fetch('/api/buildings')
    .then(res => res.json())
    .then(b =>
        b
            .filter(({ enabled }) => !enabled)
            .map(
                b =>
                    `${b.caption} https://www.leitstellenspiel.de/buildings/${b.id}`
            )
            .join('\n')
    )
    .then(console.log);
