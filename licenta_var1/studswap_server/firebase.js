const admin = require('firebase-admin');

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Render: decode from base64
  try {
    const decoded = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString('utf-8');
    serviceAccount = JSON.parse(decoded);
  } catch (e) {
    console.error('Firebase env var decode error:', e.message);
    process.exit(1);
  }
} else {
  // Local: use file
  serviceAccount = require('./firebaseServiceAccount.json');
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// Non-secret identifiers only (no private key) — used by a temporary debug
// route to confirm which credential the deployed server actually loaded.
const serviceAccountInfo = {
  project_id: serviceAccount.project_id,
  client_email: serviceAccount.client_email,
};

module.exports = { db, auth, serviceAccountInfo };