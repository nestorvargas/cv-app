require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./db');
const { ensureAdminUser } = require('./lib/auth');
const { requireAuth } = require('./middleware/auth');

const cvRoutes = require('./routes/cv');
const pdfRoutes = require('./routes/pdf');
const uploadRoutes = require('./routes/upload');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const aiRoutes = require('./routes/ai');
const catalogRoutes = require('./routes/catalog');

const app = express();
const PORT = process.env.PORT || 3001;

// Number of proxy hops in front of the app (e.g. "2" for cloudflared + nginx),
// so req.ip is the real client IP for login rate limiting.
if (process.env.TRUST_PROXY) {
  const hops = Number(process.env.TRUST_PROXY);
  app.set('trust proxy', Number.isNaN(hops) ? process.env.TRUST_PROXY : hops);
}

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', requireAuth, express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cv', requireAuth, cvRoutes);
app.use('/api/pdf', requireAuth, pdfRoutes);
app.use('/api/upload', requireAuth, uploadRoutes);
app.use('/api/ai', requireAuth, aiRoutes);
app.use('/api/catalog', requireAuth, catalogRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

initDb().then(ensureAdminUser).then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to init DB:', err);
  process.exit(1);
});
