import Firebase from 'firebase';

import firebaseConfig from '../config/firebaseConfig.json';

const app = Firebase.initializeApp(firebaseConfig);

export const db = app.database();
