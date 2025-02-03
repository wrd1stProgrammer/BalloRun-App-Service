const admin = require('firebase-admin');

const sendPushNotification = async (fcmToken, payload) => {
  try {
    const message = {
      token: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          vibrateTimingsMillis: [0, 500, 1000],
        },
      },
    };

    await admin.messaging().send(message);
    console.log(`알림 전송 성공: ${fcmToken}`);
  } catch (error) {
    // 무효한 토큰 에러처리 추가하자 언젠가
    console.error('알림 전송 실패:', error);
    throw new Error('Failed to send push notification');
  }
};

module.exports = {
  sendPushNotification,
};
