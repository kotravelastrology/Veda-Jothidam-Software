/**
 * "Search for Charts" (PL9 Research menu): filters the saved-chart list by a free-text query. The query is matched, ignoring case and surrounding spaces,
 * against the chart's name, its description, the name, date, time and place of birth. Every word of the query must appear somewhere in those fields,
 * so "chennai 1990" finds a Chennai chart born in 1990. An empty query returns the list unchanged.
 */

const fieldsOf = (chart) => [
  chart.name,
  chart.description,
  chart.birthData?.name,
  chart.birthData?.dateOfBirth,
  chart.birthData?.timeOfBirth,
  chart.birthData?.place,
].filter((v) => typeof v === 'string' && v.length > 0).join(' ').toLowerCase();

/** @param charts SavedChart[] (as the chart library returns them) @param query the text typed in the search box */
function filterSavedCharts(charts, query) {
  const words = String(query ?? '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return charts;
  return charts.filter((chart) => {
    const haystack = fieldsOf(chart);
    return words.every((word) => haystack.includes(word));
  });
}

module.exports = { filterSavedCharts };
