const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Try to parse the env var
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (e) {
    console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', e.message);
    process.exit(1);
  }
} else {
  // Local development
  serviceAccount = require('./firebaseServiceAccount.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };