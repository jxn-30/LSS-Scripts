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

/**
 * @typedef ScriptLocale
 * @property {string} flag
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {ScriptLocale} Script
 * @property {string} filename
 * @property {string} url
 * @property {string} version
 * @property {string} forum
 * @property {string[]} alias
 * @property {string[]} flagsAvailable
 * @property {Object.<string, ScriptLocale>} locales
 */

const ROOT_PATH = path.resolve(__dirname, '..');
const SRC_PATH = path.resolve(ROOT_PATH, 'src');
const GITHUB = 'https://github.com/jxn-30/LSS-Scripts';

/** @type {Script[]} */
const scriptOverview = [];

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
     * Get a single tag
     * @param {string} title
     * @param {string} [defaultContent]
     * @returns {{tag: string, content: string}}
     */
    const getTag = (title, defaultContent) => ({
        tag: title,
        content: tags.find(tag => tag.title === title)?.value ?? defaultContent,
    });

    /**
     * Get Tags and their localized versions
     * @param {string} title
     * @param {string} [defaultContent]
     * @returns {{tag: string, content: string}[]}
     */
    const getTags = (title, defaultContent) =>
        filterTags(tags, title, defaultContent);

    const oldNames = getTags('old');

    // get paths to execute on
    const localesAvailable = getTags('locale');
    const pathMatches = getTags('match', '/*').map(({ tag, content }) => ({
        tag,
        content: content.replace(/\*\\\//g, '*/'),
    }));

    const matches = Object.keys(games)
        .filter(
            game =>
                localesAvailable.length === 0 ||
                localesAvailable.some(({ content }) => content === game)
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
                if (police) {
                    pathMatches.forEach(({ content: path }) =>
                        matches.push({
                            tag: 'match',
                            content: `https://${police}.${shortURL}${path}`,
                        })
                    );
                }
            }
            return matches;
        });

    const scriptName = `[LSS] ${comment.name.trim()}`;
    const localeScriptNames = tags
        .filter(tag => tag.title.startsWith('name:'))
        .map(({ title, value }) => ({
            tag: title,
            content: `[${
                Object.entries(games).find(([lang]) =>
                    lang.startsWith(title.split(':')[1])
                )?.[1].abbr ?? 'LSS'
            }] ${value}`,
        }));
    const localeDescriptions = getTags('description');

    /** @type {Object.<string, ScriptLocale>} */
    const localeTranslations = {};

    localeScriptNames.forEach(({ tag, content }) => {
        const locale = tag.split(':')[1];
        const game = Object.entries(games).find(([lang]) =>
            lang.startsWith(locale)
        );
        if (!game) return;

        localeTranslations[locale] = {
            flag: game[1].flag,
            name: content,
            description: comment.description,
        };
    });
    localeDescriptions.forEach(({ tag, content }) => {
        const locale = tag.split(':')[1];
        const game = Object.entries(games).find(([lang]) =>
            lang.startsWith(locale)
        );
        if (!game) return;

        if (localeTranslations[locale]) {
            localeTranslations[locale].description = content;
        } else {
            localeTranslations[locale] = {
                flag: game[1].flag,
                name: scriptName,
                description: content,
            };
        }
    });

    const versionTag = getTag('version', `${new Date().getFullYear()}.0.0`);

    const forumTag = getTag('forum', '');

    scriptOverview.push({
        filename: fileName,
        name: scriptName,
        description: comment.description,
        version: versionTag.content,
        alias: oldNames.map(({ content }) => content),
        url: updateURL,
        flagsAvailable:
            localesAvailable.length === 0
                ? []
                : Object.keys(games)
                      .filter(game =>
                          localesAvailable.some(
                              ({ content }) => content === game
                          )
                      )
                      .map(game => games[game].flag),
        locales: localeTranslations,
        forum: forumTag.content,
    });

    // list of tags to add to the userscript
    const userscriptHeaderInformation = [
        {
            tag: 'name',
            content: scriptName,
        },
        ...localeScriptNames,
        {
            tag: 'namespace',
            content: 'https://jxn.lss-manager.de',
        },
        versionTag,
        ...getTags('author', 'Jan (jxn_30)'),
        {
            tag: 'description',
            content: comment.description,
        },
        ...localeDescriptions,
        {
            tag: 'homepage',
            content: GITHUB,
        },
        {
            tag: 'homepageURL',
            content: GITHUB,
        },
        ...getTags('icon', 'https://www.leitstellenspiel.de/favicon.ico'),
        {
            tag: 'updateURL',
            content: updateURL,
        },
        {
            tag: 'downloadURL',
            content: updateURL,
        },
        {
            tag: 'supportURL',
            content: forumTag.content || GITHUB,
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

    // add hardlinks
    // unfortunately, hardlinks are required because GitHub doesn't support symbolic links
    oldNames.forEach(({ content }) => {
        const linkPath = path.resolve(ROOT_PATH, `${content}.user.js`);
        if (fs.existsSync(linkPath)) fs.rmSync(linkPath);
        fs.linkSync(`./${path.relative(ROOT_PATH, filePath)}`, linkPath);
    });

    updatedFiles.push(fileName);
});

const centerString = (string, length) => {
    const half = Math.floor((length - string.length) / 2);
    return string.padStart(half + string.length, ' ').padEnd(length, ' ');
};

const sortedScripts = scriptOverview.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
);

const scriptTOCMarkdown = sortedScripts
    .map(
        ({ name }) =>
            `- [${name}](#${name
                .toLowerCase()
                .replace(/[^a-z0-9-]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '')})`
    )
    .join('\n');

const scriptOverviewMarkdown = sortedScripts
    .map(script => {
        const headerRow = ['Version'];
        const contentRow = [script.version];
        if (script.flagsAvailable.length) {
            headerRow.push('Available in');
            contentRow.push(
                script.flagsAvailable.map(flag => `\`${flag}\``).join(', ')
            );
        }
        headerRow.push('Alias / Old names', 'Download');
        contentRow.push(
            script.alias.map(alias => `\`${alias}\``).join(', '),
            `[${script.filename}][${script.filename}:download]`
        );
        if (script.forum) {
            headerRow.push('Links');
            contentRow.push(`[Forum][${script.filename}:forum]`);
        }

        /** @type {string[][]} */
        const rows = [headerRow, contentRow];

        const cellWidths = rows[0].map((_, i) =>
            Math.max(...rows.map(row => row[i].length))
        );
        rows.splice(
            1,
            0,
            cellWidths.map(width => `:${'-'.repeat(width)}:`)
        );
        return `
### ${script.name}

> ${script.description}

${rows
    .map(
        row =>
            `|${row
                .map((cell, i) => centerString(cell, cellWidths[i] + 2))
                .join('|')}|`
    )
    .join('\n')}

${Object.values(script.locales)
    .map(({ flag, name, description }) =>
        `
<details>
    <summary>${flag} ${name}</summary>
    ${description}
</details>
`.trim()
    )
    .join('\n')}

[${script.filename}:download]: ${script.url}
${script.forum ? `[${script.filename}:forum]: ${script.forum}` : ''}
`.trim();
    })
    .join('\n\n');

const readmePath = path.resolve(ROOT_PATH, 'README.md');

const escapeStringRegexp = string =>
    string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');

const startComment =
    '<!-- prettier-ignore-start -->\n<!-- == BEGIN SCRIPT-OVERVIEW == -->';
const endComment =
    '<!-- ## END SCRIPT-OVERVIEW ## -->\n<!-- prettier-ignore-end -->';

fs.writeFileSync(
    readmePath,
    fs.readFileSync(readmePath, 'utf8').replace(
        new RegExp(
            `${escapeStringRegexp(startComment)}.*?${escapeStringRegexp(
                endComment
            )}`,
            'su'
        ),
        `
${startComment}
${scriptTOCMarkdown}

${scriptOverviewMarkdown}
${endComment}
`.trim()
    )
);
