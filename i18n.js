// Language: the browser's language if supported, else English; switchable on the start screen and in Profile.
// UI and content strings are keyed by their original (Russian or English) text; a missing key falls back to the original.
const LANGS = { en: 'English', ru: 'Русский', es: 'Español' };
// No saved choice: follow the browser language when it is one we have, otherwise English.
const LANG = (() => {
  const has = l => typeof l === 'string' && Object.prototype.hasOwnProperty.call(LANGS, l);
  try { const l = localStorage.getItem('aiio-lang'); if (has(l)) return l; } catch (e) {}
  const nav = ((navigator.languages && navigator.languages[0]) || navigator.language || '').slice(0, 2).toLowerCase();
  return has(nav) ? nav : 'en';
})();
const LOCALE = { en: 'en-US', ru: 'ru-RU', es: 'es-419' }[LANG];
const DICT = {};
function tr(key, ...args) {
  const s = Object.prototype.hasOwnProperty.call(DICT, key) ? DICT[key] : key;
  return args.length ? s.replace(/\{(\d+)\}/g, (m, i) => args[i]) : s;
}
function setLang(l) { try { localStorage.setItem('aiio-lang', l); } catch (e) {} location.reload(); }
document.documentElement.lang = LANG;
if (LANG !== 'ru') document.write('<script src="lang/' + LANG + '.js"><\/script>');
