/* =========================================================================
   Fawaz Eltahir — portfolio behaviour
   - Bilingual EN/AR switcher (text nodes only → no markup injection)
   - Light/dark theme with saved preference
   - Mobile menu, back-to-top, obfuscated contact details
   Strict mode, no third-party code, no network calls.
   ========================================================================= */
"use strict";

const SUPPORTED = ["en", "ar"];
const STORAGE_LANG = "portfolioLang";
const STORAGE_THEME = "portfolioTheme";

const T = Object.freeze({
en: {
pageTitle:"Fawaz Eltahir | Senior Accounts Payable Accountant",
metaDesc:"Fawaz Eltahir Ahmed Atiatallah — Senior Accounts Payable Accountant | Hospitality Accounting in Saudi Arabia",
skipLink:"Skip to main content",menuOpen:"Open menu",menuClose:"Close menu",themeToggle:"Toggle dark mode",backToTop:"Back to top",
photoAlt:"Fawaz Eltahir professional portrait",
navTitle:"Senior Accounts Payable Accountant",navProfile:"Profile",navMetrics:"AP Metrics",navExperience:"Experience",navSystems:"Systems",navCertificates:"Certificates",navContact:"Contact",
kicker:"Hospitality Accounting • Accounts Payable • Hotel Finance",name:"Fawaz Eltahir Ahmed Atiatallah",role:"Senior Accounts Payable Accountant",
heroText:"Hospitality accounting professional with extensive hotel accounting experience across Sudan and Saudi Arabia. Experienced in Accounts Payable, supplier reconciliation, invoice processing, payment processing, VAT accounting, journal entries, bank reconciliation, revenue accounting, income audit, and month-end and year-end closing.",
visualCv:"Visual CV",linkedin:"LinkedIn",sar10m:"SAR 10M+",statInvoices:"Supplier invoices / month",statSuppliers:"Suppliers managed",statPayments:"Annual payments",statJv:"Journal entries / month",statAccuracy:"Closing accuracy",statAudit:"Audit findings",
profileHeading:"Professional Profile",profileText:"Hospitality accounting professional with extensive hotel accounting experience across Sudan and Saudi Arabia. Currently working at WAVES Hotel, managing approximately 400–650 supplier invoices per month, around 120 suppliers, annual supplier payments of approximately SAR 10 million, and 120–150 journal entries monthly. Experienced in supporting FY2024 and FY2025 closing and external audit activities, with closing accuracy exceeding 98%.",
metricsHeading:"Accounts Payable & Closing Performance",metric1:"Invoices / Month",metric2:"Suppliers",metric3:"Annual Payments",metric4:"Journal Entries / Month",metric5:"Closing Accuracy",metric6:"Audit Findings",
metricsText:"Supported FY2024 and FY2025 general closing and worked with the auditor approximately one month before the latest review. The reported results were excellent, with audit findings not exceeding 2% and closing accuracy above 98%.",
experienceHeading:"Professional Experience",
date1:"September 2024 — Present",org1:"WAVES Hotel — Umluj, Tabuk, Saudi Arabia",
job1Title:"Senior Accounts Payable Accountant",j1b1:"Process approximately 400–650 supplier invoices monthly.",j1b2:"Manage AP activities for approximately 120 suppliers.",j1b3:"Support annual supplier payments of approximately SAR 10 million.",j1b4:"Prepare approximately 120–150 journal entries monthly.",j1b5:"Perform supplier statement, account and bank reconciliations and investigate discrepancies.",j1b6:"Review invoices and supporting documentation before payment processing.",j1b7:"Record and reconcile VAT Input transactions.",j1b8:"Support month-end and year-end closing, including reconciliations, accruals, outstanding balances and supporting schedules.",j1b9:"Supported FY2024 and FY2025 closing and external audit activities; closing accuracy exceeded 98% and audit findings were below 2%.",
date2:"August 2016 — November 2020",org2:"BRAIRA Hotels & Resorts — Saudi Arabia",
job2Title:"Revenue Accountant",j2b1:"Audited and reconciled daily hotel revenue and reviewed revenue transactions for accuracy and completeness.",j2b2:"Investigated discrepancies between operational systems, revenue reports and accounting records.",j2b3:"Supported revenue control and internal financial control procedures.",j2b4:"Prepared financial reports, supporting schedules and audit documentation.",
date3:"November 2020 — April 2024",
job3Title:"Owner — Mobile Phones & Accessories Trading",privateBusiness:"Private Business",j3b1:"Managed purchasing, sales, suppliers, customers, inventory, cash flow and daily operations.",j3b2:"Monitored supplier balances, business financial records and profitability.",j3b3:"Negotiated with suppliers and managed purchasing decisions according to demand and available capital.",
date4:"November 2009 — August 2016",org4:"Al Salam Rotana — Sudan",
job4Title:"Outlet Auditor",j4b1:"Audited daily hotel outlet sales and financial transactions.",j4b2:"Reviewed cash collections and POS transactions and reconciled outlet sales with cash and system records.",j4b3:"Investigated discrepancies and reported exceptions to relevant departments.",
date5:"March 2005 — August 2009",org5:"Hotel Palace — Sudan",
job5Title:"Waiter",j5b1:"Provided professional food and beverage service and processed guest orders accurately.",j5b2:"Coordinated with kitchen and service teams and maintained hotel service standards.",
systemsHeading:"Systems & Technical Skills",skillsHeading:"Core Competencies",
skill1:"Accounts Payable",skill2:"Invoice Processing",skill3:"Supplier & Vendor Management",skill4:"Supplier Reconciliation",skill5:"Payment Processing",skill6:"VAT Accounting",skill7:"Journal Entries",skill8:"General Ledger Support",skill9:"Bank Reconciliation",skill10:"Account Reconciliation",skill11:"Month-End Closing",skill12:"Year-End Closing",skill13:"Financial Reporting",skill14:"Expense Accounting",skill15:"Revenue Reconciliation",skill16:"Income Audit",skill17:"Internal Controls",skill18:"Audit Support",skill19:"Hotel Accounting",skill20:"Hospitality Finance",skill21:"Financial Data Confidentiality",skill22:"Segregation of Duties",skill23:"Fraud Prevention Controls",
secHeading:"Information Security & Financial Controls",
secIntro:"Handling supplier data, bank details and payment files requires more than accuracy — it requires disciplined information-security practice. The controls below are applied in day-to-day AP work.",
sec1Title:"Supplier Master Data & Bank-Detail Verification",
sec1a:"Independent call-back verification of any new or changed supplier bank account before the first payment.",
sec1b:"Awareness of Business Email Compromise (BEC) and invoice-redirection fraud; suspicious change requests are escalated, never actioned from e-mail alone.",
sec2Title:"Segregation of Duties & Approval Workflow",
sec2a:"Invoice entry, approval and payment release performed by separate roles; three-way matching (PO, GRN, invoice) before posting.",
sec2b:"Duplicate-invoice and duplicate-payment checks embedded in the monthly routine.",
sec3Title:"Access Control & System Hygiene",
sec3a:"Least-privilege access in SunSystems / Opera; no shared credentials; workstation locked whenever unattended.",
sec3b:"Multi-factor authentication on e-mail and banking portals; periodic review of user access rights with IT.",
sec4Title:"Data Confidentiality & Audit Trail",
sec4a:"Financial files shared only through approved channels; sensitive documents password-protected and retained per policy.",
sec4b:"Complete, traceable supporting documentation for every journal entry and payment — the foundation of <2% audit findings.",
certHeading:"Education, Certifications & Awards",eduTitle:"Education & Professional Certificates",edu1:"Certified Business and Finance Professional (CBFP) — IAPPD, July 2024",edu2:"Microsoft Certified IT Professional (MCITP) — Zoomtech, 2013",edu3:"English Language Diploma — Zoomtech, 2013 — Grade A (80%)",edu4:"Computer Skills I Programme — Rotana",awardTitle:"Recognition & Service",award1:"Long Service Award — Rotana, 5 Years of Service",award2:"Employee Recognition / Certificate of Appreciation — WAVES Hotel, March 2026",
languagesHeading:"Languages",arabic:"Arabic",arabicLevel:"Native",english:"English",englishLevel:"Professional Working Proficiency",contactHeading:"Let's Connect",contactText:"Open to Senior Accounts Payable Accountant, AP Supervisor and hotel finance opportunities.",phoneLabel:"Phone:",emailLabel:"Email:",
privacyNote:"This site sets no cookies and uses no analytics or third-party scripts. Only your language and theme preferences are stored locally in your browser."
},
ar: {
pageTitle:"فواز الطاهر | محاسب أول حسابات دائنة",
metaDesc:"فواز الطاهر أحمد عطية الله — محاسب أول حسابات دائنة | المحاسبة الفندقية في المملكة العربية السعودية",
skipLink:"الانتقال إلى المحتوى الرئيسي",menuOpen:"فتح القائمة",menuClose:"إغلاق القائمة",themeToggle:"تبديل الوضع الليلي",backToTop:"العودة إلى الأعلى",
photoAlt:"صورة شخصية مهنية لفواز الطاهر",
navTitle:"محاسب أول حسابات دائنة",navProfile:"الملف المهني",navMetrics:"مؤشرات الحسابات الدائنة",navExperience:"الخبرات",navSystems:"الأنظمة",navCertificates:"الشهادات",navContact:"التواصل",
kicker:"المحاسبة الفندقية • الحسابات الدائنة • المالية الفندقية",name:"فواز الطاهر أحمد عطية الله",role:"محاسب أول حسابات دائنة",
heroText:"محاسب متخصص في قطاع الضيافة، يمتلك خبرة واسعة في المحاسبة الفندقية في السودان والمملكة العربية السعودية. تشمل الخبرة الحسابات الدائنة، وتسويات الموردين، ومعالجة الفواتير والمدفوعات، والمحاسبة الضريبية، والقيود اليومية، وتسويات البنوك، ومحاسبة الإيرادات، وتدقيق الدخل، وإقفالات نهاية الشهر والسنة.",
visualCv:"السيرة الذاتية المرئية",linkedin:"LinkedIn",sar10m:"+10 مليون ر.س",statInvoices:"فاتورة مورد شهرياً",statSuppliers:"مورد تتم إدارتهم",statPayments:"المدفوعات السنوية",statJv:"قيد يومي شهرياً",statAccuracy:"دقة الإقفال",statAudit:"ملاحظات التدقيق",
profileHeading:"الملف المهني",profileText:"محاسب متخصص في قطاع الضيافة، يمتلك خبرة واسعة في المحاسبة الفندقية في السودان والمملكة العربية السعودية. يعمل حالياً في فندق ويفز، ويدير ما يقارب 400–650 فاتورة مورد شهرياً، ونحو 120 مورداً، ومدفوعات سنوية للموردين تقارب 10 ملايين ريال سعودي، إضافة إلى 120–150 قيداً محاسبياً شهرياً. لديه خبرة في دعم إقفالات عامي 2024 و2025 وأعمال التدقيق الخارجي، مع دقة إقفال تتجاوز 98%.",
metricsHeading:"أداء الحسابات الدائنة والإقفال",metric1:"فاتورة / شهر",metric2:"مورد",metric3:"المدفوعات السنوية",metric4:"قيد / شهر",metric5:"دقة الإقفال",metric6:"ملاحظات التدقيق",
metricsText:"ساهم في إقفال عامي 2024 و2025 والتعاون مع المدقق خلال المراجعة الأخيرة. كانت النتائج ممتازة، حيث لم تتجاوز ملاحظات التدقيق 2% وتجاوزت دقة الإقفال 98%.",
experienceHeading:"الخبرات المهنية",
date1:"سبتمبر 2024 — حتى الآن",org1:"فندق ويفز (WAVES) — أملج، تبوك، المملكة العربية السعودية",
job1Title:"محاسب أول حسابات دائنة",j1b1:"معالجة ما يقارب 400–650 فاتورة مورد شهرياً.",j1b2:"إدارة أنشطة الحسابات الدائنة لنحو 120 مورداً.",j1b3:"دعم مدفوعات سنوية للموردين تقارب 10 ملايين ريال سعودي.",j1b4:"إعداد ما يقارب 120–150 قيداً محاسبياً شهرياً.",j1b5:"تنفيذ تسويات كشوف الموردين والحسابات والبنوك والتحقيق في الفروقات.",j1b6:"مراجعة الفواتير والمستندات المؤيدة قبل إجراءات الدفع.",j1b7:"تسجيل وتسوية معاملات ضريبة القيمة المضافة على المدخلات.",j1b8:"دعم إقفالات نهاية الشهر والسنة، بما يشمل التسويات والمستحقات والأرصدة المعلقة والجداول المؤيدة.",j1b9:"المساهمة في إقفالات عامي 2024 و2025 وأعمال التدقيق الخارجي؛ تجاوزت دقة الإقفال 98% وكانت ملاحظات التدقيق أقل من 2%.",
date2:"أغسطس 2016 — نوفمبر 2020",org2:"فنادق ومنتجعات بريرا (BRAIRA) — المملكة العربية السعودية",
job2Title:"محاسب إيرادات",j2b1:"تدقيق وتسوية إيرادات الفندق اليومية ومراجعة معاملات الإيرادات للتأكد من دقتها واكتمالها.",j2b2:"التحقيق في الفروقات بين الأنظمة التشغيلية وتقارير الإيرادات والسجلات المحاسبية.",j2b3:"دعم إجراءات الرقابة على الإيرادات والرقابة المالية الداخلية.",j2b4:"إعداد التقارير المالية والجداول المؤيدة ومستندات التدقيق.",
date3:"نوفمبر 2020 — أبريل 2024",
job3Title:"مالك — تجارة الجوالات وملحقاتها",privateBusiness:"عمل خاص",j3b1:"إدارة المشتريات والمبيعات والموردين والعملاء والمخزون والتدفقات النقدية والعمليات اليومية.",j3b2:"متابعة أرصدة الموردين والسجلات المالية وربحية النشاط.",j3b3:"التفاوض مع الموردين وإدارة قرارات الشراء وفقاً للطلب ورأس المال المتاح.",
date4:"نوفمبر 2009 — أغسطس 2016",org4:"فندق السلام روتانا — السودان",
job4Title:"مدقق منافذ بيع",j4b1:"تدقيق مبيعات المنافذ الفندقية اليومية والمعاملات المالية.",j4b2:"مراجعة التحصيلات النقدية ومعاملات نقاط البيع وتسوية مبيعات المنافذ مع النقد وسجلات النظام.",j4b3:"التحقيق في الفروقات ورفع الاستثناءات إلى الإدارات المعنية.",
date5:"مارس 2005 — أغسطس 2009",org5:"فندق بالاس — السودان",
job5Title:"نادل",j5b1:"تقديم خدمات الأغذية والمشروبات بصورة مهنية ومعالجة طلبات النزلاء بدقة.",j5b2:"التنسيق مع فرق المطبخ والخدمة والمحافظة على معايير الخدمة الفندقية.",
systemsHeading:"الأنظمة والمهارات التقنية",skillsHeading:"الكفاءات الأساسية",
skill1:"الحسابات الدائنة",skill2:"معالجة الفواتير",skill3:"إدارة الموردين",skill4:"تسويات الموردين",skill5:"معالجة المدفوعات",skill6:"المحاسبة الضريبية",skill7:"القيود اليومية",skill8:"دعم دفتر الأستاذ العام",skill9:"التسويات البنكية",skill10:"تسويات الحسابات",skill11:"إقفال نهاية الشهر",skill12:"الإقفال السنوي",skill13:"التقارير المالية",skill14:"محاسبة المصروفات",skill15:"تسوية الإيرادات",skill16:"تدقيق الدخل",skill17:"الرقابة الداخلية",skill18:"دعم التدقيق",skill19:"المحاسبة الفندقية",skill20:"المالية الفندقية",skill21:"سرية البيانات المالية",skill22:"الفصل بين المهام",skill23:"ضوابط منع الاحتيال",
secHeading:"أمن المعلومات والضوابط المالية",
secIntro:"التعامل مع بيانات الموردين والتفاصيل البنكية وملفات الدفع لا يتطلب الدقة فحسب، بل يتطلب ممارسة منضبطة لأمن المعلومات. الضوابط التالية مطبّقة في العمل اليومي للحسابات الدائنة.",
sec1Title:"التحقق من بيانات الموردين والحسابات البنكية",
sec1a:"التحقق الهاتفي المستقل من أي حساب بنكي جديد أو مُعدَّل للمورد قبل أول عملية دفع.",
sec1b:"الوعي بهجمات اختراق البريد الإلكتروني التجاري (BEC) والاحتيال بتحويل مسار الفواتير؛ تُصعَّد طلبات التغيير المشبوهة ولا تُنفَّذ أبداً بناءً على البريد الإلكتروني وحده.",
sec2Title:"الفصل بين المهام ومسار الاعتماد",
sec2a:"إدخال الفواتير واعتمادها وإطلاق الدفع تتم عبر أدوار منفصلة؛ مع المطابقة الثلاثية (أمر الشراء، إشعار الاستلام، الفاتورة) قبل الترحيل.",
sec2b:"فحوصات الفواتير المكررة والمدفوعات المكررة مدمجة ضمن الروتين الشهري.",
sec3Title:"التحكم في الوصول ونظافة الأنظمة",
sec3a:"صلاحيات وصول بالحد الأدنى في SunSystems / Opera؛ لا مشاركة لبيانات الدخول؛ قفل جهاز العمل عند مغادرته.",
sec3b:"المصادقة متعددة العوامل على البريد الإلكتروني والبوابات البنكية؛ مراجعة دورية لصلاحيات المستخدمين بالتنسيق مع تقنية المعلومات.",
sec4Title:"سرية البيانات ومسار التدقيق",
sec4a:"مشاركة الملفات المالية عبر القنوات المعتمدة فقط؛ حماية المستندات الحساسة بكلمة مرور والاحتفاظ بها وفق السياسة.",
sec4b:"مستندات مؤيدة كاملة وقابلة للتتبع لكل قيد ودفعة — وهو أساس تحقيق ملاحظات تدقيق أقل من 2%.",
certHeading:"التعليم والشهادات والجوائز",eduTitle:"التعليم والشهادات المهنية",edu1:"محترف معتمد في الأعمال والمالية (CBFP) — IAPPD، يوليو 2024",edu2:"Microsoft Certified IT Professional (MCITP) — Zoomtech، 2013",edu3:"دبلوم اللغة الإنجليزية — Zoomtech، 2013 — تقدير A (80%)",edu4:"برنامج مهارات الحاسب الآلي I — Rotana",awardTitle:"التكريم والخدمة",award1:"جائزة الخدمة الطويلة — Rotana، 5 سنوات خدمة",award2:"شهادة تقدير / تكريم موظف — فندق WAVES، مارس 2026",
languagesHeading:"اللغات",arabic:"العربية",arabicLevel:"اللغة الأم",english:"الإنجليزية",englishLevel:"إجادة مهنية",contactHeading:"تواصل معي",contactText:"متاح لفرص محاسب أول حسابات دائنة، مشرف حسابات دائنة، ووظائف مالية في قطاع الفنادق.",phoneLabel:"الهاتف:",emailLabel:"البريد الإلكتروني:",
privacyNote:"هذا الموقع لا يستخدم ملفات تعريف الارتباط ولا أدوات تحليل أو نصوص برمجية خارجية. يُحفظ فقط اختيارك للغة والمظهر محلياً في متصفحك."
}
});

/* ---------- safe storage helpers (private mode / blocked storage) ---------- */
const store = {
  get(k){ try { return window.localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v){ try { window.localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
};

/* ---------- language ---------- */
function resolveInitialLang(){
  const fromUrl = new URLSearchParams(window.location.search).get("lang");
  const fromStore = store.get(STORAGE_LANG);
  const fromBrowser = (navigator.language || "").toLowerCase().startsWith("ar") ? "ar" : "en";
  return [fromUrl, fromStore, fromBrowser].find(v => SUPPORTED.includes(v)) || "en";
}
let lang = resolveInitialLang();

function setLanguage(next){
  if (!SUPPORTED.includes(next)) return;           // whitelist only
  lang = next;
  store.set(STORAGE_LANG, lang);
  const dict = T[lang];
  const isAr = lang === "ar";
  const html = document.documentElement;
  html.lang = lang;
  html.dir = isAr ? "rtl" : "ltr";

  // textContent only (never raw HTML assignment) → translations cannot inject markup
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const val = dict[el.dataset.i18n];
    if (typeof val === "string") el.textContent = val;
  });
  // attribute translations:  data-i18n-attr="alt:photoAlt"
  document.querySelectorAll("[data-i18n-attr]").forEach(el => {
    const [attr, key] = el.dataset.i18nAttr.split(":");
    const val = dict[key];
    if (attr && typeof val === "string") el.setAttribute(attr, val);
  });

  const btn = document.getElementById("langBtn");
  btn.textContent = isAr ? "English" : "العربية";
  btn.lang = isAr ? "en" : "ar";
  btn.setAttribute("aria-label", isAr ? "Switch to English" : "التبديل إلى العربية");
  document.title = dict.pageTitle;
}

/* ---------- theme ---------- */
function applyTheme(theme){
  document.documentElement.dataset.theme = theme;
  store.set(STORAGE_THEME, theme);
  document.getElementById("themeBtn").setAttribute("aria-pressed", String(theme === "dark"));
}
function initTheme(){
  const saved = store.get(STORAGE_THEME);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved === "dark" || saved === "light" ? saved : (prefersDark ? "dark" : "light"));
}

/* ---------- obfuscated contact details ----------
   Phone / e-mail are stored as split data-* fragments and assembled here, so the
   plain strings never appear in the HTML source. This blunts naive scrapers;
   it is not encryption and is not meant to be. */
function revealContacts(){
  document.querySelectorAll(".reveal").forEach(el => {
    const d = el.dataset;
    let text, href;
    if (d.kind === "tel") {
      text = [d.a, d.b, d.c, d.d].join(" ");
      href = "tel:" + [d.a, d.b, d.c, d.d].join("");
    } else if (d.kind === "mail") {
      text = d.u + "@" + d.h + "." + d.t;
      href = "mailto:" + text;
    } else { return; }
    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;            // safe: text node, not markup
    a.dir = "ltr";
    a.rel = "nofollow";
    el.replaceChildren(a);
  });
}

/* ---------- mobile menu ---------- */
function initMenu(){
  const btn = document.getElementById("menuBtn");
  const links = document.getElementById("navlinks");
  const close = () => {
    links.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", T[lang].menuOpen);
  };
  btn.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? T[lang].menuClose : T[lang].menuOpen);
  });
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
}

/* ---------- back to top ---------- */
function initToTop(){
  const el = document.getElementById("toTop");
  const onScroll = () => el.classList.toggle("show", window.scrollY > 500);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("langBtn").addEventListener("click", () => setLanguage(lang === "en" ? "ar" : "en"));
  document.getElementById("themeBtn").addEventListener("click", () =>
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
  document.getElementById("year").textContent = String(new Date().getFullYear());
  initTheme();
  initMenu();
  initToTop();
  revealContacts();
  setLanguage(lang);
});
