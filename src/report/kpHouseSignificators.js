/**
 * KP significators of each house, in the four levels the books list (Astro Secrets & Krishnamurti Padhdhati, Part 2, M.P. Shanmugam,
 * reprinting T.R. Raghunath: printed pp.148-149 and 237-238):
 *   1. planets in the star of an occupant of the house   (the strongest, p.148 i)
 *   2. the occupants                                      (p.237 Method A 2)
 *   3. planets in the star of the owner of the house      (strong when no planet occupies the house, p.149 iii)
 *   4. the owner                                          (strong only if the house is empty and no planet is in the owner's star, p.149 iv)
 * "Golden rule" (p.237): with three or more planets from levels 1 and 2, stop there and go to conjunction/aspect.
 * The owner of a house is taken as the sign lord of its cusp. Not computed: conjunction and aspect of a significator (p.149 II-III;
 * the book says "Western aspects" and gives no orb), the star lord / sub lord of a cusp (Horary only, p.238).
 * @param kp { positions:[{name, house, starLord}], cusps:[{number, signLord}] }
 */
const SOURCE = {
  title: 'Astro Secrets and Krishnamurti Padhdhati, Part 2',
  author: 'M.P. Shanmugam',
  tradition: 'Krishnamurti Paddhati (KP)',
  file: 'C52-astrosecrets-and-kp-part2.pdf',
  pageLocus: 'T.R. Raghunath\'s list of significators, printed pp.148-149 (i-iv), and Method A with the golden rule, printed pp.237-238',
};

function houseSignificators(kp) {
  const planets = kp.positions;
  return kp.cusps.map((cusp) => {
    const occupants = planets.filter((p) => p.house === cusp.number).map((p) => p.name);
    const owner = cusp.signLord;
    const inStarOf = (lords) => planets.filter((p) => lords.includes(p.starLord)).map((p) => p.name);
    const starOfOccupants = inStarOf(occupants);
    const starOfOwner = inStarOf([owner]);
    const firstTwo = [...new Set([...starOfOccupants, ...occupants])];
    const ownerIsStrong = occupants.length === 0 && starOfOwner.length === 0;
    return {
      house: cusp.number,
      owner,
      level1: starOfOccupants,
      level2: occupants,
      level3: starOfOwner,
      level4: [owner],
      // the book's conditions for the lower levels
      level3Strong: occupants.length === 0,
      level4Strong: ownerIsStrong,
      goldenRuleStop: firstTwo.length >= 3,
    };
  });
}

module.exports = { houseSignificators, SOURCE };
