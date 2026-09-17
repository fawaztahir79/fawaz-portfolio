// Build-time sanity check: every data-i18n key in index.html must exist in both
// EN and AR dictionaries, and the security meta-headers must be present.
"use strict";
const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");
const src = fs.readFileSync("script.js", "utf8");

const m = src.match(/const T = Object\.freeze\(([\s\S]*?)\n\}\);/);
const T = eval("(" + m[1] + "\n})");
const keys = new Set();
for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) keys.add(m[1]);
for (const m of html.matchAll(/data-i18n-attr="[^:"]+:([^"]+)"/g)) keys.add(m[1]);

let fail = false;
for (const l of ["en", "ar"]) {
  const missing = [...keys].filter(k => typeof T[l][k] !== "string");
  if (missing.length) { console.error(`Missing ${l} keys:`, missing); fail = true; }
}
const onlyEn = Object.keys(T.en).filter(k => !(k in T.ar));
const onlyAr = Object.keys(T.ar).filter(k => !(k in T.en));
if (onlyEn.length || onlyAr.length) { console.error("Dictionary mismatch", { onlyEn, onlyAr }); fail = true; }

const must = ['http-equiv="Content-Security-Policy"', 'name="referrer"', 'rel="noopener noreferrer"'];
for (const s of must) if (!html.includes(s)) { console.error("Missing security marker:", s); fail = true; }
if (/innerHTML/.test(src)) { console.error("innerHTML is not allowed in script.js"); fail = true; }

console.log(`i18n keys in HTML: ${keys.size} | en: ${Object.keys(T.en).length} | ar: ${Object.keys(T.ar).length}`);
if (fail) process.exit(1);
console.log("All checks passed ✔");
