const puppeteer = require('puppeteer');
const { pool } = require('../db');
const { buildCvHtml } = require('../templates/cvTemplate');
const path = require('path');
const fs = require('fs');

async function generatePdf(req, res) {
  const { lang } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM cv_profiles WHERE language = $1',
      [lang]
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

    const html = buildCvHtml(cvData, imageBase64);

    const browser = await puppeteer.launch({
      headless: 'new',
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await browser.close();

    const filename = `CV_NestorVargas_${lang.toUpperCase()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdf);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

module.exports = { generatePdf };
