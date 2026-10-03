/**
 * VJ-026 — the one place every classical source this software relies on is
 * named, together with what we are and are not allowed to do with it.
 *
 * The engines cite sources inline, through `attachSource()`, which is right:
 * a calculator should carry its own provenance. But inline citations cannot
 * answer two questions the project has to answer:
 *
 *   1. *Which* books does the whole product depend on, and may we redistribute
 *      any of them? (VJ-026 acceptance: "redistribution rights documented".)
 *   2. Does a source a page shows to a user actually exist, or did a glossary
 *      entry invent it?
 *
 * So this registry names the sources once, and `citationScan.js` checks that
 * every `pageLocus` in the engines resolves to one of them. A source cannot
 * be cited without being registered, and cannot be registered without its
 * rights being stated — including stated as unknown.
 *
 * ## On the rights statuses
 *
 * `RESTRICTED` is the honest default for a modern book. An ancient text is in
 * the public domain; a twentieth-century *translation* of it is a new
 * copyrightable work, and it is the translation we read. Citing a chapter and
 * verse is not redistribution; shipping the file is.
 *
 * `UNVERIFIED` means exactly that — nobody has read the licence yet. It is not
 * a softer `PERMITTED`. Anything not `PERMITTED` is treated as "cite only, do
 * not ship" until someone checks, which is the same posture VJ-007 takes with
 * the Swiss Ephemeris licence.
 */

const RIGHTS_STATUSES = ['PERMITTED', 'RESTRICTED', 'UNVERIFIED'];

const SOURCES = [
  {
    id: 'BPHS_SANTHANAM',
    title: 'Brihat Parashara Hora Shastra (BPHS)',
    titleTa: 'பிருஹத் பராசர ஹோரா சாஸ்திரம்',
    author: 'R. Santhanam (translation)',
    file: 'C23_BPHS_Santhanam.pdf',
    tradition: 'Parashari',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'The Sanskrit original is ancient and out of copyright; this '
        + 'twentieth-century English translation is not, and the translation is '
        + 'what the engines were read against. Chapter and verse may be cited '
        + 'freely; the PDF must not be bundled or redistributed.',
      verified: false,
      toConfirm: 'Publisher and edition terms have not been read. Confirm before '
        + 'any build ships reference text rather than citations.',
    },
  },
  {
    id: 'VINAY_ADITYA_ASHTAKAVARGA',
    title: 'Practical Ashtakavarga',
    titleTa: 'நடைமுறை அஷ்டகவர்க்கம்',
    author: 'Vinay Aditya',
    file: 'Jyotish_2011_Vinay Aditya_Practical Ashtakavarga.pdf',
    tradition: 'Parashari',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'A 2011 book, in copyright. The bindu tables it prints are '
        + 'classical data rather than the author\'s invention, but its '
        + 'arrangement, wording and worked examples are the author\'s work.',
      verified: false,
      toConfirm: 'Publisher terms not read.',
    },
  },
  {
    id: 'IJATET_CHAKRAS_2022',
    title: 'Chakra papers — International Journal of Advanced Trends in '
      + 'Engineering and Technology (IJATET), Vol.7 Issue.1, 2022',
    titleTa: 'சக்கர ஆய்வுக் கட்டுரைகள் (IJATET 2022)',
    author: 'K. Ilangovan, Dr. A.R. Gowthem & Prof. Dr. Sri Prathyangira Swamy',
    file: 'IJATET Vol.7 Issue.1, 2022',
    tradition: 'Parashari / classical muhurta',
    rights: {
      status: 'UNVERIFIED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'Journal articles. Many such journals are open access under a '
        + 'Creative Commons licence, which would permit redistribution with '
        + 'attribution — but this has not been checked for IJATET, and an '
        + 'assumption is not a licence.',
      verified: false,
      toConfirm: 'Read the journal\'s licence statement. If it is CC-BY, this '
        + 'becomes PERMITTED with attribution and the papers could ship.',
    },
  },
  {
    id: 'PANCHANGAM_CALCULATIONS',
    title: 'Panchangam Calculations',
    titleTa: 'பஞ்சாங்கக் கணக்கீடுகள்',
    author: null,
    file: 'Panchangam Calculations (S1-B source set)',
    tradition: 'Tamil panchangam',
    rights: {
      status: 'UNVERIFIED',
      mayShip: false,
      mayQuoteShort: false,
      note: 'No author was recorded when this was catalogued in S1-B, so the '
        + 'work cannot be identified well enough to assess its rights.',
      verified: false,
      toConfirm: 'Identify the actual work — author, publisher, edition — before '
        + 'relying on it further. A source that cannot be named cannot be checked.',
    },
  },
  {
    id: 'KALACHAKRAM_THILLAINAYAKA',
    title: 'காலச்சக்கரம் (தெளிவான உரையுடன்) — தில்லைநாயகப் புலவர்',
    titleTa: 'காலச்சக்கரம் (தெளிவான உரையுடன்)',
    author: 'தில்லைநாயகப் புலவர்; பதிப்பாசிரியர் வித்துவான் அடிகளாசிரியர்',
    file: 'தஞ்சாவூர் சரசுவதி மகால் நூலகம் வெளியீடு எண். 125, 7th edn. 2007 '
      + '(digitised: Tamil Digital Library / Internet Archive, TVA_BOK_0008536)',
    tradition: 'Tamil classical — rasi dasha keyed to nakshatra padas',
    rights: {
      status: 'UNVERIFIED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'A Saraswathi Mahal Library edition, digitised and publicly readable on '
        + 'the Internet Archive — which makes the scan accessible but does not by '
        + 'itself grant redistribution. The underlying text is old; the 2007 '
        + 'edition\'s introduction and commentary, which is exactly the part the '
        + 'engine was read against (pp.1-13), is modern editorial work.',
      verified: false,
      toConfirm: 'Check the Saraswathi Mahal edition\'s terms and the Internet '
        + 'Archive item\'s rights statement. The distinction that matters is between '
        + 'the old text and the 2007 editorial apparatus.',
    },
  },
  {
    id: 'CHOODAMANI_ULLAMUDAIYAN',
    title: 'சூடாமணி உள்ளமுடையான் : உரையுடன் (சோதிட நூல்)',
    titleTa: 'சூடாமணி உள்ளமுடையான்',
    author: 'ஓலைச்சுவடி மூலம்; தஞ்சாவூர் சரசுவதி மகால் நூலகப் பதிப்பு',
    file: 'தஞ்சாவூர் சரசுவதி மகால் நூலகம், 2007 edn. '
      + '(digitised: Internet Archive / Tamil Digital Library, TVA_BOK_0008543)',
    tradition: 'Tamil classical — muhurta, omens, natal, transit and marriage matching',
    rights: {
      status: 'UNVERIFIED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'A Saraswathi Mahal edition, digitised and publicly readable on the '
        + 'Internet Archive, which states no licence for the item. The underlying '
        + 'text is an old palm-leaf work; the 2007 edition\'s commentary and '
        + 'editorial apparatus are modern. Same posture as the Kalachakra source '
        + 'from the same series.',
      verified: false,
      toConfirm: 'Check the Saraswathi Mahal edition\'s terms and the Internet '
        + 'Archive item\'s rights statement, distinguishing the old text from the '
        + '2007 editorial apparatus.',
    },
  },
  {
    id: 'KALAPRAKASIKA_NPS_IYER',
    title: 'Kalaprakasika',
    titleTa: 'காலப்பிரகாசிகை',
    author: 'N.P. Subramania Iyer (translator)',
    file: 'kalaprakasika-nps-iyer-1982/raw-scans/full-scan.pdf '
      + '(1982 English translation; an earlier 1917 print of the same translation is held as OCR text)',
    tradition: 'Tamil / Sanskrit classical (muhurta)',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'Kalaprakasika is an old work, and the old text itself is not the difficulty. '
        + 'What was read here is a twentieth-century English translation, which is a new '
        + 'copyrightable work in its own right — the same position as the BPHS translation. '
        + 'Citing printed pages is fine; shipping the file is not.',
      verified: false,
      toConfirm: 'Whether the 1917 print (Internet Archive item in.ernet.dli.2015.45999, no licence '
        + 'stated) is out of copyright in India, which depends on the translator\'s death date. '
        + 'If it is, the 1917 text — not the 1982 volume — is the one that could ship.',
    },
  },
  {
    id: 'VISHNU_BHASKAR_ADVANCED_TECHNIQUES',
    title: 'Advanced Techniques of Predictive Astrology: A Vedic Treatise in Modern Times',
    titleTa: 'முன்னறிவிப்பு ஜோதிடத்தின் மேம்பட்ட உத்திகள்',
    author: 'Vishnu Bhaskar',
    file: 'advanced-techniques-of-predictive-astrology-vishnu-bhaskar/raw-scans/volume-1-part-02-pages-87-183.pdf',
    tradition: 'Parashari (modern compilation of classics)',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'A modern book. Cited by printed page for the Saturn-transit definitions '
        + '(Sade Sati, Dhaiya, Kantaka). The scan held in the curated library paginates one '
        + 'page later than another copy of the same book; the citation gives the page of the '
        + 'curated copy and says so.',
      verified: false,
      toConfirm: 'Publisher and edition were not read from the scan; the book is a modern '
        + 'compilation and should be treated as in copyright.',
    },
  },
  {
    id: 'PULIPPANI_GOCHAR_PHALADEEPIKA',
    title: 'Gochar Phaladeepika (Transit Results)',
    titleTa: 'கோசார பலதீபிகை',
    author: 'Dr. U.S. Pulippani',
    file: 'gochar-phaladeepika-pulippani/raw-scans/full-scan.pdf',
    tradition: 'Tamil / Sanskrit transit tradition (Phaladeepika commentary)',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'A modern commentary in English over an old text. Its Saturn chapter is internally '
        + 'inconsistent about Kantaka Saturn (printed p.69 names the 8th; pp.168-169 name the '
        + '4th, 7th and 8th), and the software records both readings.',
      verified: false,
      toConfirm: 'Edition and publisher not read from the scan.',
    },
  },
  {
    id: 'PARASHARAS_LIGHT_6_1_MANUAL',
    title: "Parashara's Light 6.1 manual",
    titleTa: 'பராசரர் லைட் 6.1 கையேடு',
    author: 'Parashara\'s Light (publisher not read from the file)',
    file: 'parasharas-light-6-1-manual/raw-scans/full-scan.pdf',
    tradition: 'Reference software manual',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'A commercial software manual, not a classical text. Cited only to record which '
        + 'houses the reference software calls Kantaka Saturn. It is the 6.1 manual, not the '
        + '9.0 that the owner uses; PL9 wording was not read.',
      verified: false,
      toConfirm: 'Whether PL 9.0 defines Kantaka Saturn the same way as the 6.1 glossary.',
    },
  },
  {
    id: 'RATH_VEDIC_REMEDIES',
    title: 'Vedic Remedies in Astrology',
    titleTa: 'ஜோதிடத்தில் வேதப் பரிகாரங்கள்',
    author: 'Sanjay Rath',
    file: 'vedic-remedies-in-astrology-rath/raw-scans/full-scan.pdf',
    tradition: 'Jaimini / Parashari (modern)',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'A modern book. Cited for its definition of Kantaka Sani (footnote 52) and the '
        + 'recitation it prescribes; the Sanskrit text of the recitation is not reproduced.',
      verified: false,
      toConfirm: 'Edition and publisher not read from the scan.',
    },
  },
  {
    id: 'SHUBHAKARAN_NAKSHATRA_PREDICTIONS_1',
    title: 'Nakshatra based predictions, part 1',
    titleTa: 'நட்சத்திர அடிப்படையிலான பலன்கள், பகுதி 1',
    author: 'K.T. Shubhakaran',
    file: 'nakshatra-based-predictions-part1-shubhakaran/raw-scans/full-scan.pdf',
    tradition: 'Parashari (modern)',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'A modern book. Cited for the usual houses of Sade-Sathi and Ashtama Sani, the '
        + 'author\'s own degree-based variant (recorded, not applied) and two recitation '
        + 'remedies; the Sanskrit text of the recitations is not reproduced.',
      verified: false,
      toConfirm: 'Edition and publisher not read from the scan.',
    },
  },
  {
    id: 'MANSAGARI_VOL2_VASUDEV',
    title: 'Maansagari, Volume II',
    titleTa: 'மானசாகரி, தொகுதி 2',
    author: 'Harji (original); P.K. Vasudev (English translation and commentary)',
    file: 'mansagari-vol2-vasudev/raw-scans/full-scan.pdf',
    tradition: 'Parashari (classical Sanskrit verse with modern commentary)',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'The Sanskrit verses are old; the English translation and the translator\'s notes are modern '
        + 'and in copyright. The Mangala verse is a classical statement; the list of cancellations beside it '
        + 'is the translator\'s own gathering, which he says is "not sacrosanct", and is cited as such.',
      verified: false,
      toConfirm: 'Edition and publisher were not read from the scan; the translation should be treated as in copyright.',
    },
  },
  {
    id: 'BHAGAT_PRACTICAL_ASTROLOGICAL_REMEDIES',
    title: 'Practical Astrological Remedies',
    titleTa: 'நடைமுறை ஜோதிடப் பரிகாரங்கள்',
    author: 'S.P. Bhagat',
    file: 'practical-astrological-remedies-bhagat/raw-scans/full-scan.pdf',
    tradition: 'Parashari / popular remedies (modern)',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: 'A modern book. Cited for the Manglik Dosha chapter: the houses, a list of cancellations and '
        + 'the remedies it records. Nothing is reproduced beyond a short paraphrase.',
      verified: false,
      toConfirm: 'Edition and publisher were not read from the scan.',
    },
  },
  {
    id: 'KAPOOR_REMEDIAL_MEASURES',
    title: 'Remedial Measures in Astrology',
    titleTa: 'ஜோதிடப் பரிகார முறைகள்',
    author: 'G.S. Kapoor',
    file: 'remedial-measures-in-astrology-kapoor/raw-scans/full-scan.pdf',
    tradition: 'Parashari / remedies (modern)',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: "A modern book. Cited for the gem of each planet (quoting the Jataka Parijata verse, whose English rendering omits Saturn), the \"ruling stone\" table by Ascendant, and the rules about which lords' gems to strengthen. Short paraphrase only.",
      verified: false,
      toConfirm: "Edition and publisher not read from the scan.",
    },
  },
  {
    id: 'TILAK_RAJ_REMEDIES',
    title: 'Remedies of Astrological Science',
    titleTa: 'ஜோதிட அறிவியல் பரிகாரங்கள்',
    author: 'Tilak Raj',
    file: 'remedies-of-astrological-science-tilak-raj/raw-scans/full-scan.pdf',
    tradition: 'Parashari / remedies (modern)',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: "A modern book. Cited for a verdict on each gem for each of the twelve Ascendants, with the house lordships it relies on. Paraphrased as structured verdicts; its sentences are not reproduced.",
      verified: false,
      toConfirm: "Edition and publisher not read from the scan.",
    },
  },
  {
    id: 'RAJ_KUMAR_ASTRO_REMEDIES',
    title: 'Astro Remedies: A Vedic Approach',
    titleTa: 'ஜோதிடப் பரிகாரங்கள்: வேத முறை',
    author: 'Raj Kumar',
    file: 'astro-remedies-a-vedic-approach-raj-kumar/raw-scans/full-scan.pdf',
    tradition: 'Parashari / remedies (modern)',
    rights: {
      status: 'RESTRICTED',
      mayShip: false,
      mayQuoteShort: true,
      note: "A modern book. Cited for the traditional wear-in-dasha view, the later wear-for-long-term practice by house lordship, and a benefic/malefic gem table by Ascendant or Moon sign. Printed page numbers were not read; the PDF page is cited.",
      verified: false,
      toConfirm: "Edition, publisher and printed page numbers not read from the scan.",
    },
  },
  {
    id: 'TRADITIONAL_CONVENTION',
    title: 'Widely-practised traditional convention (no single classical verse)',
    titleTa: 'மரபு வழக்கம் (ஒரே செய்யுள் ஆதாரம் இல்லை)',
    author: null,
    file: null,
    tradition: 'Parashari (popular convention)',
    rights: {
      status: 'PERMITTED',
      mayShip: true,
      mayQuoteShort: true,
      note: 'Not a text. This entry exists so a rule that comes from common '
        + 'practice rather than a book is labelled as such instead of being '
        + 'given a citation it does not have.',
      verified: true,
      toConfirm: null,
    },
  },
];

const BY_ID = new Map(SOURCES.map((s) => [s.id, s]));

/**
 * Sources are also matched by the `title` the engines write inline, because
 * that is what `attachSource` stamps onto a result — the id exists only here.
 */
const BY_TITLE = new Map(SOURCES.map((s) => [s.title, s]));
BY_TITLE.set('Kuja (Mangal) Dosha & Kala Sarpa Dosha — traditional vivaha/graha-dosha rules',
  BY_ID.get('TRADITIONAL_CONVENTION'));
for (const partial of [
  'Dasha Chakra in Astrology', 'Nadi Chakra in Astrology', 'Rashi Chakra in Astrology',
  'Saravatobhadra Chakra in Astrology', 'Yantra Chakra in Astrology',
]) {
  BY_TITLE.set(partial, BY_ID.get('IJATET_CHAKRAS_2022'));
}

function getSource(id) {
  return BY_ID.get(id) ?? null;
}

/** Resolves the `title` an engine stamped back to a registered source. */
function resolveByTitle(title) {
  return BY_TITLE.get(title) ?? null;
}

/** The sources whose terms still need someone to read them. */
function unresolvedRights() {
  return SOURCES.filter((s) => s.rights.status !== 'PERMITTED' || !s.rights.verified);
}

module.exports = {
  SOURCES, RIGHTS_STATUSES, getSource, resolveByTitle, unresolvedRights,
};
