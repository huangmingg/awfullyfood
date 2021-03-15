import firebase from "firebase";
import { firebaseConfig } from "./environments/environment.staging";

firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();
const auth = firebase.auth;
const authService = firebase.auth();
const storage = firebase.storage();

export {
    database,
    auth,
    authService,
    storage
}
