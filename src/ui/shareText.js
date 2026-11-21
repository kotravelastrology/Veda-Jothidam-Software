/**
 * The text a share sheet or the clipboard gets, and the WhatsApp link for it. Plain functions of their inputs, so a test can check them
 * (src/ui/share.ts adds the browser's share sheet and clipboard around them).
 */

/**
 * The title, the lines, and the program's name at the foot (and a link when the text is about the program, not about a person).
 * @param {{ title: string, text: string, url?: string }} input
 * @param {string} [footer]
 * @returns {string}
 */
function composeShareText(input, footer = '— Kotravel வேத ஜோதிடம்') {
  const { title, text, url } = input;
  return [title, '', String(text).trim(), '', footer, url]
    .filter((p) => p !== undefined && p !== null)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** The WhatsApp link for a text, for a browser with neither a share sheet nor a clipboard. */
function whatsappLink(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

module.exports = { composeShareText, whatsappLink };
