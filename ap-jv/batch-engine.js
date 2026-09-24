/* AP-JV Batch Invoice Reader
   Reads multiple invoice files locally, all PDF pages, images and scanned PDFs.
   It extracts invoice metadata only; GL coding remains a human-controlled step.
*/
"use strict";
(()=>{
  const $b=id=>document.getElementById(id);
  const escb=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const rb=x=>Math.round((Number(x)+Number.EPSILON)*100)/100;
  const amount=s=>{
    if(s==null)return null;
    const m=String(s).replace(/[٬,\s]/g,"").replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    const v=parseFloat(m); return Number.isFinite(v)?v:null;
  };
  const norm=s=>String(s||"").toLowerCase().normalize("NFKC").replace(/[\s\-_.،,:;\/\\]+/g,"").replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي");

  const state={rows:[],busy:false,ocr:null};

  const style=document.createElement("style");
  style.textContent=`
    .batch-box{margin-top:14px;border:1px solid var(--line);border-radius:12px;background:#fbfcfe;padding:14px}
    .batch-head{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
    .batch-title{font-weight:800;color:var(--navy);font-size:13px}
    .batch-actions{display:flex;gap:8px;flex-wrap:wrap}
    .batch-table{width:100%;border-collapse:collapse;margin-top:12px;font-size:11.5px}
    .batch-table th,.batch-table td{border:1px solid var(--line);padding:6px 7px;vertical-align:top}
    .batch-table th{background:#f0f4f8;color:var(--navy)}
    .batch-table .ok{color:var(--ok);font-weight:800}.batch-table .warn{color:var(--warn);font-weight:800}.batch-table .err{color:var(--err);font-weight:800}
    .batch-progress{margin-top:8px;font-size:12px;color:var(--muted);white-space:pre-line}
    .batch-mini{font-size:10.5px;color:var(--muted)}
    .batch-scroll{overflow:auto}
  `;
  document.head.appendChild(style);

  const host=$b("dropzone")?.parentElement;
  if(!host)return;
  const box=document.createElement("div");
  box.className="batch-box";
  box.innerHTML=`
    <div class="batch-head">
      <div>
        <div class="batch-title">📚 قراءة مجموعة فواتير تلقائيًا</div>
        <div class="batch-mini">PDF / JPG / JPEG / PNG — جميع صفحات PDF — OCR عربي + إنجليزي عند الحاجة</div>
      </div>
      <div class="batch-actions">
        <button id="batchPick" class="btn primary" type="button">رفع مجموعة فواتير</button>
        <button id="batchClear" class="btn ghost" type="button">مسح النتائج</button>
        <input id="batchInput" type="file" accept=".pdf,image/jpeg,image/png,.jpg,.jpeg" multiple hidden>
      </div>
    </div>
    <div id="batchProgress" class="batch-progress"></div>
    <div id="batchResults" class="batch-scroll"></div>
  `;
  host.appendChild(box);

  $b("batchPick").onclick=()=>$b("batchInput").click();
  $b("batchClear").onclick=()=>{state.rows=[];render();$b("batchProgress").textContent="";};
  $b("batchInput").addEventListener("change",async e=>{
    const files=[...e.target.files]; e.target.value="";
    if(files.length) await processFiles(files);
  });

  function supplierMatch(text,qrName){
    const sups=(typeof REF!=="undefined"&&REF.suppliers)||[];
    const source=norm(qrName||"");
    if(source){
      let exact=sups.find(s=>norm(s.name)===source);
      if(exact)return exact;
      exact=sups.find(s=>source.includes(norm(s.name))||norm(s.name).includes(source));
      if(exact)return exact;
    }
    const nt=norm(text);
    let best=null,score=0;
    for(const s of sups){
      const n=norm(s.name);
      if(n.length<5)continue;
      let sc=0;
      if(nt.includes(n))sc=n.length;
      else{
        const words=n.split(/(?=[A-Z])/).filter(w=>w.length>3);
        sc=words.filter(w=>nt.includes(w)).length*4;
      }
      if(sc>score){score=sc;best=s;}
    }
    return score>=8?best:null;
  }

  function pick(re,text){
    for(const r of re){const m=text.match(r);if(m&&m[1])return m[1].trim();}
    return "";
  }
  function parseExtract(text,qr){
    const t=String(text||"").replace(/\r/g,"").replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g,d=>"۰۱۲۳۴۵۶۷۸۹".indexOf(d));
    const inv=pick([
      /(?:invoice\s*(?:no|number|#)|inv\.?\s*(?:no|#)|رقم\s*الفاتورة|فاتورة\s*رقم)\s*[:#\-]?\s*([A-Za-z0-9٠-٩\/\-]{2,})/i,
      /\bINV[-\s\/]?([A-Za-z0-9\-\/]{3,})\b/i
    ],t);
    const vatNo=pick([/(?:tax\s*(?:registration\s*)?(?:no|number)|vat\s*(?:no|number)|الرقم\s*الضريبي)\s*[:#]?\s*(3\d{13}3)/i,/\b(3\d{13}3)\b/],t);
    let date=pick([
      /(?:invoice\s*date|date|تاريخ\s*الفاتورة|تاريخ)\s*[:#]?\s*(\d{4}[\-\/.]\d{1,2}[\-\/.]\d{1,2})/i,
      /(?:invoice\s*date|date|تاريخ\s*الفاتورة|تاريخ)\s*[:#]?\s*(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{4})/i,
      /\b(\d{4}-\d{2}-\d{2})\b/
    ],t);
    if(date){
      const m=date.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
      if(m)date=`${m[3]}-${m[2].padStart(2,"0")}-${m[1].padStart(2,"0")}`;
      else date=date.replace(/\//g,"-").replace(/\.(?=\d)/g,"-");
    }
    const po=pick([/(?:P\.?\s*O\.?|purchase\s*order|أمر\s*(?:ال)?شراء)\s*(?:no|number|#|رقم)?\s*[:#\-]?\s*([A-Za-z0-9\/\-]{3,})/i],t);
    const gross=amount(pick([
      /(?:grand\s*total|total\s*(?:amount)?\s*(?:incl|including|with)|amount\s*due|total\s*due|الإجمالي\s*(?:شامل|مع)|المجموع\s*الكلي|الإجمالي)\s*[^0-9]{0,30}([\d,]+(?:\.\d{1,2})?)/i
    ],t));
    const vat=amount(pick([
      /(?:VAT|tax|ضريبة(?:\s*القيمة\s*المضافة)?)\s*(?:\(?\s*15\s*%?\s*\)?)?\s*[:\-]?\s*[^0-9]{0,20}([\d,]+(?:\.\d{1,2})?)/i
    ],t));
    const net=amount(pick([
      /(?:subtotal|sub\s*total|net\s*(?:amount)?|before\s*tax|الصافي|المجموع\s*الفرعي|الإجمالي\s*قبل\s*الضريبة)\s*[:\-]?\s*[^0-9]{0,20}([\d,]+(?:\.\d{1,2})?)/i
    ],t));
    let n=net,v=vat,g=gross;
    if(n==null&&g!=null&&v!=null)n=rb(g-v);
    if(g==null&&n!=null&&v!=null)g=rb(n+v);
    if(v==null&&n!=null&&g!=null)v=rb(g-n);
    const supplier=pick([
      /(?:supplier|seller|vendor|اسم\s*المورد|اسم\s*البائع|المورد)\s*[:#\-]?\s*([^\n\r]{3,100})/i
    ],t);
    const desc=pick([
      /(?:description|item\s*description|الوصف|البيان)\s*[:#\-]?\s*([^\n\r]{3,120})/i
    ],t);
    const sm=supplierMatch(t,qr?.seller||supplier);
    const finalSupplier=sm?.name||supplier||qr?.seller||"";
    const finalVat=qr?.vat||vatNo;
    const finalGross=qr?.gross!=null?amount(qr.gross):g;
    const finalVatAmt=qr?.vatAmount!=null?amount(qr.vatAmount):v;
    const finalNet=(finalGross!=null&&finalVatAmt!=null)?rb(finalGross-finalVatAmt):n;
    return {
      supplier:finalSupplier,supCode:sm?.code||"",vatNo:finalVat||"",invNo:inv||"",invDate:qr?.date||date||"",dueDate:"",
      po,curr:"SAR",desc:desc||"Invoice",net:finalNet,vat:finalVatAmt,gross:finalGross,
      matchedSupplier:!!sm,text:t
    };
  }

  function qrFromCanvas(canvas){
    try{
      if(typeof jsQR!=="function")return null;
      const c=canvas.getContext("2d"),im=c.getImageData(0,0,canvas.width,canvas.height),q=jsQR(im.data,im.width,im.height);
      if(!q?.data||typeof decodeZatcaTLV!=="function")return null;
      const z=decodeZatcaTLV(q.data); if(!z)return null;
      return {seller:z[1]||"",vat:z[2]||"",date:(z[3]||"").slice(0,10),gross:z[4]||"",vatAmount:z[5]||""};
    }catch(e){return null;}
  }

  async function imageToData(file){
    const url=URL.createObjectURL(file);
    try{
      const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url;});
      const max=2200,scale=Math.min(1,max/Math.max(img.width,img.height));
      const c=document.createElement("canvas");c.width=Math.max(1,Math.round(img.width*scale));c.height=Math.max(1,Math.round(img.height*scale));
      c.getContext("2d").drawImage(img,0,0,c.width,c.height);
      return {canvas:c,dataUrl:c.toDataURL("image/jpeg",.9)};
    }finally{URL.revokeObjectURL(url);}
  }

  async function loadOCR(){
    if(state.ocr)return state.ocr;
    if(typeof Tesseract==="undefined"){
      await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";s.onload=res;s.onerror=rej;document.head.appendChild(s);});
    }
    state.ocr=Tesseract.createWorker("ara+eng");
    return state.ocr;
  }
  async function ocrImage(dataUrl){
    const w=await loadOCR();
    const r=await w.recognize(dataUrl);
    return r?.data?.text||"";
  }

  async function processImage(file){
    const x=await imageToData(file);
    const qr=qrFromCanvas(x.canvas);
    let text="";
    try{text=await ocrImage(x.dataUrl);}catch(e){}
    return parseExtract(text,qr);
  }

  async function processPDF(file){
    if(typeof pdfjsLib==="undefined")throw new Error("PDF library unavailable");
    pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const pdf=await pdfjsLib.getDocument({data:await file.arrayBuffer()}).promise;
    let allText="",qr=null,ocrNeeded=false;
    for(let p=1;p<=pdf.numPages;p++){
      const page=await pdf.getPage(p);
      const tc=await page.getTextContent();
      const pt=tc.items.map(i=>i.str).join(" ");
      allText+=pt+"\n";
      if(!qr){
        const vp=page.getViewport({scale:2});
        const c=document.createElement("canvas");c.width=Math.round(vp.width);c.height=Math.round(vp.height);
        await page.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;
        qr=qrFromCanvas(c)||qr;
        if(pt.trim().length<50)ocrNeeded=true;
        if(ocrNeeded){
          try{allText+="\n"+await ocrImage(c.toDataURL("image/jpeg",.85));}catch(e){}
        }
      }
      else if(pt.trim().length<30)ocrNeeded=true;
      if(ocrNeeded && p>1){
        const vp=page.getViewport({scale:2});
        const c=document.createElement("canvas");c.width=Math.round(vp.width);c.height=Math.round(vp.height);
        await page.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;
        try{allText+="\n"+await ocrImage(c.toDataURL("image/jpeg",.85));}catch(e){}
      }
    }
    return {...parseExtract(allText,qr),pages:pdf.numPages};
  }

  function quality(r){
    const fields=[r.supplier,r.invNo,r.invDate,r.net,r.vat,r.gross,r.vatNo];
    const got=fields.filter(x=>x!==""&&x!==null&&x!==undefined).length;
    if(r.matchedSupplier&&got>=6)return ["PASS","ok"];
    if(got>=4)return ["REVIEW","warn"];
    return ["INCOMPLETE","err"];
  }

  function render(){
    const el=$b("batchResults");
    if(!state.rows.length){el.innerHTML="";return;}
    el.innerHTML=`
      <table class="batch-table">
        <thead><tr><th>#</th><th>الملف</th><th>المورد / الكود</th><th>الفاتورة</th><th>التاريخ</th><th>الصافي</th><th>VAT</th><th>الإجمالي</th><th>الحالة</th><th></th></tr></thead>
        <tbody>
        ${state.rows.map((x,i)=>{
          const [q,cl]=quality(x);
          return `<tr>
            <td>${i+1}</td><td><b>${escb(x.file)}</b><div class="batch-mini">${x.pages?x.pages+" pages":""}</div></td>
            <td>${escb(x.supplier||"—")}<div class="batch-mini">${escb(x.supCode||"غير مطابق")}</div></td>
            <td dir="ltr">${escb(x.invNo||"—")}</td><td dir="ltr">${escb(x.invDate||"—")}</td>
            <td dir="ltr">${x.net==null?"—":Number(x.net).toFixed(2)}</td><td dir="ltr">${x.vat==null?"—":Number(x.vat).toFixed(2)}</td><td dir="ltr">${x.gross==null?"—":Number(x.gross).toFixed(2)}</td>
            <td class="${cl}">${q}</td>
            <td><button class="btn secondary batch-load" data-i="${i}" type="button">تحميل</button></td>
          </tr>`;
        }).join("")}
        </tbody>
      </table>`;
    el.querySelectorAll(".batch-load").forEach(b=>b.onclick=()=>loadRow(+b.dataset.i));
  }

  function loadRow(i){
    const r=state.rows[i]; if(!r)return;
    const map={fSupplier:r.supplier,fSupCode:r.supCode,fVatNo:r.vatNo,fInvNo:r.invNo,fInvDate:r.invDate,fDueDate:r.dueDate,fPO:r.po,fCurr:r.curr,fDesc:r.desc,fNet:r.net,fVat:r.vat,fGross:r.gross};
    Object.entries(map).forEach(([id,v])=>{if($b(id))$b(id).value=v==null?"":v;});
    if($b("fRate"))$b("fRate").value=(r.vat&&r.net&&Math.abs(Number(r.vat)-rb(Number(r.net)*.15))<=.03)?"15":"0";
    if(typeof validateInvoice==="function")validateInvoice();
    if(typeof updateAllocSum==="function")updateAllocSum();
    if(typeof setDocStatus==="function")setDocStatus("✔ تم تحميل الفاتورة المختارة إلى بيانات الفاتورة — راجعها ثم أكمل التوجيه المحاسبي.");
    window.scrollTo({top:$b("wrap_fSupplier")?.closest(".step")?.offsetTop||0,behavior:"smooth"});
  }

  async function processFiles(files){
    if(state.busy)return;
    state.busy=true;
    $b("batchPick").disabled=true;
    state.rows=[];
    for(let i=0;i<files.length;i++){
      const f=files[i];
      $b("batchProgress").textContent=`جاري قراءة ${i+1} من ${files.length}: ${f.name}`;
      try{
        const r=/\.pdf$/i.test(f.name)||f.type==="application/pdf"?await processPDF(f):await processImage(f);
        state.rows.push({...r,file:f.name});
      }catch(e){
        state.rows.push({file:f.name,supplier:"",supCode:"",invNo:"",invDate:"",net:null,vat:null,gross:null,error:String(e?.message||e)});
      }
      render();
    }
    const pass=state.rows.filter(r=>quality(r)[0]==="PASS").length;
    const review=state.rows.length-pass;
    $b("batchProgress").textContent=`اكتمل: ${state.rows.length} فاتورة — PASS: ${pass} — مراجعة: ${review}.\nتمت القراءة محليًا في المتصفح؛ لم يتم إرسال ملفات الفواتير إلى خادم.`;
    state.busy=false;$b("batchPick").disabled=false;
    if(state.rows[0])loadRow(0);
  }

  window.APJVBATCH={state,processFiles,loadRow};
})();