/**
 * Source constants for the classical texts cited from several report modules.
 *
 * They live here, in a module that requires nothing, because the modules that
 * cite them require one another (saptashalakaTables ← lattaTables, moorthiTables
 * ← pada88Tables …) and a shared constant declared in one of them would make
 * the requires circular. Each name is unique in src: the citation scanner
 * resolves a `...NAME` spread by the constant's name across all of src.
 */

const PHALADEEPIKA_SASTRI = Object.freeze({
  title: 'Phaladeepika (V. Subrahmanya Sastri, 1950)',
  author: 'Mantreswara; V. Subrahmanya Sastri (translator), 2nd edition 1950',
  file: 'phaladeepika-subrahmanya-sastri-1950/raw-scans/full-scan.pdf',
  tradition: 'Classical Sanskrit (South Indian, c. 14th century) with an English translation',
});

const PHALADEEPIKA_KAPOOR = Object.freeze({
  title: 'Phala Deepika (G.S. Kapoor, e-text)',
  author: 'Mantreswara; G.S. Kapoor (translation, commentary and annotation)',
  file: 'phaladeepika-kapoor-etext/raw-scans/full-scan.pdf',
  tradition: 'Classical Sanskrit with a modern English translation (retyped e-text)',
});

const JATAKA_PARIJATA_VOL2 = Object.freeze({
  title: 'Jataka Parijata, Vol. II',
  author: 'Vaidyanatha Dikshita (original); V. Subrahmanya Sastri (English translation and notes)',
  file: 'jataka-parijata-vol2-subrahmanya-sastri/raw-scans/full-scan.pdf',
  tradition: 'Classical Sanskrit (medieval) with a modern English translation',
});

const KALAPRAKASIKA = Object.freeze({
  title: 'Kalaprakasika',
  author: 'N.P. Subramania Iyer (translator)',
  file: 'kalaprakasika-nps-iyer-1982/raw-scans/full-scan.pdf',
  tradition: 'Tamil / Sanskrit classical (muhurta)',
});

const BRIHAT_JATAKA_CHIDAMBARAM = Object.freeze({
  title: 'The Brihat Jataka of Varaha Mihira (N. Chidambaram Aiyar, 1905)',
  author: 'Varahamihira; N. Chidambaram Aiyar (English translation and notes)',
  file: 'brihat-jataka-chidambaram-1905/raw-scans/full-scan.pdf',
  tradition: 'Classical Sanskrit (6th century) with an English translation',
});

module.exports = { PHALADEEPIKA_SASTRI, PHALADEEPIKA_KAPOOR, JATAKA_PARIJATA_VOL2, KALAPRAKASIKA, BRIHAT_JATAKA_CHIDAMBARAM };
