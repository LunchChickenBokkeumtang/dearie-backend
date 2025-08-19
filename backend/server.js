// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 모델 불러오기
const Notification = require('./models/Notification');

const app = express();
const port = process.env.PORT || 4000;

// ✅ CORS 설정
const rawAllowed = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = rawAllowed.split(',').map(s => s.trim()).filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // 서버-서버, Postman 등 허용
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ✅ JSON 파서
app.use(express.json());

// ✅ MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🎉 MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ 헬스체크
app.get('/', (req, res) => {
  res.send('OK');
});

// ✅ 알림 조회
app.get('/api/notifications', async (req, res) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' });
  }
  try {
    const list = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error('❌ Error fetching notifications:', err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// ✅ 읽음 처리
app.patch('/api/notifications/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error marking notification as read:', err);
    res.status(500).json({ error: 'Failed to mark as read' });
  }
});

// ✅ 서버 실행
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server listening on http://0.0.0.0:${port}`);
});
