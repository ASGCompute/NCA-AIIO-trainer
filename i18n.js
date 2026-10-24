// Language: English by default, Russian and Spanish via the switcher in Profile.
// UI and content strings are keyed by their original (Russian or English) text; a missing key falls back to the original.
const LANGS = { en: 'English', ru: 'Русский', es: 'Español' };
const LANG = (() => { try { const l = localStorage.getItem('aiio-lang'); return LANGS[l] ? l : 'en'; } catch (e) { return 'en'; } })();
const LOCALE = { en: 'en-US', ru: 'ru-RU', es: 'es-ES' }[LANG];
const DICT = {};
function tr(key, ...args) {
  const s = Object.prototype.hasOwnProperty.call(DICT, key) ? DICT[key] : key;
  return args.length ? s.replace(/\{(\d+)\}/g, (m, i) => args[i]) : s;
}
function setLang(l) { try { localStorage.setItem('aiio-lang', l); } catch (e) {} location.reload(); }
document.documentElement.lang = LANG;
if (LANG !== 'ru') document.write('<script src="lang/' + LANG + '.js"><\/script>');
