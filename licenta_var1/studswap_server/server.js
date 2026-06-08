const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db, auth } = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

// registration 
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName, city } = req.body;

    // 1. extract domain from the email
    const emailDomain = email.split('@')[1];

    if (!emailDomain) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // 2. check if the domain exists in our uni col
    const uniSnapshot = await db.collection('Universities')
      .where('domain', '==', emailDomain)
      .get();

    if (uniSnapshot.empty) {
      return res.status(403).json({ error: "Unauthorized university domain. Use a valid student email." });
    }

    // 3. ver the domain matches the selected city
    const uniData = uniSnapshot.docs[0].data();
    const assignedCity = uniData.city;

    // if (uniData.city !== city) {
    //   return res.status(403).json({ error: `This email belongs to ${uniData.city}, not ${city}.` });
    // }

    // 4. create the user in firebase auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
    });

    // 5. save the extended user profile in the firestore "Users" collection
    await db.collection('Users').doc(userRecord.uid).set({
      userId: userRecord.uid,
      email: email,
      displayName: displayName,
      university: uniData.name,
      city: assignedCity,
      profileImageUrl: "",
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ 
      message: "User registered successfully!", 
      userId: userRecord.uid,
      city: assignedCity,
      university: uniData.name
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const apiKey = process.env.FIREBASE_WEB_API_KEY;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  if (!apiKey) {
    console.error("FIREBASE_WEB_API_KEY is not set in .env");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try{
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email,
        password: password,
        returnSecureToken: true
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Firebase login error:", data);
      // Firebase returns specific error messages
      const errorMessage = data.error?.message || "Invalid email or password";
      return res.status(401).json({ error: errorMessage });
    }

    res.status(200).json({
      message: "Login successful!",
      userId: data.localId,
      token: data.idToken
    });

  } catch (error) {
    console.error("Server Login Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
app.get('/api/users/:userId', async (req, res) => {
  try {
    const userDoc = await db.collection('Users').doc(req.params.userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all listings
app.get('/api/listings', async (req, res) => {
  try {
    const listingsSnapshot = await db.collection('Listings').get();
    const listings = listingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new listing (POST)
app.post('/api/listings', async (req, res) => {
  try {
    const { title, description, price, category, userId, userName, location, faculty, condition } = req.body;
    
    const listingRef = await db.collection('Listings').add({
      title,
      description,
      price,
      category,
      userId,
      userName,
      location,
      faculty,
      condition,
      image: null, // Add image upload later
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ id: listingRef.id, message: 'Listing created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`StudSwap server running on port ${PORT}`));