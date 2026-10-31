/**
 * The house a sign is when counted from a lagna sign: the lagna's own sign is the 1st, the next sign the 2nd. The animated transits
 * wheel numbers the houses this way round each chart, and the partner worksheet reads one sky from two lagnas with it. No
 * calculation beyond the count, so the browser can use it.
 */
function houseFrom(lagnaSign, sign) {
  return ((sign - lagnaSign + 12) % 12) + 1;
}

module.exports = { houseFrom };
