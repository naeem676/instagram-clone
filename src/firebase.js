
  import firebase from "firebase";
  const firebaseApp = firebase.initializeApp(
    {
        apiKey: "AIzaSyA6A351H0AF4_G14wxAORwEubkeJ7_1wjs",
        authDomain: "instagram-clone-b083e.firebaseapp.com",
        projectId: "instagram-clone-b083e",
        storageBucket: "instagram-clone-b083e.appspot.com",
        messagingSenderId: "791802018993",
        appId: "1:791802018993:web:e437f13b85c4fa03327690",
        measurementId: "G-SFFCHSMQJB"
      }
  );
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};