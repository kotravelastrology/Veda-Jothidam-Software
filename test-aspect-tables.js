const assert = require('assert');
const { aspectFraction, aspectVirupa } = require('./src/chart/aspectTables');

// Slabs by house (BPHS ch.26 v.2-5, Santhanam printed p.255): 3rd and 10th 1/4, 5th and 9th 1/2, 4th and 8th 3/4, 7th full.
assert.strictEqual(aspectFraction('Sun', 3), '1/4');
assert.strictEqual(aspectFraction('Sun', 5), '1/2');
assert.strictEqual(aspectFraction('Sun', 4), '3/4');
assert.strictEqual(aspectFraction('Sun', 7), '4/4');
assert.strictEqual(aspectFraction('Sun', 2), null, 'the 2nd house is no aspect');

// Special aspects of Mars (4th, 8th), Jupiter (5th, 9th) and Saturn (3rd, 10th) are full, as PL9 prints them.
assert.strictEqual(aspectFraction('Mars', 8), '4/4');
assert.strictEqual(aspectFraction('Jupiter', 9), '4/4');
assert.strictEqual(aspectFraction('Saturn', 10), '4/4');
assert.strictEqual(aspectFraction('Mars', 5), '1/2', 'Mars has no special 5th, so the 5th is 1/2');

// Virupa values, each checked against a printed PL9 cell (aniruddha_HC4 page 12) or a BPHS worked rule.
const near = (got, want) => assert.ok(Math.abs(got - want) < 0.05, `got ${got}, want ${want}`);
near(aspectVirupa('Moon', 173.8), 47.6); // general Rule 5: (angle - 150) x 2; PL9 Sun<-Moon 47
near(aspectVirupa('Jupiter', 62.5), 17.5); // general Rule 2: (angle - 60) + 15; PL9 Sun<-Jupiter 17
near(aspectVirupa('Sun', 97.4), 41.3); // general Rule 3: (120 - angle) / 2 + 30; PL9 Saturn<-Sun 41
near(aspectVirupa('Mars', 118.6), 31.4); // Mars at three signs: 60 - degrees; PL9 Sun<-Mars 31
near(aspectVirupa('Mars', 216), 54); // Mars at seven signs: 60 - degrees; PL9 Saturn<-Mars 54
near(aspectVirupa('Mars', 186), 60); // Mars at six signs: one rupa; PL9 bhava IV<-Mars 60
near(aspectVirupa('Mars', 66), 24); // Mars above two signs (60-90): 1.5 x degrees + 15 (23.85 at 65.9 deg)
near(aspectVirupa('Jupiter', 105), 52.5); // Jupiter at three signs: half the degrees + 45 (r = 15)
near(aspectVirupa('Jupiter', 165), 30); // Jupiter at five signs has no special rule: general Rule 5, (165 - 150) x 2
near(aspectVirupa('Jupiter', 145), 35); // Jupiter at four signs (its 5th): 60 - degrees (r = 25)
near(aspectVirupa('Saturn', 88.9), 45.55); // Saturn above two signs (60-90): 60 - (angle - 60) / 2; PL9 Moon<-Saturn 45
near(aspectVirupa('Saturn', 262.6), 52.6); // Saturn above eight signs: degrees + 30; PL9 Sun<-Saturn 52
near(aspectVirupa('Saturn', 144), 6); // Saturn at four signs has no special rule: general Rule 4; PL9 Mars<-Saturn prints 5 (pinned)

console.log('test-aspect-tables: all assertions passed');
