import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage , isSupported } from "firebase/messaging";

const firebaseInit = {
  methods: {
    async firebaseInit () {

      let token = ''
      const firebaseConfig = {
        apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
        authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.VUE_APP_FIREBASE_APP_ID,
        measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
      };

      const app = initializeApp(firebaseConfig);


      if ("Notification" in window && await isSupported()) {
        const message = getMessaging(app);
        try {
          token = await getToken(message, {vapidKey: process.env.VUE_APP_FIREBASE_VAPID_KEY,})

        } catch (e) {
          console.log(e);
        }
        onMessage(message, (payload: any) => {
          const count = localStorage.getItem('notificationCount')
          if (count) {
            localStorage.setItem('notificationCount', String(+count + 1))
          } else {
            localStorage.setItem('notificationCount', '1')
          }
          window.dispatchEvent(new CustomEvent('foo-key-localstorage-changed', {
            detail: {
              storage: localStorage.getItem('notificationCount')
            }
          }));
          console.log("Message received. firebase.js ", payload);

          navigator.serviceWorker
            .register('./service-worker.js', { scope: './' })
            .then(function (registration) {
              console.log("Service Worker Registered");
              setTimeout(() => {
                registration.showNotification(payload.notification.title, {
                  body: payload.notification.body
                });
                registration.update();
              }, 100);
            })
            .catch(function (err) {
              console.log("Service Worker Failed to Register", err);
            })
        });
      }
      return token
    }
  },
};


export default firebaseInit;
