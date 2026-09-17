# Fawaz Eltahir — Bilingual GitHub Pages Portfolio

Arabic + English portfolio in one responsive website.

## Repository
`fawaztahir79/fawaz-portfolio`

## GitHub Pages
1. Upload the contents of this folder to the repository root.
2. Commit to `main`.
3. Go to **Settings → Pages**.
4. Select **Deploy from a branch**.
5. Branch: `main`; folder: `/(root)`.
6. Save.

Expected URL:
`https://fawaztahir79.github.io/fawaz-portfolio/`

## Structure
- `index.html` — bilingual website
- `ap-jv/` — **AP Invoice → JV Tool** (Waves Hotel WHU): bilingual browser tool that extracts invoice data (ZATCA QR / PDF text / OCR / paste), runs deterministic VAT & duplicate checks, enforces GL account–department mapping (incl. Dept 6040 HR rules and 335xxx analysis codes), and generates a balanced Journal Voucher draft with a DRAFT SunSystems CSV export. 100% client-side — no data leaves the browser. The August 2026 reference workbook is embedded at build time (departments, complete available COA, approved account-department mapping, and all 335xxx analysis codes), while the Excel upload remains available for future updates.
  - Live: `https://fawaztahir79.github.io/fawaz-portfolio/ap-jv/`
- `style.css` — responsive design
- `script.js` — Arabic/English language switcher with saved preference
- `assets/profile.png` — profile photo
- `cv/Fawaz_Eltahir_Visual_CV_2026.pdf` — linked visual CV

## Language
English is the default. The Arabic button switches the entire interface to RTL Arabic. The selection is saved in the browser.

LinkedIn:
https://www.linkedin.com/in/fawazatiatallah
