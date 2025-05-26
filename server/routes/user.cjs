const express = require('express');
const User = require('../models/User.cjs');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/verifyToken.cjs');
const mongoose = require('mongoose');

// Firebase Admin SDK for verifying Google tokens
const admin = require('firebase-admin');
const serviceAccount = require('../jusa-4cf5c-firebase-adminsdk-fbsvc-ae0ae6fe1a.json');

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Google authentication endpoint
router.post('/google-auth', async (req, res) => {
  const { idToken, email, displayName } = req.body;
  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Check if user exists with this email
    const user = await User.findOne({ email: email || decodedToken.email });
    
    if (!user) {
      // Create a new user if not found
      const names = (displayName || decodedToken.name || '').split(' ');
      const firstName = names[0] || '';
      const lastName = names.length > 1 ? names.slice(1).join(' ') : '';
      
      const newUser = new User({
        firstName,
        lastName,
        email: email || decodedToken.email,
        password: await bcrypt.hash(Math.random().toString(36), 10) // Random secure password
      });
      
      await newUser.save();
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, id: newUser._id });
    } else {
      // Generate a new token for existing user
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, id: user._id });
    }
  } catch (error) {
    console.error('Error during Google authentication:', error);
    res.status(500).json({ error: 'Google authentication failed: ' + error.message });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
     const {firstName, lastName, email, password} = req.body;
     try{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ firstName, lastName, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Server error' });
      }
});


//Signin user and generate JWT token
router.post('/signin', async (req, res) => {
     const { email, password } = req.body;
     try{
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found'});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
          
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, id: user._id });
     } catch (error) {
        console.error('Error during signin:', error)
        res.status(500).json({ error: 'Server error' });
     }
});

// Get user data by ID
router.get('/:id', auth, async (req, res) => {
    const { id } = req.params;

  // Check if id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    const user = await User.findById(id).select('-password'); // Exclude sensitive fields
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Server error' });
  }
}); 

//Update user details
router.put('/update/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, phoneNumber } = req.body;
      
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid user ID format' });
  }

  try {
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { firstName, lastName, email, phoneNumber },
        { new: true, runValidators: true } // Return updated document and run validation
    ).select('-password'); // Exclude sensitive fields

    if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Change user's password
router.put('/change-password', auth, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Change user's address
router.put('/update-address/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { addressLine1, addressLine2, city, postcode, country } = req.body;

    // Check if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { 
                'address.addressLine1': addressLine1,
                'address.addressLine2': addressLine2,
                'address.city': city,
                'address.postcode': postcode,
                'address.country': country
            },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude sensitive fields

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Address updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating address:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user's payment details
router.put('/update-payment/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { cardNumber, expireMonth, expireYear, nameOnCard } = req.body;

    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid user ID format' });
    }

    try {
        // Update the user's payment details
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { 
                'paymentDetails.cardNumber': cardNumber,
                'paymentDetails.expireMonth': expireMonth,
                'paymentDetails.expireYear': expireYear,
                'paymentDetails.nameOnCard': nameOnCard
            },
            { new: true, runValidators: true } // Return updated document and run validation
        ).select('-password'); // Exclude sensitive fields

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'Payment details updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating payment details:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;