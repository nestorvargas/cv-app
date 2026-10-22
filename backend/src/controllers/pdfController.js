const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const { SESSION_COOKIE } = require('../lib/auth');

const FRONTEND_URL = process.env.FRONTEND_INTERNAL_URL || 'http://frontend:5173';

async function generatePdf(req, res) {
  const { profileName, lang } = req.params;
  let browser;
  try {
    const tmpl = req.query.template || 'classic';
    const accentColor = req.query.accentColor ? decodeURIComponent(req.query.accentColor) : '';
    const bgColor     = req.query.bgColor     ? decodeURIComponent(req.query.bgColor)     : '';

    // Build print URL — URLSearchParams handles encoding of '#' in colors
    const qs = new URLSearchParams({ template: tmpl });
    if (accentColor) qs.set('accentColor', accentColor);
    if (bgColor)     qs.set('bgColor',     bgColor);
    const printUrl = `${FRONTEND_URL}/print/${encodeURIComponent(profileName)}/${encodeURIComponent(lang)}?${qs}`;

    browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    // The print page fetches the CV through the authenticated API: reuse the caller's session.
    await page.setCookie({ name: SESSION_COOKIE, value: req.sessionToken, url: FRONTEND_URL });
    // Match the CSS pixel dimensions used by CVPagedViewer (794 × 1123)
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    if (tmpl === 'ats') await page.emulateMediaType('print');
    await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    // Wait until PrintPage signals it is ready (fonts loaded + layout stable)
    await page.waitForFunction(() => window.__CV_READY__ === true, { timeout: 20000 });

    const filename = `CV_NestorVargas_${profileName}_${lang.toUpperCase()}.pdf`;

    if (tmpl === 'ats') {
      // Real-text PDF: renders the actual document flow (no screenshots), so the
      // output has selectable, extractable text that ATS/AI parsers can read.
      const pdfBytes = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '0', bottom: '0', left: '0', right: '0' },
      });
      await browser.close();
      browser = null;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(Buffer.from(pdfBytes));
      return;
    }

    const pageEls = await page.$$('.cv-page');
    if (pageEls.length === 0) {
      throw new Error('No CV pages found in print view');
    }

    // Screenshot each page element (captures the overflow:hidden clipped view)
    const screenshots = [];
    for (const el of pageEls) {
      const buf = await el.screenshot({ type: 'png' });
      screenshots.push(buf);
    }

    await browser.close();
    browser = null;

    // Build a multi-page PDF from the screenshots
    const pdfDoc = await PDFDocument.create();
    const A4_W = 595.28;  // points
    const A4_H = 841.89;

    for (const pngBuf of screenshots) {
      const img      = await pdfDoc.embedPng(pngBuf);
      const pdfPage  = pdfDoc.addPage([A4_W, A4_H]);
      pdfPage.drawImage(img, { x: 0, y: 0, width: A4_W, height: A4_H });
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    if (browser) await browser.close();
    console.error('[pdfController]', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

module.exports = { generatePdf };
