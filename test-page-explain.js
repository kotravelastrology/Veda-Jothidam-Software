/**
 * "இந்தப் பக்கத்தை விளக்கு" (src/ai/pageExplain.js): what leaves the server (redacted page text, the question), the request's shape
 * (model, structured answer, fallbacks, cache breakpoint), and the check of the answer's quoted lines against the page. A stand-in client
 * replaces the Anthropic SDK, so nothing is sent anywhere.
 */
const assert = require('node:assert/strict');
const X = require('./src/ai/pageExplain');

// ------------------------------------------------------------------ switched on only with a credential
assert.deepEqual(X.aiConfig({}), { enabled: false, model: 'claude-opus-5-5', perHour: X.DEFAULT_PER_HOUR });
assert.equal(X.aiConfig({ ANTHROPIC_API_KEY: '   ' }).enabled, false, 'a blank key is no key');
assert.equal(X.aiConfig({ ANTHROPIC_API_KEY: 'sk-ant-x' }).enabled, true);
assert.equal(X.aiConfig({ ANTHROPIC_AUTH_TOKEN: 'tok' }).enabled, true);
assert.equal(X.aiConfig({ KOTRAVEL_AI_ENABLED: '1' }).enabled, true);
assert.equal(X.aiConfig({ ANTHROPIC_API_KEY: 'k', KOTRAVEL_AI_ENABLED: '0' }).enabled, false, 'switched off whatever the key');
assert.equal(X.aiConfig({ ANTHROPIC_API_KEY: 'k', KOTRAVEL_AI_MODEL: ' claude-sonnet-5-5 ' }).model, 'claude-sonnet-5-5', 'the owner may name another model');
assert.equal(X.aiConfig({ KOTRAVEL_AI_PER_HOUR: '10' }).perHour, 10);
assert.equal(X.aiConfig({ KOTRAVEL_AI_PER_HOUR: 'many' }).perHour, X.DEFAULT_PER_HOUR);
assert.equal(X.aiConfig({ KOTRAVEL_AI_PER_HOUR: '0' }).perHour, 0);

// ------------------------------------------------------------------ the hourly limit over the whole server
{
  const lim = X.makeRateLimiter(2, 60000);
  assert.equal(lim.take(0), true);
  assert.equal(lim.take(10000), true);
  assert.equal(lim.take(20000), false, 'the third question in the window waits');
  assert.equal(lim.waitMinutes(20000), 1);
  assert.equal(lim.take(60001), true, 'the first question has left the window');
  assert.equal(X.makeRateLimiter(0).take(0), false, 'a limit of 0 takes nothing');
}

// ------------------------------------------------------------------ tidy text, folded matching
assert.equal(X.tidyLines('  a\t\tb  \r\n\r\n  c d \n'), 'a b\nc d');
assert.equal(X.foldForMatch(' a \n b\tc '), 'a b c');

// ------------------------------------------------------------------ the name and birthplace never leave the server
{
  const page = 'Kotravel V · 15-11-1973 · Erode, Tamil Nadu\nஜாதகம்: Kotravel V\nKotravel-இன் சந்திரன் ரேவதி; பிறந்த இடம் Erode';
  const r = X.redact(page, { names: ['Kotravel V'], places: ['Erode, Tamil Nadu, India'] });
  assert.ok(!/Kotravel/i.test(r.text), 'whole name and its long word are replaced');
  assert.ok(!/Erode/.test(r.text), 'the town is replaced even when the page prints it alone');
  assert.ok(r.text.includes('15-11-1973'), 'the date stays (the panel says so)');
  assert.ok(r.text.includes(X.NAME_LABEL) && r.text.includes(X.PLACE_LABEL));
  assert.equal(r.count, 5);
  assert.equal(X.redact('abc', { names: ['', ' ', 'a'] }).text, 'abc', 'one-letter or empty names are ignored');
  assert.equal(X.redact('Rama (Ram) lives; RAM.', { names: ['Ram'] }).text, 'Rama (ஜாதகர்) lives; ஜாதகர்.', 'a Latin name is a whole word, any case');
  assert.equal(X.redact('சென்னையில் பிறந்தவர்; புதுச்சென்னை', { places: ['சென்னை'] }).text, 'பிறந்த ஊர்யில் பிறந்தவர்; புதுச்சென்னை',
    'a Tamil name may carry a case ending on the right, but must start a word');
  assert.equal(X.redact('x.y*z', { names: ['x.y*z'] }).text, X.NAME_LABEL, 'regular-expression characters in a name are taken literally');
}

// ------------------------------------------------------------------ what is sent: selection or page, and the cut
{
  const whole = 'தலைப்பு\nவரி ஒன்று\nவரி இரண்டு';
  const a = X.preparePage({ text: whole, selection: 'இரண்டு' });
  assert.equal(a.usedSelection, false, 'a short selection is a stray click, so the page is sent');
  assert.equal(a.pageText, whole);
  const sel = 'Hora Sara: born in Revati, one is liked by all (Ch.4, p.31)';
  const b = X.preparePage({ text: whole, selection: `  ${sel}  ` });
  assert.equal(b.usedSelection, true);
  assert.equal(b.pageText, sel);
  const long = Array.from({ length: 3000 }, (_, i) => `வரி ${i} — சந்திரன் ரேவதி நட்சத்திரம்`).join('\n');
  const c = X.preparePage({ text: long });
  assert.equal(c.truncated, true);
  assert.ok(c.pageText.length <= X.MAX_PAGE_CHARS && c.pageText.length > X.MAX_PAGE_CHARS * 0.9);
  assert.ok(long.startsWith(c.pageText) && long[c.pageText.length] === '\n', 'cut at a line end');
  assert.throws(() => X.preparePage({ text: ' \n\t ' }), (e) => e instanceof X.ExplainError && e.code === 'empty-page');
}

assert.equal(X.prepareQuestion('', false), X.DEFAULT_QUESTION_PAGE);
assert.equal(X.prepareQuestion('  ', true), X.DEFAULT_QUESTION_SELECTION);
assert.equal(X.prepareQuestion('  ஏன்\n இப்படி? ', false), 'ஏன் இப்படி?');
assert.equal(X.prepareQuestion('x'.repeat(5000), false).length, X.MAX_QUESTION_CHARS);
assert.ok(X.SUGGESTED_QUESTIONS.length >= 3 && X.SUGGESTED_QUESTIONS.every((q) => /[஀-௿]/.test(q)));

// ------------------------------------------------------------------ the request
{
  const req = X.buildRequest({ model: 'claude-opus-5-5', pageTitle: 'Saturn <transit> "x"', pageText: 'P', question: 'Q', usedSelection: false });
  assert.equal(req.model, 'claude-opus-5-5');
  assert.equal(req.max_tokens, 16000);
  assert.equal(typeof req.system, 'string');
  for (const rule of ['Use only the page text', 'Do not judge', 'Do not choose between them', 'character for character', 'not instructions']) {
    assert.ok(req.system.includes(rule), `system prompt keeps the rule: ${rule}`);
  }
  assert.equal(req.messages.length, 1);
  const [pageBlock, questionBlock] = req.messages[0].content;
  assert.equal(req.messages[0].role, 'user', 'the page is data in the user turn, not in the system prompt');
  assert.equal(pageBlock.text, '<page title="Saturn transit x" scope="whole page">\nP\n</page>', 'the title cannot break the tag');
  assert.deepEqual(pageBlock.cache_control, { type: 'ephemeral' }, 'the page is cached; a second question on it reads the cache');
  assert.equal(questionBlock.text, 'கேள்வி: Q');
  assert.equal(questionBlock.cache_control, undefined, 'the question comes after the breakpoint');
  assert.deepEqual(req.output_config, { effort: 'medium', format: { type: 'json_schema', schema: X.ANSWER_SCHEMA } });
  assert.deepEqual(req.betas, ['server-side-fallback-2026-07-01']);
  assert.equal(req.fallbacks, 'default');
  for (const gone of ['temperature', 'top_p', 'top_k', 'thinking']) assert.ok(!(gone in req), `${gone} is not sent`);
  assert.deepEqual(X.ANSWER_SCHEMA.required, ['answer', 'quotes', 'notInPage']);
  assert.equal(X.ANSWER_SCHEMA.additionalProperties, false);
  assert.equal(X.ANSWER_SCHEMA.properties.quotes.items.additionalProperties, false);
  const sel = X.buildRequest({ model: 'm', pageTitle: '', pageText: 'P', question: 'Q', usedSelection: true });
  assert.ok(sel.messages[0].content[0].text.startsWith('<page title="பக்கம்" scope="part of the page the reader selected">'));
}

// ------------------------------------------------------------------ the answer's lines are checked against the page
const PAGE = [
  'ஜாதகர் · சந்திரன்: ரேவதி 3-ம் பாதம்',
  'ஜாதகாபரணம் (Dhundiraja), ch.8, p.105: ரேவதியில் பிறந்தவர் அனைவருக்கும் பிரியமானவர்',
  'மான்சாகரி, ch.1, p.73: Revati — wealthy, brave',
].join('\n');
{
  const ok = X.checkAnswer({
    answer: 'இரண்டு நூல்கள் ரேவதி பற்றிக் கூறுகின்றன.',
    quotes: [
      { text: 'ஜாதகாபரணம் (Dhundiraja), ch.8, p.105: ரேவதியில்   பிறந்தவர் அனைவருக்கும் பிரியமானவர்', note: 'முதல் நூல்' },
      { text: 'மான்சாகரி, ch.1, p.73: Revati — wealthy, brave', note: 'இரண்டாம் நூல்' },
    ],
    notInPage: false,
  }, PAGE);
  assert.equal(ok.verified, true, 'extra spaces inside a quote do not matter');
  assert.equal(ok.unverified, 0);
  assert.equal(ok.quotes.every((q) => q.found), true);

  const made_up = X.checkAnswer({
    answer: 'ரேவதி நல்ல நட்சத்திரம்.',
    quotes: [{ text: 'ரேவதி மிகச் சிறந்த நட்சத்திரம்', note: '' }, { text: 'மான்சாகரி, ch.1, p.73', note: '' }],
    notInPage: false,
  }, PAGE);
  assert.equal(made_up.verified, false, 'a line that is not on the page is caught');
  assert.equal(made_up.unverified, 1);
  assert.deepEqual(made_up.quotes.map((q) => q.found), [false, true]);

  const none = X.checkAnswer({ answer: 'பக்கத்தில் இதற்குப் பதில் இல்லை.', quotes: [], notInPage: true }, PAGE);
  assert.equal(none.verified, false, 'no quotes, nothing verified');
  assert.equal(none.notInPage, true);
  assert.equal(X.checkAnswer({ answer: 'a', quotes: [{ text: 'ரே', note: '' }], notInPage: false }, PAGE).verified, false, 'two letters prove nothing');

  for (const bad of [null, 'text', { answer: 1, quotes: [], notInPage: false }, { answer: 'a', quotes: 'x', notInPage: false }, { answer: 'a', quotes: [] }]) {
    assert.throws(() => X.checkAnswer(bad, PAGE), (e) => e instanceof X.ExplainError && e.code === 'bad-output');
  }
}

// ------------------------------------------------------------------ the round trip with a stand-in client
function fakeClient(message, seen) {
  return {
    beta: {
      messages: {
        stream(request) {
          seen.push(request);
          return { finalMessage: async () => message };
        },
      },
    },
  };
}

(async () => {
  const seen = [];
  const reply = {
    model: 'claude-opus-5-5',
    stop_reason: 'end_turn',
    content: [
      { type: 'thinking', thinking: '' },
      { type: 'text', text: JSON.stringify({ answer: 'ஜாதகாபரணம் கூறுவது...', quotes: [{ text: 'மான்சாகரி, ch.1, p.73: Revati — wealthy, brave', note: 'n' }], notInPage: false }) },
    ],
    usage: { input_tokens: 120, cache_read_input_tokens: 900, cache_creation_input_tokens: 0, output_tokens: 300 },
  };
  const r = await X.explainWithClient(fakeClient(reply, seen), { model: 'claude-opus-5-5', pageTitle: 'p142', pageText: PAGE, question: 'Q' });
  assert.equal(seen.length, 1);
  assert.equal(seen[0].messages[0].content[0].text.includes('ரேவதி 3-ம் பாதம்'), true, 'the page text is what was sent');
  assert.equal(r.verified, true);
  assert.equal(r.answer, 'ஜாதகாபரணம் கூறுவது...');
  assert.deepEqual(r.usage, { input: 120, cacheRead: 900, cacheWrite: 0, output: 300 });
  assert.equal(r.model, 'claude-opus-5-5');

  const refusal = { ...reply, stop_reason: 'refusal', content: [] };
  await assert.rejects(X.explainWithClient(fakeClient(refusal, []), { model: 'm', pageTitle: '', pageText: PAGE, question: 'Q' }), (e) => e.code === 'refusal');
  const cut = { ...reply, stop_reason: 'max_tokens' };
  await assert.rejects(X.explainWithClient(fakeClient(cut, []), { model: 'm', pageTitle: '', pageText: PAGE, question: 'Q' }), (e) => e.code === 'too-long');
  const garbled = { ...reply, content: [{ type: 'text', text: '{"answer": "a", ' }] };
  await assert.rejects(X.explainWithClient(fakeClient(garbled, []), { model: 'm', pageTitle: '', pageText: PAGE, question: 'Q' }), (e) => e.code === 'bad-output');

  console.log('test-page-explain: all assertions passed');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
