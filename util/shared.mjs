import { fileURLToPath } from 'url';
import fs from 'fs';
import jsdoc from 'jsdoc-api';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_PATH = path.resolve(__dirname, '..');
export const SRC_PATH = path.resolve(ROOT_PATH, 'src');
export const GITHUB = 'https://github.com/jxn-30/LSS-Scripts';

/**
 * @typedef Comment
 * @property {string} name
 * @property {string} longname
 * @property {string} description
 * @property {string} version
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

/**
 * get userscript files recursively
 * @param dir
 * @returns {string[]}
 */
const getUserscriptFiles = dir =>
    fs
        .readdirSync(dir, { withFileTypes: true })
        .flatMap(dirent =>
            dirent.isDirectory() ?
                getUserscriptFiles(path.resolve(dir, dirent.name))
            :   path.resolve(dir, dirent.name)
        )
        .filter(
            file =>
                file.endsWith('.user.js') &&
                !path.basename(file).startsWith('.')
        );

/** @type {Comment[]} **/
const comments = jsdoc.explainSync({
    files: getUserscriptFiles(SRC_PATH),
});

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

/**
 * Get a single tag
 * @typedef getTagFn
 * @param {string} title
 * @param {string} [defaultContent]
 * @returns {{tag: string, content: string}}
 */

/**
 * Get Tags and their localized versions
 * @typedef getTagsFn
 * @param {string} title
 * @param {string} [defaultContent]
 * @returns {{tag: string, content: string}[]}
 */

/**
 * @typedef LoopCallbackObject
 * @property {Comment} comment
 * @property {string} fileName
 * @property {string} filePath
 * @property {Tag[]} tags
 * @property {getTagFn} getTag
 * @property {getTagsFn} getTags
 */

/**
 * @typedef LoopCallback
 * @param {LoopCallbackObject} file
 * @returns {Promise<void>}
 */

/**
 * Iterate over all files
 * @param {LoopCallback} callback
 * @returns {Promise<void>}
 */
export const forEachFile = async callback => {
    /** @type {string[]} */
    const processedFiles = [];

    for (const comment of comments) {
        const metaFileName = comment.meta?.filename;
        if (!metaFileName) continue;

        const filePath = path.resolve(comment.meta.path, metaFileName);
        const fileName = path.relative(SRC_PATH, filePath);

        if (processedFiles.includes(fileName)) continue;
        processedFiles.push(fileName);

        const { tags } = comment;

        /**
         * @type getTagFn
         */
        const getTag = (title, defaultContent) => ({
            tag: title,
            content:
                tags.find(tag => tag.title === title)?.value ?? defaultContent,
        });

        /**
         * @type getTagsFn
         */
        const getTags = (title, defaultContent) =>
            filterTags(tags, title, defaultContent);

        await callback({ comment, fileName, filePath, tags, getTag, getTags });
    }
};
