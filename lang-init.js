/* Runs synchronously in <head> to set the page language/direction
   BEFORE first paint, avoiding a flash of LTR English for Arabic users.
   Only the whitelisted values "en" / "ar" are ever accepted. */
(function () {
  var SUPPORTED = ["en", "ar"];
  var pick = null;
  try {
    var fromUrl = new URLSearchParams(window.location.search).get("lang");
    var fromStore = window.localStorage.getItem("portfolioLang");
    var fromBrowser = ((navigator.language || "").toLowerCase().indexOf("ar") === 0) ? "ar" : "en";
    var candidates = [fromUrl, fromStore, fromBrowser];
    for (var i = 0; i < candidates.length; i++) {
      if (SUPPORTED.indexOf(candidates[i]) !== -1) { pick = candidates[i]; break; }
    }
  } catch (e) { /* storage may be blocked (private mode) — fall through */ }
  pick = pick || "en";
  document.documentElement.lang = pick;
  document.documentElement.dir = pick === "ar" ? "rtl" : "ltr";
})();
