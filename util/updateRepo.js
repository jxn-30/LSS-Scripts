const fs = require('fs');
const path = require('path');
const jsdoc = require('jsdoc-api');

const { games } = require('./games');

/**
 * @typedef Comment
 * @property {string} name
 * @property {string} description
 * @property {Tag[]} tags
 * @property {CommentMeta} meta
 */

/**
 * @typedef Tag
 * @property {string} originalTitle
 * @property {string} title
 * @property {string} text
 * @property {string} value
 */

/**
 * @typedef CommentMeta
 * @property {string} filename
 * @property {string} path
 */

const ROOT_PATH = path.resolve(__dirname, '..');
const SRC_PATH = path.resolve(ROOT_PATH, 'src');

const updatedFiles = [];

/**
 * Get Tags and their localized versions
 * @param {Tag[]} tags
 * @param {string} title
 * @param {string} [defaultContent]
 * @returns {{tag: string, content: string}[]}
 */
const filterTags = (tags, title, defaultContent) => {
    const matchingTags = tags.filter(
        tag => tag.title === title || tag.title.startsWith(`${title}:`)
    );
    if (!matchingTags.length && !defaultContent) return [];
    if (!matchingTags.length) return [{ tag: title, content: defaultContent }];
    return matchingTags.map(({ title, value }) => ({
        tag: title,
        content: value,
    }));
};

// Delete all symbolic links to userscripts in root directory
fs.readdirSync(ROOT_PATH, { withFileTypes: true }).forEach(dirent => {
    if (!dirent.isSymbolicLink() || !dirent.name.endsWith('.user.js')) return;
    fs.unlinkSync(path.resolve(ROOT_PATH, dirent.name));
});

/** @type {Comment[]} **/
const comments = jsdoc.explainSync({
    files: fs.readdirSync(SRC_PATH).map(file => path.resolve(SRC_PATH, file)),
});
comments.forEach(comment => {
    const fileName = comment.meta?.filename;
    if (!fileName || updatedFiles.includes(fileName)) return;

    const filePath = path.resolve(comment.meta.path, fileName);

    const { tags } = comment;

    const updateURL = `https://github.com/jxn-30/LSS-Scripts/raw/master/src/${fileName}`;

    /**
     * Get Tags and their localized versions
     * @param {string} title
     * @param {string} [defaultContent]
     * @returns {{tag: string, content: string}[]}
     */
    const getTags = (title, defaultContent) =>
        filterTags(tags, title, defaultContent);

    // add hardlinks
    // unfortunately, hardlinks are required because GitHub doesn't support symbolic links
    getTags('old').forEach(({ content }) => {
        const linkPath = path.resolve(ROOT_PATH, `${content}.user.js`);
        if (fs.existsSync(linkPath)) fs.rmSync(linkPath);
        fs.linkSync(`./${path.relative(ROOT_PATH, filePath)}`, linkPath);
    });

    // get paths to execute on
    const locales = getTags('locale');
    const pathMatches = getTags('match', '/*').map(({ tag, content }) => ({
        tag,
        content: content.replace(/\*\\\//g, '*/'),
    }));

    const matches = Object.keys(games)
        .filter(
            game =>
                locales.length === 0 ||
                locales.some(({ content }) => content === game)
        )
        .flatMap(game => {
            const { shortURL, police } = games[game];
            const matches = [];
            if (shortURL) {
                pathMatches.forEach(({ content: path }) =>
                    matches.push({
                        tag: 'match',
                        content: `https://www.${shortURL}${path}`,
                    })
                );
                if (police)
                    pathMatches.forEach(({ content: path }) =>
                        matches.push({
                            tag: 'match',
                            content: `https://${police}.${shortURL}${path}`,
                        })
                    );
            }
            return matches;
        });

    // list of tags to add to the userscript
    const userscriptHeaderInformation = [
        {
            tag: 'name',
            content: `[LSS] ${comment.name.trim()}`,
        },
        ...tags
            .filter(tag => tag.title.startsWith('name:'))
            .map(({ title, value }) => ({
                tag: title,
                content: `[${
                    Object.entries(games).find(([lang]) =>
                        lang.startsWith(title.split(':')[1])
                    )?.[1].abbr ?? 'LSS'
                }] ${value}`,
            })),
        {
            tag: 'namespace',
            content: 'https://jxn.lss-manager.de',
        },
        ...getTags('version', `${new Date().getFullYear()}.0.0`),
        ...getTags('author', 'Jan (jxn_30)'),
        {
            tag: 'description',
            content: comment.description,
        },
        ...getTags('description'),
        {
            tag: 'homepage',
            content: 'https://github.com/jxn-30/LSS-Scripts',
        },
        {
            tag: 'homepageURL',
            content: 'https://github.com/jxn-30/LSS-Scripts',
        },
        {
            tag: 'updateURL',
            content: updateURL,
        },
        {
            tag: 'downloadURL',
            content: updateURL,
        },
        ...matches,
        ...getTags('run-at', 'document-idle'),
        ...getTags('grant'),
    ];

    const longestTagLength = Math.max(
        ...userscriptHeaderInformation.map(({ tag }) => tag.length)
    );

    const userscriptTags = userscriptHeaderInformation
        .map(
            ({ tag, content }) =>
                `// @${tag.padEnd(longestTagLength, ' ')}  ${content}`
        )
        .join('\n');

    // write Header to userscript
    fs.writeFileSync(
        filePath,
        fs.readFileSync(filePath, 'utf8').replace(
            /^\/\/ ==UserScript==.*?\/\/ ==\/UserScript==/gs,
            `
// ==UserScript==
${userscriptTags}
// ==/UserScript==
`.trim()
        )
    );

    updatedFiles.push(fileName);
});
