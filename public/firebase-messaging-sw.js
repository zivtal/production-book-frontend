importScripts("https://www.gstatic.com/firebasejs/8.2.6/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.6/firebase-messaging.js");
try {
  const firebaseConfig = {
    apiKey: "AIzaSyD2vwd85TSQvX5yfQmCxbgg-WFv-f_3Wzo",
    authDomain: "production-book-ccebf.firebaseapp.com",
    projectId: "production-book-ccebf",
    storageBucket: "production-book-ccebf.appspot.com",
    messagingSenderId: "549190599012",
    appId: "1:549190599012:web:06640388645c8f015e3a71",
    measurementId: "G-8RD6DQKGNY"
  };

  firebase.initializeApp(firebaseConfig);

  let messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log(
        "[firebase-messaging-sw.js] Received background message ",
        payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };
    this.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
  });
} catch (e) {
  console.log(e);
}
