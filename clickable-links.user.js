// ==UserScript==
// @name            [LSS] Clickable links
// @namespace       https://jxn.lss-manager.de
// @version         2022.0.0
// @author          Jan (jxn_30)
// @description     Allows to click any link in text messages in game
// @description:de  Erlaubt es, alle Links in Textnachrichten im Spiel anzuklicken
// @homepage        https://github.com/jxn-30/LSS-Scripts
// @homepageURL     https://github.com/jxn-30/LSS-Scripts
// @icon            https://www.leitstellenspiel.de/favicon.ico
// @updateURL       https://github.com/jxn-30/LSS-Scripts/raw/master/src/clickableLinks.user.js
// @downloadURL     https://github.com/jxn-30/LSS-Scripts/raw/master/src/clickableLinks.user.js
// @supportURL      https://forum.leitstellenspiel.de/index.php?thread/18350-clickable-links/
// @match           https://www.operacni-stredisko.cz/*
// @match           https://policie.operacni-stredisko.cz/*
// @match           https://www.alarmcentral-spil.dk/*
// @match           https://politi.alarmcentral-spil.dk/*
// @match           https://www.leitstellenspiel.de/*
// @match           https://polizei.leitstellenspiel.de/*
// @match           https://www.missionchief-australia.com/*
// @match           https://police.missionchief-australia.com/*
// @match           https://www.missionchief.co.uk/*
// @match           https://police.missionchief.co.uk/*
// @match           https://www.missionchief.com/*
// @match           https://police.missionchief.com/*
// @match           https://www.centro-de-mando.es/*
// @match           https://www.centro-de-mando.mx/*
// @match           https://www.hatakeskuspeli.com/*
// @match           https://poliisi.hatakeskuspeli.com/*
// @match           https://www.operateur112.fr/*
// @match           https://police.operateur112.fr/*
// @match           https://www.operatore112.it/*
// @match           https://polizia.operatore112.it/*
// @match           https://www.missionchief-japan.com/*
// @match           https://www.missionchief-korea.com/*
// @match           https://www.nodsentralspillet.com/*
// @match           https://politiet.nodsentralspillet.com/*
// @match           https://www.meldkamerspel.com/*
// @match           https://politie.meldkamerspel.com/*
// @match           https://www.operatorratunkowy.pl/*
// @match           https://policja.operatorratunkowy.pl/*
// @match           https://www.operador193.com/*
// @match           https://www.jogo-operador112.com/*
// @match           https://policia.jogo-operador112.com/*
// @match           https://www.jocdispecerat112.com/*
// @match           https://www.dispetcher112.ru/*
// @match           https://www.dispecerske-centrum.com/*
// @match           https://www.larmcentralen-spelet.se/*
// @match           https://polis.larmcentralen-spelet.se/*
// @match           https://www.112-merkez.com/*
// @match           https://www.dyspetcher101-game.com/*
// @run-at          document-idle
// @grant           unsafeWindow
// ==/UserScript==

/**
 * @version 2022.0.0
 * @name Clickable links
 * @description Allows to click any link in text messages in game
 * @description:de Erlaubt es, alle Links in Textnachrichten im Spiel anzuklicken
 * @forum https://forum.leitstellenspiel.de/index.php?thread/18350-clickable-links/
 * @old clickable-links
 * @grant unsafeWindow
 */

const showImg = true;

// https://gist.github.com/dperini/729294
const urlRegex =
    /(?:(?:ftp|https?):)?\/\/(?:\S+@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4])|(?:(?:[\da-z\u00a1-\uffff][\w\-\u00a1-\uffff]{0,62})?[\da-z\u00a1-\uffff]\.)+[a-z\u00a1-\uffff]{2,}\.?)(?::\d{2,5})?(?:[#/?]\S*)?/giu;

const NoneTextParentNodes = [
    'head',
    'meta',
    'title',
    'script',
    'style',
    'link',
    'br',
    'noscript',
    'a',
];

const getTextNodes = (root, filter = () => true) => {
    const children = Array.from(root.childNodes);
    const textChildren = children.filter(n => n.nodeType === 3 && filter(n));
    const elementChildren = children.filter(
        n =>
            n.nodeType === 1 &&
            !NoneTextParentNodes.includes(n.tagName.toLowerCase()) &&
            filter(n)
    );
    return [
        ...textChildren,
        ...elementChildren.map(n => getTextNodes(n, filter)),
    ].flat();
};

const clickableLinks = node =>
    getTextNodes(node, n => n.textContent.match(urlRegex)).forEach(n => {
        const links = n.textContent.match(urlRegex);
        const texts = n.textContent.split(urlRegex);
        texts.forEach(text => {
            if (text) {
                n.parentNode.insertBefore(document.createTextNode(text), n);
            }
            const link = links.shift();
            if (!link) return;
            const linkNode = document.createElement('a');
            linkNode.href = link.toString();
            linkNode.setAttribute('target', '_blank');
            if (showImg) {
                const imgNode = document.createElement('img');
                imgNode.src = link.toString();
                imgNode.alt = link.toString();
                imgNode.style.maxWidth = '10%';
                linkNode.appendChild(imgNode);
            } else {
                linkNode.textContent = link.toString();
            }
            n.parentNode.insertBefore(linkNode, n);
        });
        n.parentNode.removeChild(n);
    });

clickableLinks(document);

const allianceChatOriginal = unsafeWindow.allianceChat;
unsafeWindow.allianceChat = e => {
    const links = e.message.match(urlRegex) || [];
    const texts = e.message.split(urlRegex);
    e.message = '';
    texts.forEach(text => {
        if (text) e.message += text;
        const link = links.shift();
        if (link) {
            e.message += `<a href="${link}" target="_blank">${
                showImg
                    ? `<img src="${link}" alt="${link}" style="max-width: 10%;"/>`
                    : link
            }</a>`;
        }
    });
    allianceChatOriginal(e);
};
