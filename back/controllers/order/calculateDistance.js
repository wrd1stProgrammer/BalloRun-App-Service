
const admin = require('firebase-admin');
const User  = require('../../models/User');

async function notifyNearbyRiders(orderLng, orderLat, payload,excludeUserId) {
  // 1) 2km 반경 + 인증된 라이더만 조회
  const riders = await User.find({
    isRider: true,
    aroundAlarm: true,
    _id: { $ne: excludeUserId },
    $and: [
      { location: { $exists: true, $type: 'object' } },       // 필드·타입 체크
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

  // 2) FCM 한 번에 최대 500개 토큰씩 chunk
  const CHUNK_SIZE = 500;
  for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
    const chunkTokens = tokens.slice(i, i + CHUNK_SIZE);

    // 3) 멀티캐스트용 메시지 객체에 notification + data + android + apns 모두 채우기
    const message = {
      tokens: chunkTokens,
      notification: {
        title: payload.title,
        body:  payload.body,
      },
      data: payload.data || {},
      // iOS 백그라운드 알림, 사운드 등
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
      // Android 우선순위·소리·진동
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          vibrateTimingsMillis: [0, 250, 500],
        },
      },
    };

    // 4) 전송 후 실패 토큰 걸러내기
    const response = await admin.messaging().sendMulticast(message);
    const failedTokens = [];
    response.responses.forEach((resp, idx) => {
      if (!resp.success) {
        console.error(`FCM 전송 실패 (${chunkTokens[idx]}):`, resp.error.message);
        // 토큰이 더 이상 유효하지 않을 때 DB에서 제거
        /*
        const code = resp.error.code;
        if (code === 'messaging/registration-token-not-registered' ||
            code === 'messaging/invalid-registration-token') {
          failedTokens.push(chunkTokens[idx]);
        }
        */
      }
    });
  }
}

module.exports = { notifyNearbyRiders };
