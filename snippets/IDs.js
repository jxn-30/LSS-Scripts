// vehicle'types
fetch('https://api.lss-manager.de/de_DE/vehicles')
    .then(res => res.json())
    .then(v =>
        Object.entries(v)
            .map(([id, { caption }]) => `${id.padStart(3, ' ')} ${caption}`)
            .join('\n')
    )
    .then(console.log);

// building types
fetch('https://api.lss-manager.de/de_DE/buildings')
    .then(res => res.json())
    .then(v =>
        Object.entries(v)
            .map(([id, { caption }]) => `${id.padStart(3, ' ')} ${caption}`)
            .join('\n')
    )
    .then(console.log);

// extensions
fetch('https://api.lss-manager.de/de_DE/buildings')
    .then(res => res.json())
    .then(v =>
        Object.entries(v)
            .flatMap(([id, { caption, extensions }]) => [
                `${id.padStart(3, ' ')} ${caption}`,
                ...extensions
                    .filter(Boolean)
                    .map(
                        ({ caption }, id) =>
                            `    ${id.toString().padStart(2, ' ')} ${caption}`
                    ),
            ])
            .join('\n')
    )
    .then(console.log);
