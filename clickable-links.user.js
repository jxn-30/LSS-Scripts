// ==UserScript==
// @name         LSS-Clickable-Links
// @version      1.0.0
// @author       Jan (jxn_30)
// @description  Sämtliche Links werden anklickbar
// @include      /^https?:\/\/(?:w{3}\.)?(?:leitstellenspiel\.de|(?:meldkamerspel|missionchief|missionchief-australia|nodsentralspillet|112-merkez|jogo-operador112|operador193|dyspetcher101-game|missionchief-japan|jocdispecerat112|missionchief-korea|hatakeskuspeli|dispecerske-centrum)\.com|missionchief\.co\.uk|centro-de-mando\.es|operatorratunkowy\.pl|larmcentralen-spelet\.se|operatore112\.it|operateur112\.fr|dispetcher112\.ru|alarmcentral-spil\.dk|operacni-stredisko\.cz|centro-de-mando\.mx)\/.*$/
// ==/UserScript==
const urlRegex = /(?:(?:[A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)(?:(?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?/g;

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
            if (text) n.parentNode.insertBefore(document.createTextNode(text), n);
            const link = links.shift();
            if (!link) return;
            const linkNode = document.createElement('a');
            linkNode.href = link.toString();
            linkNode.setAttribute('target', '_blank');
            linkNode.textContent = link.toString();
            n.parentNode.insertBefore(linkNode, n);
        });
        n.parentNode.removeChild(n);
    });

clickableLinks(document);

const allianceChatOriginal = window.allianceChat;
window.allianceChat = e => {
    const links = e.message.match(urlRegex) || [];
    const texts = e.message.split(urlRegex);
    e.message = '';
    texts.forEach(text => {
        if (text) e.message += text;
        const link = links.shift();
        if (link) e.message += `<a href="${link}" target="_blank">${link}</a>`;
    });
    allianceChatOriginal(e);
};
