import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import simpleGit from 'simple-git';
import { GITHUB, ROOT_PATH } from './shared.mjs';

/**
 * create a sha256 hex hash from a string
 * @param {string} string
 * @returns {string}
 */
const createHashFromString = string =>
    createHash('sha256').update(string).digest('hex');

/**
 * update resources of a script, commit changes and return the new resource paths
 * @param {string} userscriptName
 * @param {{tag: string, content: string}[]} resourceTags
 * @return {Promise<{updated: boolean, resources: string[]}>} the resource paths
 */
const updateResources = async (userscriptName, resourceTags) => {
    /** @type {{absPath: string, name: string, relPath: string, hash: string}[]} */
    const resources = [];
    /** @type string[] */
    const updatedFiles = [];

    for (const { content } of resourceTags) {
        const [name, url] = content.split(/\s+/).map(s => s.trim());
        if (!name || !url) continue;

        const fileName = path.join(
            'resources',
            userscriptName,
            `${name}${path.extname(url)}`
        );

        // where to put the ressource file
        const outFilePath = path.resolve(ROOT_PATH, fileName);
        // recursively create the target directory
        fs.mkdirSync(path.dirname(outFilePath), { recursive: true });

        let resourceContent = '';
        console.info(`updating resource ${name} from ${url}`);
        let addFetchNote = true;
        if (url.match(/^https?:\/\//)) {
            resourceContent = await fetch(url)
                .then(res => res.text())
                .then(text =>
                    text.replace(/^\/\/# sourceMappingURL=.*?$/gm, '').trim()
                );
        } else if (url.match(/^\//)) {
            addFetchNote = false;
            const absPath = path.resolve(ROOT_PATH, url.substring(1));
            resourceContent = fs.readFileSync(absPath).toString();
        }

        const contentBefore = fs.existsSync(outFilePath)
            ? fs.readFileSync(outFilePath).toString()
            : '';

        const processedContentBefore = addFetchNote
            ? contentBefore.split(/\n/).slice(1).join('\n')
            : contentBefore;
        const hashContentBefore = createHashFromString(processedContentBefore);
        const hashResourceContent = createHashFromString(resourceContent);
        const isUpdated = hashContentBefore !== hashResourceContent;
        console.log(isUpdated, hashContentBefore, hashResourceContent);

        if (isUpdated) {
            updatedFiles.push(outFilePath);

            const fileContent = addFetchNote
                ? `// fetched from ${url} at ${new Date().toISOString()}\n${resourceContent}`
                : resourceContent;
            fs.writeFileSync(outFilePath, fileContent);
        }

        const hash = createHashFromString(fs.readFileSync(outFilePath));

        resources.push({
            absPath: outFilePath,
            name,
            relPath: fileName,
            hash,
        });
    }

    const git = simpleGit();

    if (updatedFiles.length) {
        let prevUserName = '';
        let prevUserEmail = '';

        await git
            .getConfig('user.name')
            .then(({ value }) => (prevUserName = value));
        await git
            .getConfig('user.email')
            .then(({ value }) => (prevUserEmail = value));

        await git.addConfig('user.name', 'resource-updater [bot]');
        await git.addConfig(
            'user.email',
            'github-actions[bot]@users.noreply.github.com'
        );
        await git.commit(
            `chore(res): Update resources for ${userscriptName}`,
            updatedFiles
        );

        // restore old config
        await git.addConfig('user.name', prevUserName);
        await git.addConfig('user.email', prevUserEmail);
    }

    let latestCommitHash = '';
    await git
        .log(['-1', ...resources.map(r => r.absPath)])
        .then(({ latest }) => {
            latestCommitHash = latest.hash.substring(0, 10);
        });

    const tags = resources.map(
        ({ relPath, name, hash }) =>
            `${name} ${GITHUB}/raw/${latestCommitHash}/${relPath}#sha256=${hash}`
    );

    return { updated: !!updatedFiles.length, resources: tags };
};

export default updateResources;
