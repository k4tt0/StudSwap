const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const { db, auth } = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

// --- Setting up email sender
const transporter = nodemailer.createTransport({ // Aici am corectat din transpoter în transporter!
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});


// registration 
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName, city } = req.body;

    // extract domain from the email
    const emailDomain = email.split('@')[1];

    if (!emailDomain) {
      return res.status(400).json({ error: "Invalid email format." });
    }

    // check if the domain exists in our uni col
    const uniSnapshot = await db.collection('Universities')
      .where('domain', '==', emailDomain)
      .get();

    if (uniSnapshot.empty) {
      return res.status(403).json({ error: "Unauthorized university domain. Use a valid student email." });
    }

    // ver the domain matches the selected city
    const uniData = uniSnapshot.docs[0].data();
    const assignedCity = uniData.city;

    // create the user in firebase auth
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
      emailVerified: false,
    });

    // save the extended user profile in the firestore "Users" collection
    await db.collection('Users').doc(userRecord.uid).set({
      userId: userRecord.uid,
      email: email,
      displayName: displayName,
      university: uniData.name,
      city: assignedCity,
      profileImageUrl: "",
      createdAt: new Date().toISOString()
    });

    // generating the verifying link - firebase
    const verificationLink = await auth.generateEmailVerificationLink(email);

    // sending the email
    await transporter.sendMail({
      from: `"StudSwap Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your student email for StudSwap!", // Am curățat ghilimelele duble de aici
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Welcome to StudSwap, ${displayName}!</h2>
          <p>We need to verify that you are a student at <strong>${uniData.name}</strong>.</p>
          <br>
          <a href="${verificationLink}" style="padding: 12px 24px; background-color: #4C7D5B; color: white; text-decoration: none; border-radius: 30px; font-weight: bold;">Verify My Email</a>
          <br><br>
          <p style="color: #888; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `
    }).then((info) => {
      console.log("Email sent successfully: ", info.response);
    }).catch((error) => {
      console.error("FAILED TO SEND EMAIL. Google Error: ", error);
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

// --- status email verification

app.get('/api/auth/check-verification/:userId', async (req, res) => {
  try {
    const userRecord = await auth.getUser(req.params.userId);
    res.json({ emailVerified: userRecord.emailVerified });
  } catch (error) {
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

// --- forgot pasword
app.post('/api/auth/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email){
    return res.status(400).json({ error: "Email is required."});
  }

  try {
    // check if user exists in firebase auth
    await auth.getUserByEmail(email);

    // generate secure reset link
    const resetLink = await auth.generatePasswordResetLink(email);

    // send the email
    await transporter.sendMail({
      from: `"StudSwap Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your StudSwap Password",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>We received a request to reset the password for your StudSwap account.</p>
          <br>
          <a href="${resetLink}" style="padding: 12px 24px; background-color: #4C7D5B; color: white; text-decoration: none; border-radius: 30px; font-weight: bold;">Reset Password</a>
          <br><br>
          <p style="color: #888; font-size: 12px;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
      `
    });

    res.status(200).json({ message: "Password reset email sent." });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    // If the email isn't in the database, tell the user
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: "No account found with this email." });
    }
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