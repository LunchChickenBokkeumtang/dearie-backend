// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Notification = require('./models/Notification');

const app = express();
const port = process.env.PORT || 4000;

/* -------------------- CORS (한 번만!) -------------------- */
const rawAllowed =
  process.env.ALLOWED_ORIGINS ||
  process.env.CORS_ORIGIN || ''; // 옛 키도 지원

const allowedOrigins = rawAllowed.split(',').map(s => s.trim()).filter(Boolean);

// 디버그 로그
console.log('ALLOWED_ORIGINS =>', allowedOrigins);
app.use((req, _res, next) => {
  if (req.headers.origin) console.log('Incoming Origin =>', req.headers.origin);
  next();
});

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);              // 서버-서버/포스트맨 허용
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));                 // 프리플라이트
/* -------------------------------------------------------- */

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🎉 MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

app.get('/', (_req, res) => res.send('OK'));

app.get('/api/notifications', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId query parameter is required' });
  try {
    const list = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error marking notification as read:', err);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server listening on http://0.0.0.0:${port}`);
});
