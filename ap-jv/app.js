/* =========================================================================
   AP Invoice → JV Draft Tool — Waves Hotel (WHU)
   Accounting Copilot: AI/parsing interprets · reference file constrains ·
   code calculates · human approves. NO auto-posting.
   ========================================================================= */
"use strict";

/* Surface unexpected errors instead of failing silently */
window.addEventListener("error", e=>{
  const el = document.getElementById("docStatus");
  if (el) el.textContent = "⚠ JS ERROR: " + (e.message||"") + (e.filename?` — ${e.filename.split("/").pop()}:${e.lineno}`:"");
});

/* ------------------------------- i18n ---------------------------------- */
const I = {
ar:{
appTitle:"أداة الفواتير → قيد يومية", appSub:"فندق ويفز (WHU) · SunSystems 6.4 · USALI الإصدار 11",
backPortfolio:"← البورتفوليو",
draftBanner:"وضع المسودة — هذه الأداة مساعد للمحاسب (Copilot) ولا تُرحّل قيودًا للنظام. كل مخرجاتها تتطلب اعتماد محاسب مسؤول. AI يفسّر · الملف المرجعي يقيّد · الكود يحسب · الإنسان يعتمد.",
s1Title:"مستند الفاتورة — الاستخلاص",
s1Hint:"ارفع صورة أو PDF للفاتورة (تُقرأ محليًا في متصفحك ولا تُرسل لأي خادم). تُقرأ بيانات رمز QR الخاص بفواتير هيئة الزكاة (ZATCA) بشكل حتمي، ويُحلَّل نص الفاتورة لتعبئة الحقول تلقائيًا — مع وجوب المراجعة البشرية.",
dzText:"اسحب الفاتورة هنا أو اضغط للاختيار (PDF / JPG / PNG)",
ocrBtn:"تشغيل OCR على الصورة (اختياري)", sampleLink:"تنزيل فاتورة تجريبية (QR)", pasteLbl:"أو الصق نص الفاتورة هنا:",
pastePh:"الصق نص الفاتورة (عربي أو إنجليزي)...", parseBtn:"تحليل النص وتعبئة الحقول", clearBtn:"مسح",
s2Title:"بيانات الفاتورة والتحقق",
fSupplier:"اسم المورد *", fSupCode:"كود المورد (إن وجد)", fVatNo:"الرقم الضريبي للمورد (15 خانة)",
fInvNo:"رقم الفاتورة *", fInvDate:"تاريخ الفاتورة *", fDueDate:"تاريخ الاستحقاق", fPO:"رقم أمر الشراء PO",
fCurr:"العملة", fDesc:"وصف الفاتورة *", fRate:"المعاملة الضريبية",
rate15:"15% ضريبة قيمة مضافة قياسية", rate0:"0% / معفاة — بدون ضريبة", rate5:"5% رسم إشغال بلدي (تنبيه — ليست VAT)",
fNet:"الصافي (قبل الضريبة) *", fVat:"مبلغ الضريبة", fGross:"الإجمالي (شامل الضريبة) *", calcBtn:"إكمال الحساب تلقائيًا",
s3Title:"التوجيه المحاسبي (حساب / قسم / كود تحليل)",
refUpload:"رفع الملف المرجعي Waves_Hotel_COA_Department_Reference.xlsx",
thAccount:"حساب المصروف (GL)", thDept:"القسم", thAnalysis:"كود التحليل", thAmount:"المبلغ (صافي)",
addLine:"+ إضافة سطر توزيع",
hrConfirmLbl:"أؤكد (كمحاسب مسؤول) أن هذا قيد رواتب/مخصصات حقيقي من مصدره الصحيح وليس فاتورة مورد اعتيادية — نطاق 50000–55100 يتطلب تأكيدًا بشريًا صريحًا.",
s4Title:"مسودة قيد اليومية JV", buildBtn:"توليد مسودة القيد",
jvAcc:"الحساب", jvName:"الوصف", jvDept:"القسم", jvAn:"تحليل", jvDr:"مدين", jvCr:"دائن",
csvBtn:"تصدير CSV (مسودة استيراد SunSystems)", copyBtn:"نسخ القيد كنص", saveBtn:"حفظ في سجل الفواتير", printBtn:"طباعة",
sunNote:"تنبيه (القسم 13): صيغة استيراد SunSystems الرسمية غير مؤكدة — الملف الناتج مسودة CSV للمراجعة فقط وليس ملف استيراد إنتاجي (SUNSYSTEMS IMPORT FORMAT NOT CONFIRMED).",
s5Title:"سجل الفواتير وكشف التكرار",
s5Hint:"يُحفظ السجل محليًا في متصفحك فقط (localStorage) ويُستخدم لكشف الفواتير المكررة: مورد + رقم فاتورة + مبلغ.",
rgDate:"تاريخ الحفظ", rgSup:"المورد", rgInv:"رقم الفاتورة", rgInvDate:"تاريخ الفاتورة", rgGross:"الإجمالي", rgRef:"مرجع القيد",
regCsv:"تصدير السجل CSV", regClear:"مسح السجل",
footer:"أداة مساعدة للمحاسب — لا ترحيل آلي. أُعدت وفق منهجية 4D للهندسة التلقينية — فواز الطاهر أحمد عطية الله © 2026",
/* dynamic */
refDemo:"الوضع المرجعي: بيانات تجريبية — ارفع ملف Excel لتحديث البيانات.",
refFull:"الوضع المرجعي: الملف الكامل محمّل", accounts:"حساب", depts:"قسم", mappings:"ربط",
qrTitle:"✔ تم قراءة QR (ZATCA TLV) — بيانات حتمية من الفاتورة:",
qrSeller:"اسم البائع", qrVat:"الرقم الضريبي", qrTime:"التاريخ/الوقت", qrTotal:"الإجمالي شامل الضريبة", qrVatAmt:"مبلغ الضريبة",
noQr:"لم يُعثر على رمز QR قابل للقراءة في المستند.", pdfPage:"تمت معالجة صفحات PDF:",
ocrRunning:"جارٍ تشغيل OCR (قد يستغرق وقتًا حسب حجم الصورة)...", ocrDone:"اكتمل OCR — راجع النص ثم اضغط تحليل.", ocrNoImg:"ارفع صورة أولاً قبل تشغيل OCR.", ocrLoadErr:"تعذر تحميل محرك OCR (يتطلب اتصالاً بالإنترنت).",
parsedInto:"تم تحليل النص وتعبئة الحقول الممكنة — تحقق من كل حقل قبل المتابعة.",
missing:"معلومات ناقصة", whyMatters:"مطلوبة قبل توليد القيد",
vatOk:"PASS — التحقق الحسابي: الصافي × النسبة = الضريبة، والصافي + الضريبة = الإجمالي (فرق ≤ 0.02).",
vatErr:"VAT CALCULATION ERROR — HUMAN REVIEW REQUIRED: القيم لا تتطابق حسابيًا.",
vatDiff:"الفرق", expected:"المتوقع",
muniWarn:"تنبيه: اخترت رسم الإشغال البلدي 5% — هذا ليس ضريبة قيمة مضافة ولن يُوجَّه للحساب 15240. يلزم تأكيد بشري لكود الإيراد/المعالجة قبل الترحيل.",
vatNoWarn:"تحذير: الرقم الضريبي يجب أن يكون 15 خانة ويبدأ وينتهي بـ 3 (نمط ZATCA).",
dupNone:"NO DUPLICATE FOUND — لا يوجد تكرار في السجل المحلي.",
dupPossible:"POSSIBLE DUPLICATE — يوجد بالسجل فاتورة مشابهة (نفس المورد ونفس الرقم أو نفس المبلغ). مراجعة بشرية مطلوبة:",
dupConfirmed:"CONFIRMED DUPLICATE — نفس المورد + نفس رقم الفاتورة + نفس المبلغ موجودة في السجل. POSTING BLOCKED حتى المراجعة.",
selSupplier:"— اختر اسم المورد —", selSupplierCode:"— اختر كود المورد —",
selAcc:"— اختر الحساب —", selDept:"— اختر القسم —", selAn:"— اختر كود التحليل —", anNotReq:"غير مطلوب لهذا القسم",
noMapDept:"لا توجد أقسام مسموحة لهذا الحساب في ملف الربط — NO APPROVED COMBINATION — ESCALATION REQUIRED",
catA:"فئة A — حساب رواتب/تكاليف نظامية (50000–55100): HIGH ATTENTION — يتطلب تأكيدًا أنه قيد رواتب وليس فاتورة مورد.",
catB:"فئة B — حساب إحصائي (ساعات/FTE): STATISTICAL ENTRY — NOT A FINANCIAL JOURNAL LINE — لا يدخل في قيد مالي ولا يخضع لموازنة مدين/دائن بالريال.",
catC1:"فئة C1 — تحميل داخلي بين الأقسام: تأكد من أساس التوزيع (قيد توزيعات نهاية شهر وليس فاتورة مورد).",
hrAnMissing:"NO MATCHING HR ANALYSIS CODE — القسم 6040 لا يقبل أي مصروف بدون كود تحليل من سلسلة 335xxx. الحقل إلزامي.",
allocEmpty:"أضف سطر توزيع واحدًا على الأقل واختر الحساب والقسم والمبلغ.",
allocSumLbl:"مجموع التوزيع:", ofNet:"من الصافي",
allocMismatch:"مجموع سطور التوزيع لا يساوي صافي الفاتورة — عدِّل المبالغ.",
catBBlocked:"POSTING BLOCKED — سطر يحتوي حسابًا إحصائيًا (فئة B) لا يجوز إدراجه في قيد مالي.",
catANeedsConfirm:"POSTING BLOCKED — حساب فئة A بدون تأكيد بشري (فعِّل مربع التأكيد في الخطوة 3).",
jvBalanced:"PASS — القيد متوازن: إجمالي المدين = إجمالي الدائن.",
jvImbalance:"JOURNAL REJECTED — IMBALANCE DETECTED — إجمالي المدين ≠ إجمالي الدائن.",
totalDr:"إجمالي المدين", totalCr:"إجمالي الدائن", diff:"الفرق",
confLbl:"درجة الثقة في التوجيه", confHi:"عالية — تطابق كامل مع الملف المرجعي", confMd:"متوسطة — تفسير وصفي، مراجعة بشرية", confLo:"منخفضة — تصعيد مطلوب",
approval:"الاعتماد: HUMAN REVIEW REQUIRED — لا يُرحَّل هذا القيد إلى SunSystems إلا بعد اعتماد محاسب مسؤول.",
jvRef:"مرجع القيد", jvDate:"تاريخ القيد", jvSup:"المورد", jvSupCode:"كود المورد", jvInv:"الفاتورة",
copied:"تم نسخ القيد.", savedReg:"تم حفظ الفاتورة في السجل المحلي.",
regEmpty:"السجل فارغ.", del:"حذف", confirmClear:"هل تريد مسح كامل السجل المحلي؟",
refLoaded:"تم تحميل الملف المرجعي:", refErr:"تعذر قراءة الملف — تأكد أنه ملف Excel يحوي أوراق: Departments / Chart of Accounts / Account-Department Mapping.",
demoTag:"(تجريبي)", statBadge:"إحصائي", drLine:"مدين", crLine:"دائن",
buildFirst:"أكمل الخطوات 2 و3 أولاً — راجع رسائل التحقق أعلاه.",
vatLineDesc:"ضريبة مدخلات قابلة للاسترداد 15%", apLineDesc:"إجمالي مستحق للمورد",
uncertain:"UNCERTAIN — HUMAN REVIEW REQUIRED"
},
en:{
appTitle:"Invoice → JV Tool", appSub:"Waves Hotel (WHU) · SunSystems 6.4 · USALI 11th Ed.",
backPortfolio:"← Portfolio",
draftBanner:"DRAFT MODE — This tool is an accountant's copilot. It never posts to the ERP. Every output requires approval by a responsible accountant. AI interprets · Reference file constrains · Code calculates · Human approves.",
s1Title:"Invoice Document — Extraction",
s1Hint:"Upload an invoice image or PDF (processed locally in your browser — nothing is sent to any server). ZATCA e-invoice QR codes are decoded deterministically, and invoice text is parsed to pre-fill the fields — human review is mandatory.",
dzText:"Drop the invoice here or click to browse (PDF / JPG / PNG)",
ocrBtn:"Run OCR on image (optional)", sampleLink:"Download sample invoice (QR)", pasteLbl:"Or paste the invoice text here:",
pastePh:"Paste invoice text (Arabic or English)...", parseBtn:"Parse text & fill fields", clearBtn:"Clear",
s2Title:"Invoice Data & Validation",
selSupplier:"— Select supplier name —", selSupplierCode:"— Select supplier code —",
fSupplier:"Supplier name *", fSupCode:"Supplier code (if any)", fVatNo:"Supplier VAT number (15 digits)",
fInvNo:"Invoice number *", fInvDate:"Invoice date *", fDueDate:"Due date", fPO:"PO number",
fCurr:"Currency", fDesc:"Invoice description *", fRate:"Tax treatment",
rate15:"15% standard VAT", rate0:"0% / exempt — no VAT", rate5:"5% Municipal Occupancy Fee (NOT VAT)",
fNet:"Net (before tax) *", fVat:"Tax amount", fGross:"Gross (incl. tax) *", calcBtn:"Auto-complete calculation",
s3Title:"GL Coding (Account / Department / Analysis Code)",
refUpload:"Upload reference file Waves_Hotel_COA_Department_Reference.xlsx",
thAccount:"Expense GL account", thDept:"Department", thAnalysis:"Analysis code", thAmount:"Amount (net)",
addLine:"+ Add allocation line",
hrConfirmLbl:"I confirm (as responsible accountant) this is a genuine payroll/statutory journal from its proper source, not a standard supplier invoice — range 50000–55100 requires explicit human confirmation.",
s4Title:"Journal Voucher (JV) Draft", buildBtn:"Generate JV draft",
jvAcc:"Account", jvName:"Description", jvDept:"Dept", jvAn:"Analysis", jvDr:"Debit", jvCr:"Credit",
csvBtn:"Export CSV (SunSystems import DRAFT)", copyBtn:"Copy JV as text", saveBtn:"Save to invoice register", printBtn:"Print",
sunNote:"Note (Section 13): the official SunSystems import specification is not confirmed — the exported file is a review DRAFT only, not a production import file (SUNSYSTEMS IMPORT FORMAT NOT CONFIRMED).",
s5Title:"Invoice Register & Duplicate Detection",
s5Hint:"The register is stored only in your browser (localStorage) and drives duplicate detection: supplier + invoice number + amount.",
rgDate:"Saved at", rgSup:"Supplier", rgInv:"Invoice no.", rgInvDate:"Invoice date", rgGross:"Gross", rgRef:"JV ref",
regCsv:"Export register CSV", regClear:"Clear register",
footer:"Accountant-assist tool — no auto-posting. Built with the 4D Prompt Engineering Model — Fawaz Eltahir Ahmed Atiatallah © 2026",
refDemo:"Reference mode: DEMO data — upload an Excel file to update the reference data.",
refFull:"Reference mode: full file loaded", accounts:"accounts", depts:"departments", mappings:"mappings",
qrTitle:"✔ QR decoded (ZATCA TLV) — deterministic data from the invoice:",
qrSeller:"Seller name", qrVat:"VAT number", qrTime:"Timestamp", qrTotal:"Total incl. VAT", qrVatAmt:"VAT amount",
noQr:"No readable QR code found in the document.", pdfPage:"PDF pages processed:",
ocrRunning:"Running OCR (may take a while depending on image size)...", ocrDone:"OCR complete — review the text then click Parse.", ocrNoImg:"Upload an image first before running OCR.", ocrLoadErr:"Could not load the OCR engine (requires internet).",
parsedInto:"Text parsed and fields pre-filled where possible — verify every field before proceeding.",
missing:"Missing information", whyMatters:"required before generating the JV",
vatOk:"PASS — deterministic check: Net × Rate = Tax and Net + Tax = Gross (diff ≤ 0.02).",
vatErr:"VAT CALCULATION ERROR — HUMAN REVIEW REQUIRED: values do not reconcile.",
vatDiff:"Difference", expected:"Expected",
muniWarn:"Warning: you selected the 5% Municipal Occupancy Fee — this is NOT VAT and will not be routed to account 15240. Human confirmation of the applicable treatment is required before posting.",
vatNoWarn:"Warning: VAT number should be 15 digits, starting and ending with 3 (ZATCA pattern).",
dupNone:"NO DUPLICATE FOUND — no duplicate in the local register.",
dupPossible:"POSSIBLE DUPLICATE — a similar invoice exists in the register (same supplier and same number or same amount). Human review required:",
dupConfirmed:"CONFIRMED DUPLICATE — same supplier + invoice number + amount already in the register. POSTING BLOCKED pending review.",
selAcc:"— select account —", selDept:"— select department —", selAn:"— select analysis code —", anNotReq:"Not required for this department",
noMapDept:"No permitted departments for this account in the mapping sheet — NO APPROVED COMBINATION — ESCALATION REQUIRED",
catA:"Category A — payroll/statutory account (50000–55100): HIGH ATTENTION — confirm this is a genuine payroll journal, not a supplier invoice.",
catB:"Category B — statistical account (hours/FTE): STATISTICAL ENTRY — NOT A FINANCIAL JOURNAL LINE — excluded from monetary DR/CR balancing.",
catC1:"Category C1 — internal cross-departmental allocation: confirm the allocation basis (month-end allocation journal, not a supplier invoice).",
hrAnMissing:"NO MATCHING HR ANALYSIS CODE — Department 6040 accepts no expense posting without a 335xxx analysis code. This field is mandatory.",
allocEmpty:"Add at least one allocation line and select account, department and amount.",
allocSumLbl:"Allocation total:", ofNet:"of net",
allocMismatch:"Allocation lines do not sum to the invoice net amount — adjust the amounts.",
catBBlocked:"POSTING BLOCKED — a line uses a statistical (Category B) account which cannot appear in a financial journal.",
catANeedsConfirm:"POSTING BLOCKED — Category A account without human confirmation (tick the confirmation box in Step 3).",
jvBalanced:"PASS — journal balanced: Total Debit = Total Credit.",
jvImbalance:"JOURNAL REJECTED — IMBALANCE DETECTED — Total Debit ≠ Total Credit.",
totalDr:"Total Debit", totalCr:"Total Credit", diff:"Difference",
confLbl:"Coding confidence", confHi:"High — exact reference-file match", confMd:"Reasonable — descriptive interpretation, human review", confLo:"Low — escalation required",
approval:"Approval: HUMAN REVIEW REQUIRED — this JV must not be posted to SunSystems without sign-off by a responsible accountant.",
jvRef:"JV reference", jvDate:"JV date", jvSup:"Supplier", jvSupCode:"Supplier code", jvInv:"Invoice",
copied:"JV copied.", savedReg:"Invoice saved to local register.",
regEmpty:"Register is empty.", del:"Delete", confirmClear:"Clear the entire local register?",
refLoaded:"Reference file loaded:", refErr:"Could not read the file — make sure it is the Excel workbook with sheets: Departments / Chart of Accounts / Account-Department Mapping.",
demoTag:"(demo)", statBadge:"STAT", drLine:"DR", crLine:"CR",
buildFirst:"Complete steps 2 and 3 first — see the validation messages above.",
vatLineDesc:"Recoverable input VAT 15%", apLineDesc:"Gross payable to supplier",
uncertain:"UNCERTAIN — HUMAN REVIEW REQUIRED"
}};

let lang = localStorage.getItem("apjvLang") || "ar";
const t = k => (I[lang][k] !== undefined ? I[lang][k] : k);

function applyLang(){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.dir = lang === "ar" ? "rtl" : "ltr";
  document.getElementById("langBtn").textContent = lang === "ar" ? "English" : "العربية";
  document.querySelectorAll("[data-i18n]").forEach(el=>{ el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-ph]").forEach(el=>{ el.placeholder = t(el.dataset.i18nPh); });
  renderRefStatus(); renderSuppliers(); renderAlloc(); renderRegister();
}

/* --------------------- REFERENCE DATA (DEMO SUBSET) ---------------------
   Built ONLY from the confirmed mappings in the master prompt (Sections
   0.3 and 0.6). This is NOT the full 809-account COA — upload the real
   Waves_Hotel_COA_Department_Reference.xlsx to replace it.               */
const CONTROL = { VAT_INPUT:"15240", AP_CONTROL:"22180" };

const DEMO_REF = {
  demo: true,
  departments: [
    {code:"1000", name:"Rooms"},
    {code:"1030", name:"Housekeeping"},
    {code:"1100", name:"Front Office"},
    {code:"4000", name:"Health Club & SPA"},
    {code:"6040", name:"Human Resources"},
    {code:"6100", name:"Information and Telecommunication Systems"}
  ],
  accounts: {
    "15240":{desc:"VAT Input (recoverable)", bs:true},
    "22180":{desc:"Supplier / Trade Payables control", bs:true},
    "60420":{desc:"I.T Telecommunications"},
    "60535":{desc:"Operating Supplies"},
    "60515":{desc:"Miscellaneous"},
    /* Dept 6040 — Category A (examples cited in the prompt) */
    "50000":{desc:"Basic Salary"},
    "50600":{desc:"Executive Committee Bonus"},
    "51300":{desc:"Gratuity"},
    "52100":{desc:"Retirement Pension Fund"},
    "52502":{desc:"Housing Allowance"},
    "52510":{desc:"Home Leave Ticket"},
    /* Dept 6040 — Category B statistical */
    "96010":{desc:"Standard Hours in Month", stat:true},
    "96020":{desc:"Overtime Hours 1.25", stat:true},
    "96130":{desc:"FTE", stat:true},
    /* Dept 6040 — Category C1 allocations */
    "45100":{desc:"Staff Cafeteria Allocation"},
    "45300":{desc:"Staff Housing Allocation"},
    "45400":{desc:"Laundry Allocation"},
    /* Dept 6040 — Category C2 AP-eligible (19 accounts) */
    "60185":{desc:"Complimentary Services / Gifts"},
    "60190":{desc:"Contract Services"},
    "60195":{desc:"Corporate Office Reimbursable"},
    "60210":{desc:"Decorations"},
    "60230":{desc:"Dues and Subscriptions"},
    "60255":{desc:"Entertainment—In-House"},
    "60260":{desc:"Equipment Rental"},
    "60335":{desc:"Human Resources"},
    "60465":{desc:"Legal Services"},
    "60470":{desc:"Licenses and Permits"},
    "60570":{desc:"Payroll Processing"},
    "60640":{desc:"Staff Transportation"},
    "60675":{desc:"Training"},
    "60680":{desc:"Travel—Meals & Enter."},
    "60685":{desc:"Travel—Other"},
    "60690":{desc:"Uniform Costs"},
    "60695":{desc:"Uniform Laundry"}
  },
  /* account -> permitted departments (confirmed only) */
  mapping: {
    "60420":["6100"],
    "60535":["4000","6040"],
    "60515":["4000","6040"],
    "50000":["6040"],"50600":["6040"],"51300":["6040"],"52100":["6040"],"52502":["6040"],"52510":["6040"],
    "96010":["6040"],"96020":["6040"],"96130":["6040"],
    "45100":["6040"],"45300":["6040"],"45400":["6040"],
    "60185":["6040"],"60190":["6040"],"60195":["6040"],"60210":["6040"],"60230":["6040"],
    "60255":["6040"],"60260":["6040"],"60335":["6040"],"60465":["6040"],"60470":["6040"],
    "60570":["6040"],"60640":["6040"],"60675":["6040"],"60680":["6040"],"60685":["6040"],
    "60690":["6040"],"60695":["6040"]
  },
  /* HR 335xxx analysis codes — only the four cited in the prompt */
  hrCodes: [
    {code:"335001", name:"Advertising — recruiting"},
    {code:"335008", name:"Interview expenses"},
    {code:"335019", name:"Relocation costs"},
    {code:"335025", name:"Visa costs for an ex-pat employee"}
  ]
};
let REF = FULL_REF;

// The script is loaded at the end of the document; initialize after all helpers are defined.
window.addEventListener("load", renderSuppliers);

function renderSuppliers(){
  const suppliers = FULL_REF.suppliers || [];
  const accountCodes = Object.keys(REF.accounts || FULL_REF.accounts || {}).sort();
  const code = $("fSupCode"), name = $("fSupplier");
  if (!code || !name) return;
  const selectedCode = code.value, selectedName = name.value;
  // The supplier-code field is intentionally an account-code selector:
  // any code from the chart of accounts may be used for the payable line.
  code.innerHTML = `<option value="">${esc(t("selSupplierCode"))}</option>` + accountCodes.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
  name.innerHTML = `<option value="">${esc(t("selSupplier"))}</option>` + suppliers.map(v=>`<option value="${esc(v.name)}">${esc(v.name)}</option>`).join("");
  if (accountCodes.includes(selectedCode)) code.value = selectedCode;
  if (suppliers.some(v=>v.name===selectedName)) name.value = selectedName;
  code.onchange = ()=>{
    const v = suppliers.find(x=>x.code===code.value);
    if (v) name.value = v.name;
  };
  name.onchange = ()=>{
    const v = suppliers.find(x=>x.name===name.value);
    if (v) code.value = v.code;
  };
}

function hrCategory(acc){
  const n = parseInt(acc,10);
  if (isNaN(n)) return null;
  if (n>=50000 && n<=55100) return "A";
  if (n>=96010 && n<=96130) return "B";
  if (["45100","45300","45400"].includes(acc)) return "C1";
  return "C2";
}

/* ------------------------- Reference file upload ------------------------ */
function renderRefStatus(){
  const el = document.getElementById("refStatus");
  const nAcc = Object.keys(REF.accounts).length, nDep = REF.departments.length, nMap = Object.keys(REF.mapping).length;
  el.innerHTML = REF.demo
    ? `<span class="demo">⚠ ${esc(t("refDemo"))}</span>`
    : `<span class="full">✔ ${esc(t("refFull"))} — ${nAcc} ${t("accounts")} · ${nDep} ${t("depts")} · ${nMap} ${t("mappings")}</span>`;
}

document.getElementById("refFile").addEventListener("change", async e=>{
  const f = e.target.files[0]; if(!f) return;
  try{
    if (typeof XLSX === "undefined") throw new Error("xlsx lib not loaded");
    const wb = XLSX.read(await f.arrayBuffer(), {type:"array"});
    const shMap = wb.SheetNames.find(n=>/mapping/i.test(n)) || wb.SheetNames.find(n=>/p&l|final/i.test(n));
    const shDep = wb.SheetNames.find(n=>/depart/i.test(n)) || shMap;
    const shHr  = wb.SheetNames.find(n=>/335|analysis/i.test(n));
    const next = {demo:false, departments:[], accounts:{}, mapping:{}, hrCodes:[]};

    if (shDep){
      XLSX.utils.sheet_to_json(wb.Sheets[shDep],{header:1}).forEach(r=>{
        const code = String(r[0]??"").trim(), name = String(r[1]??"").trim();
        if (/^\d{3,5}$/.test(code)) next.departments.push({code,name});
      });
    }
    const coaSheet = wb.SheetNames.find(n=>/chart|coa/i.test(n));
    if (coaSheet){
      XLSX.utils.sheet_to_json(wb.Sheets[coaSheet],{header:1}).forEach(r=>{
        const code = String(r[0]??"").trim(), desc = String(r[1]??"").trim();
        if (/^\d{4,6}$/.test(code)) next.accounts[code]={
          desc,
          stat: parseInt(code,10)>=96000 && parseInt(code,10)<97000,
          bs: code===CONTROL.VAT_INPUT || code===CONTROL.AP_CONTROL || /^1|^2/.test(code)
        };
      });
    }
    if (shMap){
      XLSX.utils.sheet_to_json(wb.Sheets[shMap],{header:1}).forEach(r=>{
        const cells = r.map(c=>String(c??"").trim());
        const acc = cells.find(c=>/^\d{4,6}$/.test(c) && next.accounts[c]);
        if (!acc) return;
        const deps = [];
        cells.forEach(c=>{
          c.split(/[,;/\s]+/).forEach(p=>{
            if (/^\d{3,5}$/.test(p) && p!==acc && next.departments.some(d=>d.code===p)) deps.push(p);
          });
        });
        if (deps.length){ next.mapping[acc] = Array.from(new Set([...(next.mapping[acc]||[]), ...deps])); }
      });
    }
    if (shHr){
      XLSX.utils.sheet_to_json(wb.Sheets[shHr],{header:1}).forEach(r=>{
        const code = String(r[0]??"").trim();
        if (/^335\d{3}$/.test(code)) next.hrCodes.push({code, name:String(r[1]??"").trim()});
      });
    }
    if (!next.departments.length || !Object.keys(next.accounts).length) throw new Error("sheets");
    if (!next.hrCodes.length) next.hrCodes = DEMO_REF.hrCodes;
    REF = next;
    renderRefStatus(); renderSuppliers(); renderAlloc();
    setDocStatus(`✔ ${t("refLoaded")} ${f.name}`);
  }catch(err){
    alert(t("refErr"));
  }
  e.target.value = "";
});

/* ------------------------------ helpers -------------------------------- */
const $ = id => document.getElementById(id);
const esc = s => String(s??"").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const r2 = x => Math.round((x + Number.EPSILON) * 100) / 100;
const fmt = x => (x===null||x===undefined||isNaN(x)) ? "" : x.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const num = id => { const v = parseFloat($(id).value); return isNaN(v)?null:v; };
function setDocStatus(msg){ $("docStatus").textContent = msg; }
function chk(cls,msg){ return `<div class="chk ${cls}">${msg}</div>`; }

/* ------------------------- ZATCA QR (TLV) decode ------------------------ */
function decodeZatcaTLV(text){
  // ZATCA QR = Base64 of TLV: tag(1) len(1) value(len bytes, UTF-8)
  let bytes;
  try{
    const bin = atob(text.trim());
    bytes = new Uint8Array(bin.length);
    for (let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
  }catch(e){ return null; }
  const out = {}; let i = 0; const dec = new TextDecoder("utf-8");
  while (i + 2 <= bytes.length){
    const tag = bytes[i], len = bytes[i+1];
    if (i + 2 + len > bytes.length) break;
    out[tag] = dec.decode(bytes.slice(i+2, i+2+len));
    i += 2 + len;
  }
  return (out[1]||out[2]||out[4]) ? out : null;
}

function applyQr(tlv){
  const box = $("qrResult");
  const rows = [];
  if (tlv[1]) { $("fSupplier").value = tlv[1]; rows.push([t("qrSeller"), tlv[1]]); }
  if (tlv[2]) { $("fVatNo").value = tlv[2]; rows.push([t("qrVat"), tlv[2]]); }
  if (tlv[3]) {
    rows.push([t("qrTime"), tlv[3]]);
    const d = tlv[3].slice(0,10);
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) $("fInvDate").value = d;
  }
  if (tlv[4]) { $("fGross").value = tlv[4]; rows.push([t("qrTotal"), tlv[4]]); }
  if (tlv[5]) { $("fVat").value = tlv[5]; rows.push([t("qrVatAmt"), tlv[5]]); }
  if (tlv[4] && tlv[5]) {
    const net = r2(parseFloat(tlv[4]) - parseFloat(tlv[5]));
    if (!isNaN(net)) $("fNet").value = net.toFixed(2);
  }
  box.hidden = false;
  box.innerHTML = `<h4>${esc(t("qrTitle"))}</h4>` + rows.map(r=>`<div><b>${esc(r[0])}:</b> <span dir="ltr">${esc(r[1])}</span></div>`).join("");
  validateInvoice();
}

/* --------------------------- file handling ----------------------------- */
let lastImageDataUrl = null;

async function scanCanvasForQr(canvas){
  const ctx = canvas.getContext("2d");
  const img = ctx.getImageData(0,0,canvas.width,canvas.height);
  const found = (typeof jsQR === "function") ? jsQR(img.data, img.width, img.height) : null;
  if (found && found.data){
    const tlv = decodeZatcaTLV(found.data);
    if (tlv){ applyQr(tlv); return true; }
  }
  return false;
}

async function handleImageFile(file){
  const url = URL.createObjectURL(file);
  lastImageDataUrl = url;
  const imgEl = new Image();
  await new Promise((res,rej)=>{ imgEl.onload=res; imgEl.onerror=rej; imgEl.src=url; });
  const canvas = $("workCanvas");
  const scale = Math.min(1, 1600/Math.max(imgEl.width, imgEl.height));
  canvas.width = Math.round(imgEl.width*scale); canvas.height = Math.round(imgEl.height*scale);
  canvas.getContext("2d").drawImage(imgEl,0,0,canvas.width,canvas.height);
  const ok = await scanCanvasForQr(canvas);
  setDocStatus(ok ? "" : t("noQr"));
}

async function handlePdfFile(file){
  if (typeof pdfjsLib === "undefined"){ setDocStatus(t("noQr")); return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = "vendor/pdf.worker.min.js";
  const pdf = await pdfjsLib.getDocument({data: await file.arrayBuffer()}).promise;
  let qrFound = false, textAll = "";
  const pages = Math.min(pdf.numPages, 3);
  for (let p=1;p<=pages;p++){
    const page = await pdf.getPage(p);
    // extract text
    const tc = await page.getTextContent();
    textAll += tc.items.map(it=>it.str).join(" ") + "\n";
    // render for QR
    if (!qrFound){
      const vp = page.getViewport({scale:2});
      const canvas = $("workCanvas");
      canvas.width = vp.width; canvas.height = vp.height;
      await page.render({canvasContext: canvas.getContext("2d"), viewport: vp}).promise;
      qrFound = await scanCanvasForQr(canvas);
    }
  }
  if (textAll.trim()){
    $("pasteText").value = textAll.trim();
    parseInvoiceText(textAll);
  }
  setDocStatus(`${t("pdfPage")} ${pages}${qrFound ? "" : "\n"+t("noQr")}`);
}

const dz = $("dropzone");
dz.addEventListener("click", ()=>$("fileInput").click());
dz.addEventListener("dragover", e=>{ e.preventDefault(); dz.classList.add("drag"); });
dz.addEventListener("dragleave", ()=>dz.classList.remove("drag"));
dz.addEventListener("drop", e=>{ e.preventDefault(); dz.classList.remove("drag"); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
$("fileInput").addEventListener("change", e=>{ if(e.target.files[0]) handleFile(e.target.files[0]); });

async function handleFile(file){
  $("qrResult").hidden = true;
  setDocStatus("…");
  try{
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) await handlePdfFile(file);
    else await handleImageFile(file);
  }catch(err){ setDocStatus(t("noQr")); }
}

/* ------------------------------- OCR ----------------------------------- */
$("ocrBtn").addEventListener("click", async ()=>{
  if (!lastImageDataUrl){ setDocStatus(t("ocrNoImg")); return; }
  setDocStatus(t("ocrRunning"));
  try{
    if (typeof Tesseract === "undefined"){
      await new Promise((res,rej)=>{
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
        s.onload = res; s.onerror = rej; document.head.appendChild(s);
      });
    }
    const { data } = await Tesseract.recognize(lastImageDataUrl, "ara+eng");
    $("pasteText").value = data.text || "";
    setDocStatus(t("ocrDone"));
  }catch(e){ setDocStatus(t("ocrLoadErr")); }
});

/* --------------------------- text parsing ------------------------------ */
function arDigits(s){
  return s.replace(/[٠-٩]/g, d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d));
}
function parseAmount(s){
  if (!s) return null;
  const v = parseFloat(s.replace(/,/g,""));
  return isNaN(v)?null:v;
}
function parseInvoiceText(raw){
  const text = arDigits(raw);
  const pick = (res)=>{ for (const re of res){ const m = text.match(re); if (m) return m[1].trim(); } return null; };

  const invNo = pick([
    /(?:invoice\s*(?:no|number|#)\.?\s*[:#]?\s*)([A-Za-z0-9\/-]{3,})/i,
    /(?:رقم\s*الفاتورة|فاتورة\s*رقم)\s*[:#]?\s*([A-Za-z0-9\/-]{3,})/,
    /\bINV[-\/]?(\d{3,})\b/i
  ]);
  if (invNo) $("fInvNo").value = invNo.replace(/^INV/i,"INV");

  const vatNo = pick([/\b(3\d{13}3)\b/]);
  if (vatNo) $("fVatNo").value = vatNo;

  const dateRaw = pick([
    /(?:invoice\s*date|date|تاريخ\s*الفاتورة|التاريخ)\s*[:#]?\s*(\d{4}-\d{2}-\d{2})/i,
    /(?:invoice\s*date|date|تاريخ\s*الفاتورة|التاريخ)\s*[:#]?\s*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{4})/i,
    /\b(\d{4}-\d{2}-\d{2})\b/
  ]);
  if (dateRaw){
    let iso = dateRaw;
    const m = dateRaw.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
    if (m) iso = `${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
    $("fInvDate").value = iso;
  }

  const po = pick([/(?:P\.?O\.?\s*(?:no|number|#)?\.?\s*[:#]?\s*)([A-Za-z0-9\/-]{3,})/i, /(?:أمر\s*(?:ال)?شراء)\s*[:#]?\s*([A-Za-z0-9\/-]{3,})/]);
  if (po) $("fPO").value = po;

  const gross = pick([
    /(?:grand\s*total|total\s*(?:amount)?\s*(?:incl|with|including)|الإجمالي\s*(?:شامل|مع)|المجموع\s*الكلي)[^0-9]*?([\d,]+\.\d{1,2}|[\d,]{1,12})/i,
    /(?:total\s*due|amount\s*due)[^0-9]*?([\d,]+\.?\d*)/i
  ]);
  const vat = pick([
    /(?:vat|tax|ضريبة(?:\s*القيمة\s*المضافة)?)(?!\s*(?:number|no\.?|reg|الرقم|رقم))[^0-9%\n]*(?:15\s*%)?[^0-9\n]*?([\d,]+\.\d{1,2})/i,
    /(?:vat|tax|ضريبة(?:\s*القيمة\s*المضافة)?)(?!\s*(?:number|no\.?|reg|الرقم|رقم))[^0-9%\n]*(?:15\s*%)?[^0-9\n]*?([\d,]{1,9})\b/i
  ]);
  const net = pick([
    /(?:sub\s*total|subtotal|net\s*(?:amount)?|الصافي|المجموع\s*الفرعي|الإجمالي\s*قبل)[^0-9]*?([\d,]+\.?\d*)/i
  ]);
  const g = parseAmount(gross), v = parseAmount(vat), n = parseAmount(net);
  if (n!==null) $("fNet").value = n.toFixed(2);
  if (v!==null) $("fVat").value = v.toFixed(2);
  if (g!==null) $("fGross").value = g.toFixed(2);
  if (n===null && g!==null && v!==null) $("fNet").value = r2(g-v).toFixed(2);
  if (g===null && n!==null && v!==null) $("fGross").value = r2(n+v).toFixed(2);

  // supplier: first non-empty line without digits-heavy content
  if (!$("fSupplier").value){
    const line = text.split(/\n/).map(s=>s.trim()).find(s=>s.length>3 && !/\d{4,}/.test(s) && !/invoice|فاتورة|vat|ضريب/i.test(s));
    if (line) $("fSupplier").value = line;
  }
  setDocStatus(t("parsedInto"));
  validateInvoice();
}
$("parseBtn").addEventListener("click", ()=>{ const v=$("pasteText").value; if(v.trim()) parseInvoiceText(v); });
$("clearDocBtn").addEventListener("click", ()=>{
  ["pasteText","fSupplier","fSupCode","fVatNo","fInvNo","fInvDate","fDueDate","fPO","fDesc","fNet","fVat","fGross"].forEach(id=>$(id).value="");
  $("qrResult").hidden = true; setDocStatus(""); $("vatCheck").innerHTML=""; $("jvWrap").hidden = true; lastImageDataUrl=null;
});

/* -------------------- deterministic VAT / validation -------------------- */
$("calcBtn").addEventListener("click", ()=>{
  const rate = parseFloat($("fRate").value)/100;
  let n = num("fNet"), v = num("fVat"), g = num("fGross");
  if (n!==null && v===null && g===null){ v=r2(n*rate); g=r2(n+v); }
  else if (g!==null && n===null && v===null){ n=r2(g/(1+rate)); v=r2(g-n); }
  else if (n!==null && g!==null && v===null){ v=r2(g-n); }
  else if (n!==null && v!==null && g===null){ g=r2(n+v); }
  else if (g!==null && v!==null && n===null){ n=r2(g-v); }
  if (n!==null) $("fNet").value=n.toFixed(2);
  if (v!==null) $("fVat").value=v.toFixed(2);
  if (g!==null) $("fGross").value=g.toFixed(2);
  validateInvoice();
});

["fNet","fVat","fGross","fRate","fSupplier","fInvNo","fInvDate","fDesc","fVatNo"].forEach(id=>{
  $(id).addEventListener("input", validateInvoice);
  $(id).addEventListener("change", validateInvoice);
});

function invoiceIssues(){
  const issues = {errors:[], warns:[], infos:[]};
  const reqd = [["fSupplier","fSupplier"],["fInvNo","fInvNo"],["fInvDate","fInvDate"],["fDesc","fDesc"],["fNet","fNet"],["fGross","fGross"]];
  const missing = reqd.filter(([id])=>!$(id).value.trim()).map(([,k])=>t(k).replace(" *",""));
  if (missing.length) issues.errors.push(`MISSING INFORMATION — ${t("missing")}: ${missing.join("، ")} — ${t("whyMatters")}.`);

  const rate = parseFloat($("fRate").value)/100;
  const n = num("fNet"), v = num("fVat") ?? 0, g = num("fGross");
  if (n!==null && g!==null){
    const expV = r2(n*rate), expG = r2(n+v);
    const dV = r2(Math.abs(expV - v)), dG = r2(Math.abs(expG - g));
    if (dV <= 0.02 && dG <= 0.02){
      issues.infos.push(t("vatOk"));
    } else {
      issues.errors.push(`${t("vatErr")} ${t("expected")}: VAT=${fmt(expV)} / Gross=${fmt(r2(n+expV))} — ${t("vatDiff")}: VAT ${fmt(dV)}, Gross ${fmt(dG)}.`);
    }
  }
  if ($("fRate").value === "5") issues.warns.push(t("muniWarn"));
  const vn = $("fVatNo").value.trim();
  if (vn && !/^3\d{13}3$/.test(vn)) issues.warns.push(t("vatNoWarn"));

  /* duplicate check */
  const reg = loadReg();
  const sup = $("fSupplier").value.trim().toLowerCase(), inv = $("fInvNo").value.trim().toLowerCase();
  if (sup && inv && g!==null){
    const exact = reg.find(r=>r.sup.toLowerCase()===sup && r.inv.toLowerCase()===inv && Math.abs(r.gross-g)<=0.01);
    const near  = reg.find(r=>r.sup.toLowerCase()===sup && (r.inv.toLowerCase()===inv || Math.abs(r.gross-g)<=0.01));
    if (exact) issues.errors.push(t("dupConfirmed"));
    else if (near) issues.warns.push(`${t("dupPossible")} ${esc(near.inv)} / ${fmt(near.gross)} (${esc(near.invDate||"")})`);
    else issues.infos.push(t("dupNone"));
  }
  return issues;
}

function validateInvoice(){
  const {errors,warns,infos} = invoiceIssues();
  $("vatCheck").innerHTML =
    errors.map(m=>chk("err",m)).join("") + warns.map(m=>chk("warn",m)).join("") + infos.map(m=>chk("pass",m)).join("");
}

/* -------------------------- allocation lines ---------------------------- */
let alloc = [{acc:"", dept:"", an:"", amt:null}];

function accOptions(sel){
  const codes = Object.keys(REF.accounts).filter(c=>!REF.accounts[c].bs).sort();
  return `<option value="">${esc(t("selAcc"))}</option>` + codes.map(c=>{
    const a = REF.accounts[c];
    return `<option value="${c}" ${c===sel?"selected":""}>${c} — ${esc(a.desc)}${a.stat?" ["+t("statBadge")+"]":""}</option>`;
  }).join("");
}
function deptOptions(acc, sel){
  const allowed = REF.mapping[acc] || [];
  const deps = REF.departments.filter(d=>allowed.includes(d.code));
  return `<option value="">${esc(t("selDept"))}</option>` + deps.map(d=>`<option value="${d.code}" ${d.code===sel?"selected":""}>${d.code} — ${esc(d.name)}</option>`).join("");
}
function anOptions(sel){
  return `<option value="">${esc(t("selAn"))}</option>` + REF.hrCodes.map(h=>`<option value="${h.code}" ${h.code===sel?"selected":""}>${h.code} — ${esc(h.name)}</option>`).join("");
}

function renderAlloc(){
  const tb = $("allocBody");
  tb.innerHTML = alloc.map((l,i)=>{
    const acc = l.acc, isHR = l.dept==="6040";
    let meta = "";
    if (acc && !(REF.mapping[acc]||[]).length) meta = `<div class="acc-meta cat-b">${esc(t("noMapDept"))}</div>`;
    if (isHR && acc){
      const cat = hrCategory(acc);
      if (cat==="A") meta += `<div class="acc-meta cat-a">${esc(t("catA"))}</div>`;
      if (cat==="B") meta += `<div class="acc-meta cat-b">${esc(t("catB"))}</div>`;
      if (cat==="C1") meta += `<div class="acc-meta cat-a">${esc(t("catC1"))}</div>`;
    }
    return `<tr>
      <td><select data-i="${i}" data-f="acc">${accOptions(acc)}</select>${meta}</td>
      <td><select data-i="${i}" data-f="dept">${deptOptions(acc, l.dept)}</select></td>
      <td>${isHR
          ? `<select data-i="${i}" data-f="an">${anOptions(l.an)}</select>`
          : `<span class="acc-meta">${esc(t("anNotReq"))}</span>`}</td>
      <td><input type="number" step="0.01" min="0" value="${l.amt??""}" data-i="${i}" data-f="amt" style="text-align:end"></td>
      <td>${alloc.length>1?`<button class="rowdel" data-del="${i}" title="${esc(t("del"))}">✕</button>`:""}</td>
    </tr>`;
  }).join("");

  tb.querySelectorAll("select,input").forEach(el=>{
    el.addEventListener("change", e=>{
      const i = +e.target.dataset.i, f = e.target.dataset.f;
      if (f==="amt") alloc[i].amt = e.target.value===""?null:parseFloat(e.target.value);
      else alloc[i][f] = e.target.value;
      if (f==="acc"){ alloc[i].dept=""; alloc[i].an=""; }
      if (f==="dept" && e.target.value!=="6040") alloc[i].an="";
      renderAlloc(); validateCoding();
    });
  });
  tb.querySelectorAll("[data-del]").forEach(b=>b.addEventListener("click", e=>{
    alloc.splice(+e.target.dataset.del,1); renderAlloc(); validateCoding();
  }));

  $("hrConfirmWrap").hidden = !alloc.some(l=>l.dept==="6040" && l.acc && hrCategory(l.acc)==="A");
  updateAllocSum();
}
$("addAllocBtn").addEventListener("click", ()=>{ alloc.push({acc:"",dept:"",an:"",amt:null}); renderAlloc(); });
$("hrConfirm") && $("hrConfirm").addEventListener("change", validateCoding);

function updateAllocSum(){
  const sum = r2(alloc.reduce((s,l)=>s+(l.amt||0),0));
  const n = num("fNet");
  $("allocSum").textContent = `${t("allocSumLbl")} ${fmt(sum)}${n!==null?` / ${fmt(n)} ${t("ofNet")}`:""}`;
}

function codingIssues(){
  const errors=[], warns=[];
  const lines = alloc.filter(l=>l.acc||l.dept||l.amt);
  if (!lines.length || lines.some(l=>!l.acc||!l.dept||l.amt===null||isNaN(l.amt))) errors.push(t("allocEmpty"));
  lines.forEach(l=>{
    if (l.acc && l.dept && !(REF.mapping[l.acc]||[]).includes(l.dept)) errors.push(`${l.acc} × ${l.dept}: ${t("noMapDept")}`);
    if (l.dept==="6040"){
      const cat = l.acc ? hrCategory(l.acc) : null;
      if (cat==="B") errors.push(t("catBBlocked"));
      if (cat==="A" && !($("hrConfirm")&&$("hrConfirm").checked)) errors.push(t("catANeedsConfirm"));
      if (cat==="C1") warns.push(t("catC1"));
      if (!l.an) errors.push(t("hrAnMissing"));
    }
  });
  const n = num("fNet");
  const sum = r2(lines.reduce((s,l)=>s+(l.amt||0),0));
  if (n!==null && lines.length && Math.abs(sum-n)>0.02) errors.push(`${t("allocMismatch")} (${fmt(sum)} ≠ ${fmt(n)})`);
  return {errors,warns,lines};
}
function validateCoding(){
  const {errors,warns} = codingIssues();
  $("codingChecks").innerHTML = errors.map(m=>chk("err",m)).join("") + warns.map(m=>chk("warn",m)).join("");
  updateAllocSum();
}
$("fNet").addEventListener("input", updateAllocSum);

/* ------------------------------ build JV -------------------------------- */
let currentJV = null;

$("buildBtn").addEventListener("click", ()=>{
  validateInvoice(); validateCoding();
  const inv = invoiceIssues(), cod = codingIssues();
  if (inv.errors.length || cod.errors.length){
    $("jvWrap").hidden = true;
    alert(t("buildFirst"));
    return;
  }
  const rateSel = $("fRate").value;
  const n = num("fNet"), v = num("fVat")||0, g = num("fGross");
  const sup = $("fSupplier").value.trim(), supCode = $("fSupCode").value.trim(), invNo = $("fInvNo").value.trim(), invDate = $("fInvDate").value;
  const desc = $("fDesc").value.trim(), curr = $("fCurr").value;
  const ref = "APJV-" + invDate.replace(/-/g,"") + "-" + invNo.replace(/[^A-Za-z0-9]/g,"").slice(-8).toUpperCase();

  const rows = [];
  cod.lines.forEach(l=>{
    const a = REF.accounts[l.acc];
    rows.push({acc:l.acc, name:a.desc, dept:l.dept, an:l.an||"", dr:r2(l.amt), cr:0, desc:`${sup} ${invNo} — ${desc}`});
  });
  if (rateSel==="15" && v>0){
    rows.push({acc:CONTROL.VAT_INPUT, name:REF.accounts[CONTROL.VAT_INPUT]?REF.accounts[CONTROL.VAT_INPUT].desc:"VAT Input", dept:"", an:"", dr:r2(v), cr:0, desc:`${t("vatLineDesc")} — ${invNo}`});
  } else if (v>0){
    // non-standard tax (e.g. 5% municipal fee): keep in expense? No — require review, add as warning-tagged debit line to first expense account is NOT allowed silently.
    rows.push({acc:"", name:t("uncertain"), dept:"", an:"", dr:r2(v), cr:0, desc:t("muniWarn"), uncertain:true});
  }
  const payableCode = supCode || CONTROL.AP_CONTROL;
  rows.push({acc:payableCode, name:REF.accounts[payableCode]?REF.accounts[payableCode].desc:"Account selected for supplier line", dept:"", an:"", dr:0, cr:r2(g), desc:`${t("apLineDesc")} — ${supCode ? `${supCode} / ` : ""}${sup} ${invNo}`});

  const totDr = r2(rows.reduce((s,r)=>s+r.dr,0));
  const totCr = r2(rows.reduce((s,r)=>s+r.cr,0));
  const diff = r2(totDr-totCr);
  const balanced = Math.abs(diff) <= 0.001 && !rows.some(r=>r.uncertain);

  /* confidence: exact ref match on all lines = high; demo mode = medium cap */
  let conf = 95;
  if (REF.demo) conf = Math.min(conf, 88);
  if (rows.some(r=>r.uncertain)) conf = 40;
  const confCls = conf>=95?"hi":conf>=80?"md":"lo";
  const confTxt = conf>=95?t("confHi"):conf>=80?t("confMd"):t("confLo");

  currentJV = {ref, invDate, sup, supCode, invNo, curr, rows, totDr, totCr, diff, balanced, gross:g, net:n, vat:v, conf};

  $("jvMeta").innerHTML = `
    <div><b>${esc(t("jvRef"))}:</b> <span dir="ltr">${esc(ref)}</span></div>
    <div><b>${esc(t("jvDate"))}:</b> <span dir="ltr">${esc(invDate)}</span></div>
    <div><b>${esc(t("jvSup"))}:</b> ${esc(sup)}</div>
    ${supCode ? `<div><b>${esc(t("jvSupCode"))}:</b> <span dir="ltr">${esc(supCode)}</span></div>` : ""}
    <div><b>${esc(t("jvInv"))}:</b> <span dir="ltr">${esc(invNo)}</span> · ${esc(curr)}</div>`;

  $("jvBody").innerHTML = rows.map(r=>`<tr>
    <td dir="ltr">${esc(r.acc)||"—"}</td><td>${esc(r.name)}${r.desc?`<div class="acc-meta">${esc(r.desc)}</div>`:""}</td>
    <td dir="ltr">${esc(r.dept)||"—"}</td><td dir="ltr">${esc(r.an)||"—"}</td>
    <td class="n">${r.dr?fmt(r.dr):""}</td><td class="n">${r.cr?fmt(r.cr):""}</td>
  </tr>`).join("");

  $("jvFoot").innerHTML = `<tr>
    <td colspan="4">${esc(t("totalDr"))} / ${esc(t("totalCr"))} — ${esc(t("diff"))}: <span dir="ltr">${fmt(diff)}</span></td>
    <td class="n">${fmt(totDr)}</td><td class="n">${fmt(totCr)}</td></tr>`;

  $("jvChecks").innerHTML =
    (balanced ? chk("pass", t("jvBalanced")) : chk("err", t("jvImbalance") + ` (${t("diff")}: ${fmt(diff)})`)) +
    chk("info", `${t("confLbl")}: <b>${conf}%</b> — ${confTxt} <span class="badge ${confCls}">${conf}%</span>${REF.demo?" "+t("demoTag"):""}`) +
    chk("warn", t("approval"));

  $("jvWrap").hidden = false;
  if ($("jvWrap").scrollIntoView) $("jvWrap").scrollIntoView({behavior:"smooth"});
});

/* ------------------------------ exports --------------------------------- */
function dl(name, content, mime){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["\uFEFF"+content], {type:mime||"text/csv;charset=utf-8"}));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
}
const csvCell = s => `"${String(s??"").replace(/"/g,'""')}"`;

$("csvBtn").addEventListener("click", ()=>{
  if (!currentJV) return;
  const j = currentJV;
  const head = ["DRAFT - NOT A PRODUCTION SUNSYSTEMS IMPORT FILE - HUMAN APPROVAL REQUIRED"];
  const cols = ["JournalRef","TransDate","AccountCode","AccountDesc","Department","AnalysisCode","Description","Currency","Debit","Credit"];
  const lines = j.rows.map(r=>[j.ref, j.invDate, r.acc, r.name, r.dept, r.an, r.desc, j.curr, r.dr?r.dr.toFixed(2):"", r.cr?r.cr.toFixed(2):""].map(csvCell).join(","));
  dl(`${j.ref}_DRAFT.csv`, head.join("\n")+"\n"+cols.join(",")+"\n"+lines.join("\n"));
});

$("copyBtn").addEventListener("click", ()=>{
  if (!currentJV) return;
  const j = currentJV;
  const w = 44;
  let out = `${t("jvRef")}: ${j.ref}\n${t("jvDate")}: ${j.invDate}\n${t("jvSup")}: ${j.sup}\n${j.supCode ? `${t("jvSupCode")}: ${j.supCode}\n` : ""}${t("jvInv")}: ${j.invNo} (${j.curr})\n\n`;
  j.rows.forEach(r=>{
    const side = r.dr? t("drLine") : t("crLine");
    const amt = r.dr? r.dr : r.cr;
    out += `${side} ${r.acc||"????"} — ${r.name}${r.dept?`  Dept ${r.dept}`:""}${r.an?`  An ${r.an}`:""}  ${fmt(amt)}\n`;
  });
  out += `\n${t("totalDr")}: ${fmt(j.totDr)}\n${t("totalCr")}: ${fmt(j.totCr)}\n${t("diff")}: ${fmt(j.diff)}\n`;
  out += j.balanced ? t("jvBalanced") : t("jvImbalance");
  out += `\n${t("approval")}\n`;
  navigator.clipboard.writeText(out).then(()=>alert(t("copied")));
});

$("printBtn").addEventListener("click", ()=>window.print());

/* ------------------------------ register -------------------------------- */
const REG_KEY = "apjvRegister";
const loadReg = ()=>{ try{ return JSON.parse(localStorage.getItem(REG_KEY))||[]; }catch(e){ return []; } };
const saveRegData = d => localStorage.setItem(REG_KEY, JSON.stringify(d));

$("saveBtn").addEventListener("click", ()=>{
  if (!currentJV) return;
  const j = currentJV;
  const reg = loadReg();
  reg.unshift({ts:new Date().toISOString().slice(0,16).replace("T"," "), sup:j.sup, inv:j.invNo, invDate:j.invDate, gross:j.gross, ref:j.ref});
  saveRegData(reg); renderRegister(); validateInvoice();
  alert(t("savedReg"));
});

function renderRegister(){
  const reg = loadReg();
  $("regBody").innerHTML = reg.length ? reg.map((r,i)=>`<tr>
    <td dir="ltr">${esc(r.ts)}</td><td>${esc(r.sup)}</td><td dir="ltr">${esc(r.inv)}</td>
    <td dir="ltr">${esc(r.invDate)}</td><td class="n">${fmt(r.gross)}</td><td dir="ltr">${esc(r.ref)}</td>
    <td><button class="rowdel" data-rdel="${i}">✕</button></td></tr>`).join("")
    : `<tr><td colspan="7" style="text-align:center;color:var(--muted)">${esc(t("regEmpty"))}</td></tr>`;
  $("regBody").querySelectorAll("[data-rdel]").forEach(b=>b.addEventListener("click", e=>{
    const reg2 = loadReg(); reg2.splice(+e.target.dataset.rdel,1); saveRegData(reg2); renderRegister(); validateInvoice();
  }));
}
$("regCsvBtn").addEventListener("click", ()=>{
  const reg = loadReg();
  const cols = ["SavedAt","Supplier","InvoiceNo","InvoiceDate","Gross","JVRef"];
  dl("AP_Invoice_Register.csv", cols.join(",")+"\n"+reg.map(r=>[r.ts,r.sup,r.inv,r.invDate,r.gross,r.ref].map(csvCell).join(",")).join("\n"));
});
$("regClearBtn").addEventListener("click", ()=>{
  if (confirm(t("confirmClear"))){ saveRegData([]); renderRegister(); validateInvoice(); }
});

/* -------------------------------- init ---------------------------------- */
document.getElementById("langBtn").addEventListener("click", ()=>{
  lang = lang==="ar" ? "en" : "ar";
  localStorage.setItem("apjvLang", lang);
  applyLang();
});
applyLang();
renderAlloc();
renderRegister();
