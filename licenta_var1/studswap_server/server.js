const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();
const multer = require('multer');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'studswap_listings', 
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // max 5MB per photo
});

const { db, auth, serviceAccountInfo } = require('./firebase');

const app = express();
app.use(cors());
app.use(express.json());

// TEMPORARY: confirms which Firebase credential this deployment actually
// loaded (no secrets exposed). Remove once the Firestore permission issue
// is resolved.
app.get('/api/debug/firebase', (req, res) => {
  res.json(serviceAccountInfo);
});

app.get('/api/debug/firestore-error', async (req, res) => {
  try {
    const snapshot = await db.collection('Listings').get();
    res.json({ success: true, count: snapshot.size });
  } catch (error) {
    res.json({
      success: false,
      name: error.name,
      code: error.code,
      message: error.message,
      details: error.details,
      metadata: error.metadata ? JSON.stringify(error.metadata) : undefined,
    });
  }
});

// --- Setting up email sender
const transporter = nodemailer.createTransport({ 
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

    // ver if name already taken b4 creating cont
    const usernameSnapshot = await db.collection('Users').where('displayName', '==', displayName.trim()).get();
    if (!usernameSnapshot.empty) {
      return res.status(400).json({ error: "This username is already taken." });
    }

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
      subject: "Verify your student email for StudSwap!", 
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

// --- USERNAME VERIF
app.get('/api/auth/check-username', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ error: "Username required" });

    const snapshot = await db.collection('Users').where('displayName', '==', username.trim()).get();
    
    if (!snapshot.empty) {
      return res.json({ available: false }); 
    }
    
    res.json({ available: true }); 
  } catch (error) {
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

// --- LOGIN

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
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({ error: "No account found with this email." });
    }
    res.status(500).json({ error: error.message });
  }
});


// get user ID
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

app.put('/api/users/:userId', async (req, res) => {
  try {
    const { profileImageUrl, displayName } = req.body;
    const updateData = {};
    
    if (profileImageUrl) updateData.profileImageUrl = profileImageUrl;
    
    if (typeof displayName === 'string' && displayName.trim().length > 0) {
      const newName = displayName.trim();
      
      const usernameSnapshot = await db.collection('Users').where('displayName', '==', newName).get();
      const isTakenByOther = usernameSnapshot.docs.some(doc => doc.id !== req.params.userId);
      
      if (isTakenByOther) {
        return res.status(400).json({ error: "This username is already taken." });
      }
      
      updateData.displayName = newName;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update." });
    }

    await db.collection('Users').doc(req.params.userId).update(updateData);
    res.status(200).json({ message: "User profile updated successfully!" });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- image upload route - max 5
app.post('/api/upload', upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded." });
    }

    // Cloudinary automatically gives us the secure URL in file.path
    const imageUrls = req.files.map(file => file.path);

    res.status(200).json({ imageUrls });
  } catch (error) {
    console.error("Upload Route Error:", error);
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

// creating new listing
app.post('/api/listings', async (req, res) => {
  try {
    const { title, description, price, category, announcementType, userId, userName, location, faculty, condition, images } = req.body;
    
    const listingRef = await db.collection('Listings').add({
      title,
      description,
      price,
      category,
      announcementType, 
      userId,
      userName,
      location,
      faculty,
      condition,
      images: images || [], 
      createdAt: new Date().toISOString()
    });

    res.status(201).json({ id: listingRef.id, message: 'Listing created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// update listing
app.put('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, announcementType, condition } = req.body;

    const listingRef = db.collection('Listings').doc(id);
    const doc = await listingRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Listing not found." });
    }

    await listingRef.update({
      title,
      description,
      price,
      category,
      announcementType,
      condition
    });

    res.status(200).json({ message: "Listing updated successfully!" });
  } catch (error) {
    console.error("Update Listing Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// mark listing as sold / available (toggle status)
app.patch('/api/listings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'sold'].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Must be 'active' or 'sold'." });
    }

    const listingRef = db.collection('Listings').doc(id);
    const doc = await listingRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Listing not found." });
    }

    await listingRef.update({ status });
    res.status(200).json({ message: `Listing marked as ${status}.` });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- DELETE A LISTING ---
app.delete('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listingRef = db.collection('Listings').doc(id);
    const doc = await listingRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Listing not found." });
    }

    await listingRef.delete();

    res.status(200).json({ message: "Listing deleted successfully!" });
  } catch (error) {
    console.error("Delete Listing Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`StudSwap server running on port ${PORT}`));