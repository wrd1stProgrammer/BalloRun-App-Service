const admin = require('firebase-admin');
const serviceAccount = require('../campuscoffee-83cbf-firebase-adminsdk-fbsvc-3d73a4c60e.json');

const fcmConnect = async () => {
  let firebase;
  try {
    if (admin.apps.length === 0) {
      firebase = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('Connect FCM: Initialize FCM SDK');
    } else {
      firebase = admin.app();
      console.log('Connect FCM');
    }
  } catch (error) {
    console.log('FCM connection error:: ', error.message);
  }
};

module.exports = {
    fcmConnect,
  };
