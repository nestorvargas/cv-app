# PDF Generation

PDFs are generated server-side using **Puppeteer** (headless Chrome) + **pdf-lib**.

## Flow

```
Browser clicks "Download PDF"
  → GET /api/pdf/:profileName/:lang?template=X&accentColor=Y&bgColor=Z
  → pdfController.generatePdf()
    1. Launch Puppeteer headless Chromium
    2. Navigate to http://frontend:5173/print/:profileName/:lang?template=...
    3. Wait for window.__CV_READY__ === true
    4. Screenshot each .cv-page element at 2x device scale
    5. Assemble screenshots into A4 PDF with pdf-lib
    6. Return PDF as downloadable attachment
```

## Print page (`PrintPage.jsx`)

Standalone React component rendered when URL starts with `/print/`:

1. Parses `:profileName` and `:lang` from URL path
2. Loads `cvData` via API
3. Renders `CVPagedViewer` with the requested template and colors
4. After fonts load + 600ms stabilization delay, sets `window.__CV_READY__ = true`
5. Puppeteer detects this signal and proceeds to screenshot

## Screenshot → PDF assembly

- Each `.cv-page` div is a clip window (`overflow: hidden`) at A4 aspect ratio
- Screenshots are taken at 2x device scale factor for quality
- `pdf-lib` embeds each screenshot image into a separate A4 page (595.28 × 841.89 points)
- This is a **pixel-based** approach, not CSS print rendering

## Divergence from preview

PDF and React preview templates are separate implementations that must be kept synchronized:

| Aspect        | Preview (React)        | PDF (Node.js)          |
|---------------|------------------------|------------------------|
| Renderer      | JSX + CSS              | HTML string template   |
| Files         | `frontend/src/components/CVPreview/*.jsx` + `*.css` | `backend/src/templates/*Template.js` |
| Colors        | `--cv-accent`, `--cv-bg` CSS vars | Injected as CSS vars in inline `<style>` |
| Font          | Inter via Google Fonts  | Inter via Google Fonts |
| Image         | Direct `<img>` tag      | Base64-encoded `<img>` |
| Measurements  | px (screen pixels)     | pt (PDF points, 1pt ≈ 1.333px) |

See `.claude/agents/cv-pdf-sync.md` for a detailed diff table of known discrepancies.

## Docker considerations

- Chromium is installed as a system package in Alpine: `apk add chromium`
- Environment: `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`, `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser`
- Backend connects to frontend via `FRONTEND_INTERNAL_URL=http://frontend:5173` (Docker network)
- Fallback: `http://localhost:5173` if `FRONTEND_INTERNAL_URL` is not set

## Image embedding in PDF

1. Backend fetches the image from `http://frontend:5173/uploads/<path>` (internal Docker URL)
2. Converts response to base64
3. Embeds as `data:image/...;base64,...` in the HTML `<img>` tag
4. Requires the Docker volume `./backend/uploads:/app/uploads` to be mounted

## Troubleshooting

- **Blank PDF**: Check that `FRONTEND_INTERNAL_URL` is reachable from the backend container
- **Missing image in PDF**: Verify the file exists in `backend/uploads/<profileName>/` and the volume mount is correct
- **Puppeteer launch failure**: Likely missing Chromium dependencies in the Alpine image
- **Font mismatch**: Both systems load Inter from Google Fonts, but the PDF uses `pt` vs preview uses `px`
