const admin = require('firebase-admin');
const User  = require('../../models/User');

async function notifyNearbyRiders(orderLng, orderLat, payload, excludeUserId) {
  console.log('notifyNearbyRiders 시작');

  // 1) 2km 반경 + 인증된 라이더만 조회
  const riders = await User.find({
    isRider: true,
    aroundAlarm: true,
    _id: { $ne: excludeUserId },
    $and: [
      { location: { $exists: true, $type: 'object' } },
      {
        location: {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [orderLng, orderLat] },
            $maxDistance: 2000,
          },
        },
      },
    ],
  }).select('fcmToken');

  const tokens = riders
    .map(r => r.fcmToken)
    .filter(t => typeof t === 'string' && t.length > 0);

  if (tokens.length === 0) return;

  // 2) 한 번에 최대 500개, 편의상 50개씩 잘라서
  const CHUNK_SIZE = 50;
  for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
    const chunkTokens = tokens.slice(i, i + CHUNK_SIZE);

    // 3) 각 토큰마다 send() 호출
    //    병렬 실행하고 싶으면 Promise.all로 묶어도 됩니다.
    await Promise.all(chunkTokens.map(async token => {
      const message = {
        token,  // <-- single token
        notification: {
          title: payload.title,
          body:  payload.body,
        },
        data: payload.data || {},
        apns: {
          payload: {
            aps: {
              contentAvailable: true,
              sound: 'default',
              alert: {
                title: payload.title,
                body:  payload.body,
              },
            },
          },
        },
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            vibrateTimingsMillis: [0, 250, 500],
          },
        },
      };

      try {
        await admin.messaging().send(message);
      } catch (err) {
        console.error(`FCM 전송 실패 (token=${token}):`, err.message);
        // 여기에 invalid token 제거 로직 추가 가능
      }
    }));
  }
}

module.exports = { notifyNearbyRiders };
