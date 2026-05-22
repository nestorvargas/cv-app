const puppeteer = require('puppeteer');
const { pool } = require('../db');
const { buildCvHtml } = require('../templates/cvTemplate');
const { buildClassicHtml } = require('../templates/classicTemplate');
const { buildModernHtml } = require('../templates/modernTemplate');
const { buildExecutiveHtml } = require('../templates/executiveTemplate');
const { buildCreativeHtml } = require('../templates/creativeTemplate');
const { buildMinimalHtml } = require('../templates/minimalTemplate');
const path = require('path');
const fs = require('fs');

async function generatePdf(req, res) {
  const { profileName, lang } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM cv_profiles WHERE profile_name = $1 AND language = $2',
      [profileName, lang]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'CV not found' });
    }
    const cvData = result.rows[0];

    // If there is a profile image, embed it as base64
    let imageBase64 = null;
    if (cvData.profile_image) {
      const imagePath = path.join(__dirname, '..', '..', cvData.profile_image);
      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const ext = path.extname(cvData.profile_image).slice(1).replace('jpg', 'jpeg');
        imageBase64 = `data:image/${ext};base64,${imageBuffer.toString('base64')}`;
      }
    }

    const tmpl = req.query.template || 'classic';
    const accentColor = req.query.accentColor ? decodeURIComponent(req.query.accentColor) : undefined;
    const bgColor = req.query.bgColor ? decodeURIComponent(req.query.bgColor) : undefined;
    let html;
    if (tmpl === 'modern')         html = buildModernHtml(cvData, imageBase64, accentColor, bgColor);
    else if (tmpl === 'executive') html = buildExecutiveHtml(cvData, imageBase64, accentColor, bgColor);
    else if (tmpl === 'creative')  html = buildCreativeHtml(cvData, imageBase64, accentColor, bgColor);
    else if (tmpl === 'minimal')   html = buildMinimalHtml(cvData, imageBase64, accentColor, bgColor);
    else                           html = buildClassicHtml(cvData, imageBase64, accentColor, bgColor);

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    const filename = `CV_NestorVargas_${profileName}_${lang.toUpperCase()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

module.exports = { generatePdf };
