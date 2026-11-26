/**
 * The tabs of the phone's bottom bar (BottomNav.tsx). Plain data, so a test can check that every tab is a page of the program.
 * The sixth place is the ☰ button, which opens the menu drawer with every page.
 */
const BOTTOM_NAV = Object.freeze([
  Object.freeze({ key: 'home', route: '/', icon: '🏠', ta: 'முகப்பு', en: 'Home' }),
  Object.freeze({ key: 'worksheet', route: '/worksheet', icon: '🪔', ta: 'ஜாதகம்', en: 'Chart' }),
  Object.freeze({ key: 'dasha', route: '/dasha-timeline', icon: '⏳', ta: 'தசை', en: 'Dasha' }),
  Object.freeze({ key: 'calendar', route: '/tamil-calendar', icon: '📆', ta: 'நாட்காட்டி', en: 'Calendar' }),
]);

/** Whether `pathname` is the tab's page (the home tab only on `/` itself, the others also on their sub-pages). */
function isActiveTab(route, pathname) {
  if (route === '/') return pathname === '/';
  return pathname === route || pathname.startsWith(`${route}/`);
}

module.exports = { BOTTOM_NAV, isActiveTab };
