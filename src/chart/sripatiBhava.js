/**
 * Sripati bhava (Sripatipaddhati Adhyaya I, slokas 6-11, printed pp.10-14; the same reading is Santhanam's note to BPHS ch.5 v.9,
 * printed pp.39-40 of the e-text, from the Chaukhamba edition): the twelve trisected points are the bhavas themselves (their
 * middles); half the sum of two contiguous bhavas is their Sandhi; a planet short of a Sandhi gives the effect of the preceding
 * bhava, past it that of the next. The effect is full at the bhava point and grows or shrinks by the rule of three with the
 * distance to the nearer Sandhi over the Bhavamsa (the distance from the bhava point to that Sandhi): Aroha before the bhava
 * point, Avaroha after it.
 */

const norm = (x) => ((x % 360) + 360) % 360;
const forward = (from, to) => norm(to - from);

const SOURCE = {
  title: 'Sripatipaddhati',
  author: 'V. Subrahmanya Sastri (translation)',
  tradition: 'Parashari',
  file: 'Jyotish_Sripatipaddhati.pdf',
  pageLocus: 'Adhyaya I slokas 6-11, printed pp.10-14: Bhavas by trisection (sl.6-7), Sandhi = half the sum of contiguous bhavas (sl.8), full effect at the Bhavamsa distance and rule of three (sl.9-10); worked example Sun 0-17-43-30 = .7694',
};

/** The bhava points from the four angles: Lagna, 4th, 7th, 10th (1-indexed bhava 1..12 in the result's slots 0..11). */
function bhavaPoints(lagna, fourth, seventh, tenth) {
  const angles = [lagna, fourth, seventh, tenth];
  const out = [];
  for (let k = 0; k < 4; k += 1) {
    const a = angles[k];
    const gap = forward(a, angles[(k + 1) % 4]);
    out.push(norm(a), norm(a + gap / 3), norm(a + (2 * gap) / 3));
  }
  return out;
}

/** Sandhi k (0-based) lies between bhava k and bhava k+1: half the sum, along the forward arc. */
function sandhis(points) {
  return points.map((p, k) => norm(p + forward(p, points[(k + 1) % 12]) / 2));
}

/**
 * @param points the twelve bhava points (index 0 = 1st bhava)
 * @returns {bhava (1-12), fraction (0-1), phase 'aroha'|'avaroha', nearestSandhi, bhavamsa, distance}
 */
function bhavaEffect(longitude, points) {
  const s = sandhis(points);
  const lon = norm(longitude);
  for (let k = 0; k < 12; k += 1) {
    const start = s[(k + 11) % 12];
    const end = s[k];
    const span = forward(start, end);
    const off = forward(start, lon);
    if (off < span) {
      const toPoint = forward(start, points[k]);
      const before = off < toPoint;
      const sandhi = before ? start : end;
      const bhavamsa = before ? toPoint : forward(points[k], end);
      const distance = before ? off : forward(lon, end);
      return { bhava: k + 1, fraction: bhavamsa === 0 ? 1 : distance / bhavamsa, phase: before ? 'aroha' : 'avaroha', nearestSandhi: sandhi, bhavamsa, distance };
    }
  }
  throw new Error('longitude not placed');
}

module.exports = { bhavaPoints, sandhis, bhavaEffect, SOURCE };
