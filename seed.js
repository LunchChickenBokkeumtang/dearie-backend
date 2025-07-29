// backend/seed.js
require('dotenv').config();
const mongoose     = require('mongoose');
const Notification = require('./models/Notification');

async function seed() {
  // 1) MongoDB 연결
  await mongoose.connect(process.env.MONGODB_URI);
  await Notification.deleteMany({ userId: 'testUser' });
  console.log('🔗 MongoDB connected for seeding');

  // 2) 삽입할 샘플 데이터 배열
  const raw1 = [
    {
      userId:  'testUser',
      type:    'TXT',
      title:   '💌 연준님이 포스트를 작성했습니다 : 그냥 잠깐의 순간을 담아봤어요. 늘 함께할 수 있어서...',
      message: 'TXT',
      payload: { url: '/artistPostDetail/txt/post/0', },
      dayTime : '2025. 08. 10. 18:00'
    },
    {
      userId:  'testUser',
      type:    'TXT',
      title:   '✨ 새 트윗 : The Star Chapter: TOGETHER - Mood Teas...',
      message: 'TXT',
      payload: { imageUrl: '/media/txt-Mood.png' ,
        url : 'https://x.com/bighit_music/status/1944049131384950793?s=46',
      },
      dayTime : '2025. 08. 10. 22:00'
    },
    {
      userId:  'testUser',
      type:    'AESPA',
      title:   '💌 닝닝님이 포스트를 작성했습니다 : 안녕하세요 닝닝입니다. 팬들 덕분에 항상 힘을...',
      message: 'AESPA',
      payload: { url: '/artistPostDetail/aespa/post/0', },
      dayTime : '2025. 08. 10. 14:00'
    },
    {
      userId:  'testUser',
      type:    'IVE',
      title:   '이서님이 포스트를 작성했습니다 : 오늘 무대 진짜 재밌었어!! 너희 덕분에 에너지 팡팡 터졌지 뭐야 다음...',
      message: 'IVE',
      payload: { imageUrl: '/media/ive-media.png',
        url: '/artistPostDetail/ive/post/0',
      },
      dayTime : '2025. 08. 09. 16:00'
    },
  ];
  const raw2 = [
    {
      userId:  'testUser',
      type:    'TXT',
      title:   "✨ 새 트윗 : The Star Chapter: TOGETHER - TOGETHER 'Ghost Girl' P...",
      message: 'TXT',
      payload: { imageUrl: '/media/txt-star-chapter.png' ,
        url : 'https://x.com/bighit_music/status/1943686743301247228?s=46',
      },
      dayTime : '2025. 08. 09. 22:00'
    },
    {
      userId:  'testUser',
      type:    'AESPA',
      title:   '📺 새 미디어 : AESPA [Dirty Work] Choreography Video 공개',
      message: 'AESPA',
      payload: { imageUrl: '/media/aespa-work.png' ,
        url : 'https://x.com/aespa_official/status/1938447283324063780',
      },
      dayTime : '2025. 08. 09. 16:00'
    },
    {
      userId:  'testUser',
      type:    'TXT',
      title:   '💌 수빈님이 포스트를 작성했습니다 : 햇살좋은 날, 조금 더 여유롭게 미소 지어봤어요. 여러분도 오늘 하루...',
      message: 'TXT',
      payload: { url: '/artistPostDetail/txt/post/1', },
      dayTime : '2025. 08. 09. 10:00'
    },
    {
      userId:  'testUser',
      type:    'RIIZE',
      title:   '원빈님이 포스트를 작성했습니다 : 오늘은 햇빛이 좋았어. 괜히 너한테 자랑하고 싶더라. 다음엔 같이 보자...',
      message: 'RIIZE',
      payload: { imageUrl: '/media/riize-chapter.png',
        url: '/artistPostDetail/riize/post/0'
       },
       dayTime : '2025. 08. 09. 16:00'
    },
    {
      userId:  'testUser',
      type:    'IU',
      title:   '아이유님이 포스트를 작성했습니다 : 오늘은 햇살이 너무 좋아서 기분이 한층 더 밝아졌어. 이렇게 멋진...',
      message: 'IU',
      payload: { imageUrl: '/media/iu-media.png',
        url: '/artistPostDetail/iu/post/0',
       },
       dayTime : '2025. 08. 09. 16:00'
    },
  ];

const samples  = raw1.map(obj => ({ ...obj, batch: 1 }));
const samples_2 = raw2.map(obj => ({ ...obj, batch: 2 }));

  // 3) 기존 동일 userId/type 문서를 삭제하고, 샘플 전체를 insertMany
// 4a) 첫 번째 배치 삽입
const inserted1 = await Notification.insertMany(samples);
console.log(`✅ 첫 번째 배열 ${inserted1.length}개 삽입`);

// 4b) 두 번째 배치 삽입
const inserted2 = await Notification.insertMany(samples_2);
console.log(`✅ 두 번째 배열 ${inserted2.length}개 삽입`);


  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
