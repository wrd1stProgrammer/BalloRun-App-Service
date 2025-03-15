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
            contentAvailable: true, // 백그라운드 알림 활성화 (true는 1로 변환됨)
            sound: 'default',
            alert: {
              title: payload.title, // 수정: payload.title 명시
              body: payload.body,   // 수정: payload.body 명시
            },
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
    console.error('알림 전송 실패:', error);
    throw new Error('Failed to send push notification');
  }
};

module.exports = {
  sendPushNotification,
};