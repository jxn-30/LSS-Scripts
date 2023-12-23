// ==UserScript==
// @name            [LSS] AAO Replacer
// @name:de         [LSS] AAO Replacer
// @namespace       https://jxn.lss-manager.de
// @version         2023.12.12+2210
// @author          Jan (jxn_30)
// @description     Allows to replace a requirement in all ARRs with another one.
// @description:de  Ersetze alle Anforderungen in allen AAOs mit einer anderen.
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/aaoReplacer.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/aaoReplacer.user.js
// @supportURL      https://github.com/jxn-30/LSS-Scripts
// @match           https://www.operacni-stredisko.cz/aaos
// @match           https://www.operacni-stredisko.cz/aaos/
// @match           https://policie.operacni-stredisko.cz/aaos
// @match           https://policie.operacni-stredisko.cz/aaos/
// @match           https://www.alarmcentral-spil.dk/aaos
// @match           https://www.alarmcentral-spil.dk/aaos/
// @match           https://politi.alarmcentral-spil.dk/aaos
// @match           https://politi.alarmcentral-spil.dk/aaos/
// @match           https://www.leitstellenspiel.de/aaos
// @match           https://www.leitstellenspiel.de/aaos/
// @match           https://polizei.leitstellenspiel.de/aaos
// @match           https://polizei.leitstellenspiel.de/aaos/
// @match           https://www.missionchief-australia.com/aaos
// @match           https://www.missionchief-australia.com/aaos/
// @match           https://police.missionchief-australia.com/aaos
// @match           https://police.missionchief-australia.com/aaos/
// @match           https://www.missionchief.co.uk/aaos
// @match           https://www.missionchief.co.uk/aaos/
// @match           https://police.missionchief.co.uk/aaos
// @match           https://police.missionchief.co.uk/aaos/
// @match           https://www.missionchief.com/aaos
// @match           https://www.missionchief.com/aaos/
// @match           https://police.missionchief.com/aaos
// @match           https://police.missionchief.com/aaos/
// @match           https://www.centro-de-mando.es/aaos
// @match           https://www.centro-de-mando.es/aaos/
// @match           https://www.centro-de-mando.mx/aaos
// @match           https://www.centro-de-mando.mx/aaos/
// @match           https://www.hatakeskuspeli.com/aaos
// @match           https://www.hatakeskuspeli.com/aaos/
// @match           https://poliisi.hatakeskuspeli.com/aaos
// @match           https://poliisi.hatakeskuspeli.com/aaos/
// @match           https://www.operateur112.fr/aaos
// @match           https://www.operateur112.fr/aaos/
// @match           https://police.operateur112.fr/aaos
// @match           https://police.operateur112.fr/aaos/
// @match           https://www.operatore112.it/aaos
// @match           https://www.operatore112.it/aaos/
// @match           https://polizia.operatore112.it/aaos
// @match           https://polizia.operatore112.it/aaos/
// @match           https://www.missionchief-japan.com/aaos
// @match           https://www.missionchief-japan.com/aaos/
// @match           https://www.missionchief-korea.com/aaos
// @match           https://www.missionchief-korea.com/aaos/
// @match           https://www.nodsentralspillet.com/aaos
// @match           https://www.nodsentralspillet.com/aaos/
// @match           https://politiet.nodsentralspillet.com/aaos
// @match           https://politiet.nodsentralspillet.com/aaos/
// @match           https://www.meldkamerspel.com/aaos
// @match           https://www.meldkamerspel.com/aaos/
// @match           https://politie.meldkamerspel.com/aaos
// @match           https://politie.meldkamerspel.com/aaos/
// @match           https://www.operatorratunkowy.pl/aaos
// @match           https://www.operatorratunkowy.pl/aaos/
// @match           https://policja.operatorratunkowy.pl/aaos
// @match           https://policja.operatorratunkowy.pl/aaos/
// @match           https://www.operador193.com/aaos
// @match           https://www.operador193.com/aaos/
// @match           https://www.jogo-operador112.com/aaos
// @match           https://www.jogo-operador112.com/aaos/
// @match           https://policia.jogo-operador112.com/aaos
// @match           https://policia.jogo-operador112.com/aaos/
// @match           https://www.jocdispecerat112.com/aaos
// @match           https://www.jocdispecerat112.com/aaos/
// @match           https://www.dispetcher112.ru/aaos
// @match           https://www.dispetcher112.ru/aaos/
// @match           https://www.dispecerske-centrum.com/aaos
// @match           https://www.dispecerske-centrum.com/aaos/
// @match           https://www.larmcentralen-spelet.se/aaos
// @match           https://www.larmcentralen-spelet.se/aaos/
// @match           https://polis.larmcentralen-spelet.se/aaos
// @match           https://polis.larmcentralen-spelet.se/aaos/
// @match           https://www.112-merkez.com/aaos
// @match           https://www.112-merkez.com/aaos/
// @match           https://www.dyspetcher101-game.com/aaos
// @match           https://www.dyspetcher101-game.com/aaos/
// @run-at          document-idle
// @grant           GM_addStyle
// ==/UserScript==

/**
 * @name AAO Replacer
 * @name:de AAO Replacer
 * @description Allows to replace a requirement in all ARRs with another one.
 * @description:de Ersetze alle Anforderungen in allen AAOs mit einer anderen.
 * @forum https://forum.leitstellenspiel.de/index.php?thread/25193-script-aao-replacer-schnell-anforderung-durch-eine-andere-ersetzen/
 * @match /aaos
 * @match /aaos/
 * @grant GM_addStyle
 */

const AAO_LINK_SELECTOR = '.aao_btn_group > a[href^="/aaos/"][href$="/edit"]';

/**
 * get a document from an url
 * @param {string} url
 * @returns {Promise<Document>} The document for this url
 */
const getDoc = url =>
    fetch(url)
        .then(res => res.text())
        .then(html => new DOMParser().parseFromString(html, 'text/html'));

/**
 * read the available AAO categories and requirements for each AAO
 * @returns {Promise<Record<string, Record<string, string>>>}
 */
const getPossibleAAORequirements = () =>
    new Promise((resolve, reject) => {
        const aaoEditLink = document.querySelector(AAO_LINK_SELECTOR)?.href;
        if (!aaoEditLink) reject();
        getDoc(aaoEditLink)
            .then(doc => [
                doc,
                Array.from(doc.querySelectorAll('#tabs > li > a')),
            ])
            .then(([doc, tabs]) =>
                tabs.map(tab => [
                    tab.textContent.trim(),
                    Object.fromEntries(
                        Array.from(
                            doc.querySelectorAll(
                                `${tab.getAttribute('href')} .form-group`
                            )
                        ).map(req => [
                            req.querySelector('input')?.name,
                            req.querySelector('label')?.textContent.trim(),
                        ])
                    ),
                ])
            )
            .then(tabs => Object.fromEntries(tabs))
            .then(resolve);
    });

/**
 * get all the set requirements per AAO from the API
 * @returns {Promise<Record<string, string[]>>}
 */
const getAAORequirements = () =>
    fetch('/api/v1/aaos')
        .then(res => res.json())
        .then(aaos =>
            aaos.map(({ id, vehicle_classes, vehicle_types }) => [
                id.toString(),
                [
                    ...Object.keys(vehicle_classes ?? {}).map(
                        key => `aao[${key}]`
                    ),
                    ...Object.keys(vehicle_types ?? {}).map(
                        id => `vehicle_type_ids[${id}]"]`
                    ),
                ],
            ])
        )
        .then(Object.fromEntries);

GM_addStyle(`
.progress-bar[data-current][data-total]::before {
    content: attr(data-current)" / "attr(data-total);
}
`);

(() => {
    // create a button that opens the replacement dialog
    const replaceBtn = document.createElement('a');
    replaceBtn.classList.add('btn', 'btn-default');
    replaceBtn.textContent = 'Anforderungen ersetzen';
    // add it to the button group on the right side of the page header
    document
        .querySelector('.page-header > .btn-group.pull-right')
        ?.append(replaceBtn);

    // create a replacement dialog on click on the button
    replaceBtn.addEventListener('click', () => {
        // create an empty overlay box
        const modal = document.createElement('div');
        modal.style.setProperty('position', 'fixed');
        modal.style.setProperty('width', '90%');
        modal.style.setProperty('height', '90%');
        modal.style.setProperty('z-index', '10005');
        modal.style.setProperty('top', '0');
        modal.style.setProperty('left', '0');
        modal.style.setProperty('margin', '5vh 5%');
        modal.style.setProperty('background-color', 'inherit');
        modal.style.setProperty('border', '1px solid black');
        modal.style.setProperty('border-radius', '5px');
        modal.style.setProperty('padding', '1em');
        modal.style.setProperty('box-shadow', '0px 0px 100vh black');
        modal.style.setProperty('pointer-events', 'all');

        // create a button that closes the modal
        const closeBtn = document.createElement('button');
        closeBtn.id = 'lightbox_close'; // unfortunately needed for ingame style
        closeBtn.classList.add('close');
        closeBtn.style.setProperty('cursor', 'pointer');
        closeBtn.textContent = 'x';
        closeBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.removeProperty('pointer-events');
        });

        // info box that contains some information
        const infoBox = document.createElement('div');
        infoBox.classList.add('alert', 'alert-info');
        infoBox.textContent = `Du hast aktuell ${
            document.querySelectorAll('.aao_btn_group').length
        } AAOs. Bitte wähle, welche Anforderung du durch welche alternative Anforderung ersetzen möchtest.`;

        // status box
        const statusBox = document.createElement('div');
        statusBox.classList.add('alert', 'alert-info');
        statusBox.textContent =
            'Status: Lese mögliche Anforderungen aus, bitte habe einen Moment Geduld...';

        // let's fill the selects with possible AAO requirements
        getPossibleAAORequirements().then(tabs => {
            statusBox.textContent =
                'Status: Bitte wähle nun, welche Anforderung du mit welcher ersetzen möchtest.';

            Object.entries(tabs).forEach(([tab, reqs]) => {
                const group = document.createElement('optgroup');
                group.label = tab;

                Object.entries(reqs).forEach(([req, label]) => {
                    const option = document.createElement('option');
                    option.value = req;
                    option.textContent = label;
                    group.append(option);
                });

                fromReqSelect.add(group);
                toReqSelect.add(group.cloneNode(true));
            });

            fromReqSelect.disabled = false;
            toReqSelect.disabled = false;
        });

        // create two empty selects
        const fromReqSelect = document.createElement('select');
        fromReqSelect.disabled = true;
        const toReqSelect = document.createElement('select');
        toReqSelect.disabled = true;

        modal.addEventListener(
            'change',
            () =>
                (changeBtn.disabled = fromReqSelect.value === toReqSelect.value)
        );

        // create a button that triggers replacement
        const changeBtn = document.createElement('button');
        changeBtn.classList.add('btn', 'btn-success');
        changeBtn.textContent = 'Anforderungen ersetzen';
        changeBtn.disabled = true;

        // trigger replacement on click
        changeBtn.addEventListener('click', async () => {
            if (changeBtn.disabled) return;
            changeBtn.disabled = true;
            fromReqSelect.disabled = true;
            toReqSelect.disabled = true;
            closeBtn.classList.add('hidden');

            const progressWrapper = document.createElement('div');
            progressWrapper.classList.add('progress');
            const progressBar = document.createElement('div');
            progressBar.classList.add(
                'progress-bar',
                'progress-bar-striped',
                'active'
            );
            progressBar.dataset.current = '0';
            progressBar.dataset.total = '0';
            progressWrapper.append(progressBar);

            const from = fromReqSelect.value;
            const to = toReqSelect.value;

            statusBox.textContent =
                'Status: Erfassen, welche AAOs ersetzt werden müssen';

            const aaoRequirements = await getAAORequirements();

            const aaos = Array.from(
                document.querySelectorAll(AAO_LINK_SELECTOR)
            ).filter(aao =>
                aaoRequirements[
                    aao.href.match(/(?<=\/aaos\/)\d+(?=\/edit)/)?.[0]
                ]?.includes(from)
            );

            progressBar.dataset.total = aaos.length.toLocaleString();

            statusBox.textContent = `Status: Die AAO-Einträge werden nun ersetzt. Bitte habe einen Moment Geduld. Bitte plane ca. 0,3 Sekunden pro AAO ein, das heißt der Prozess braucht vermutlich mindestens ${(
                aaos.length * 0.3
            ).toLocaleString()} Sekunden. Abbrechen kannst du den Prozess, indem du das Fenster neu lädst.`;
            statusBox.append(progressWrapper);

            let counter = 0;

            // update the counter and the progress bar
            const inc = () => {
                counter++;

                progressBar.dataset.current = counter.toLocaleString();
                progressBar.style.setProperty(
                    'width',
                    `${((counter / aaos.length) * 100).toString()}%`
                );
            };

            // each request should take at least 100ms
            const timeoutReq = promise =>
                Promise.all([
                    promise,
                    new Promise(resolve => setTimeout(() => resolve(), 100)),
                ]).then(([result]) => result);

            // iterate over all AAOs that do have that requirement
            for (const aao of aaos) {
                // get the form data of this AAO
                const doc = await timeoutReq(getDoc(aao.href));
                const form = doc.querySelector('form');
                const formData = new FormData(form);
                const reqs = Object.fromEntries(formData.entries());

                // update formData
                formData.set(to, reqs[from]);
                formData.set(from, '0');

                // send the updated form data
                await timeoutReq(
                    fetch(form.action, {
                        method: 'POST',
                        body: formData,
                    })
                );

                // update counter and progress bar
                inc();
            }

            // update status box to tell the user that the process is finished
            statusBox.textContent =
                'Status: Die AAO-Einträge wurden ersetzt. Herzlichen Glückwunsch! Du kannst bei Bedarf jetzt noch eine Ersetzung durchführen.';

            // cleanup
            progressBar.remove();
            changeBtn.disabled = false;
            fromReqSelect.disabled = false;
            toReqSelect.disabled = false;
            closeBtn.classList.remove('hidden');
        });

        // append all content to the modal
        modal.append(
            closeBtn,
            infoBox,
            statusBox,
            'Zu ersetzende Anforderung:\xa0',
            fromReqSelect,
            document.createElement('br'),
            'Ersetzen mit:\xa0',
            toReqSelect,
            document.createElement('br'),
            document.createElement('br'),
            changeBtn
        );
        // add the modal to the DOM
        document.body.append(modal);
        document.body.style.setProperty('pointer-events', 'none');
    });
})();
