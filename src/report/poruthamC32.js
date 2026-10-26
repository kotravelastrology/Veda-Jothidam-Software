/**
 * The porutham tables as K.S. Krishnamurti's Reader IV ("Marriage and Married Life", corpus C32) teaches them in its opening
 * chapter, read from the page images (printed pp.17-44; printed = PDF - 3). Compared with poruthamTables.js (Kalaprakasika) by
 * test-porutham-c32.js. Indices: stars 0-26 (Ashwini..Revati), rasis 0-11.
 */
const SOURCE = {
  title: 'Krishnamurti Padhdhati, Reader IV: Marriage and Married Life',
  author: 'K.S. Krishnamurti',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C32_KP_Reader_IV_Marriage_Children_KSK.pdf',
  pageLocus: 'Opening chapter on Dasa Porutham, printed pp.17-44',
};

const names = ['Aswini', 'Bharani', 'Karthikai', 'Rohini', 'Mrigasirisha', 'Arudhra', 'Punarvasu', 'Pushyam', 'Ashlesha', 'Makam', 'Pooram', 'Uthiram', 'Hastham', 'Chithra', 'Swathi', 'Visakam', 'Anuradha', 'Jyeshta', 'Moolam', 'Poorvashada', 'Uthrashada', 'Sravanam', 'Dhanishta', 'Sathabisha', 'Poorattadhi', 'Uthirattadhi', 'Revati'];
const ix = (...n) => n.map((s) => {
  const i = names.indexOf(s);
  if (i < 0) throw new Error(`unknown star ${s}`);
  return i;
});

module.exports = {
  SOURCE,
  /** printed p.29: nine stars each. */
  GANA: {
    rakshasa: ix('Karthikai', 'Ashlesha', 'Makam', 'Chithra', 'Visakam', 'Jyeshta', 'Moolam', 'Dhanishta', 'Sathabisha'),
    manushya: ix('Bharani', 'Rohini', 'Arudhra', 'Pooram', 'Poorvashada', 'Poorattadhi', 'Uthiram', 'Uthrashada', 'Uthirattadhi'),
    deva: ix('Aswini', 'Mrigasirisha', 'Punarvasu', 'Pushyam', 'Hastham', 'Swathi', 'Anuradha', 'Sravanam', 'Revati'),
  },
  /** printed pp.29-30: the 4th, 7th, 10th ... counted from the bride's star. */
  MAHENDRA_COUNTS: [4, 7, 10, 13, 16, 19, 22, 25],
  /** printed p.31: 13th and above; some sages say from the 8th. */
  STREE_DEERGHA_MINIMUM: 13,
  /** printed pp.31-32, as printed: Uthiram alone is Camel; Dhanishta and Poorattadhi are Human. */
  YONI: {
    horse: ix('Aswini', 'Sathabisha'), elephant: ix('Bharani', 'Revati'), goat: ix('Karthikai', 'Pushyam'),
    snake: ix('Rohini', 'Mrigasirisha'), dog: ix('Arudhra', 'Moolam'), cat: ix('Punarvasu', 'Ashlesha'),
    rat: ix('Makam', 'Pooram'), camel: ix('Uthiram'), buffalo: ix('Hastham', 'Swathi'),
    tiger: ix('Chithra', 'Visakam'), deer: ix('Anuradha', 'Jyeshta'), monkey: ix('Poorvashada', 'Sravanam'),
    cow: ix('Uthrashada', 'Uthirattadhi'), human: ix('Dhanishta', 'Poorattadhi'),
  },
  /** printed pp.32-33. */
  YONI_HOSTILE: [['monkey', 'goat'], ['goat', 'elephant'], ['horse', 'buffalo'], ['cow', 'tiger'], ['rat', 'cat'], ['snake', 'rat'], ['deer', 'dog']],
  /** printed p.33: the boy's rasi counted from the bride's: 2 to 6 are bad. */
  RASI_BAD_COUNTS: [2, 3, 4, 5, 6],
  /** printed p.36: bride's rasi to bridegroom's rasi(s). */
  VASYA: {
    0: [4, 7], 1: [3, 6], 2: [5], 3: [7, 8], 4: [6], 5: [2, 11], 6: [9], 7: [3, 5], 8: [11], 9: [0, 10], 10: [0], 11: [9],
  },
  /** printed p.37: the five Rajju bands (Aroha and Avaroha together). */
  RAJJU: {
    foot: ix('Aswini', 'Makam', 'Moolam', 'Ashlesha', 'Jyeshta', 'Revati'),
    thigh: ix('Bharani', 'Pooram', 'Poorvashada', 'Pushyam', 'Anuradha', 'Uthirattadhi'),
    navel: ix('Karthikai', 'Uthiram', 'Uthrashada', 'Punarvasu', 'Visakam', 'Poorattadhi'),
    neck: ix('Rohini', 'Hastham', 'Sravanam', 'Arudhra', 'Swathi', 'Sathabisha'),
    head: ix('Mrigasirisha', 'Chithra', 'Dhanishta'),
  },
  /** printed pp.41-42: Vedha pairs; for Pooram and Uthiram there is no Vedha. */
  VEDHA_PAIRS: [ix('Aswini', 'Jyeshta'), ix('Bharani', 'Pushyam'), ix('Karthikai', 'Visakam'), ix('Rohini', 'Swathi'), ix('Arudhra', 'Sravanam'),
    ix('Punarvasu', 'Uthrashada'), ix('Pushyam', 'Poorvashada'), ix('Ashlesha', 'Moolam'), ix('Makam', 'Revati'), ix('Mrigasirisha', 'Chithra')],
  /** printed p.24: a common janma star. Listed stars only; the book counts 8 excellent, 11 fair and 8 to be ignored. */
  SAME_STAR: {
    excellent: ix('Rohini', 'Arudhra', 'Makam', 'Hastham', 'Visakam', 'Sravanam', 'Uthirattadhi'),
    fair: ix('Aswini', 'Karthikai', 'Mrigasirisha', 'Pushyam', 'Poorvashada', 'Uthrashada'),
    ignored: ix('Bharani', 'Ashlesha', 'Swathi', 'Jyeshta', 'Moolam', 'Dhanishta', 'Sathabisha', 'Poorattadhi'),
  },
};
