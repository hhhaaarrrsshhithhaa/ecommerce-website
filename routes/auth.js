const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Product = require('../models/Product');

// In-memory OTP storage
const otpStore = new Map();

// ==========================
// 📌 AUTH: Request OTP
// ==========================
router.post('/request-otp', async (req, res) => {
  const { email, phone, password } = req.body;

  if (!email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this phone number' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    otpStore.set(phone, {
      email,
      phone,
      password: hashedPassword,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes
    });

    console.log(`🔐 OTP for ${phone}: ${otp}`);
    res.json({ message: 'OTP sent successfully (check backend console)' });

  } catch (error) {
    console.error('Error in /request-otp:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// ✅ AUTH: Verify OTP
// ==========================
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  const stored = otpStore.get(phone);
  if (!stored) return res.status(400).json({ error: 'No OTP requested for this phone number' });
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(phone);
    return res.status(400).json({ error: 'OTP expired' });
  }
  if (stored.otp !== otp) return res.status(400).json({ error: 'Incorrect OTP' });

  try {
    const newUser = new User({
      email: stored.email,
      phone: stored.phone,
      password: stored.password
    });

    await newUser.save();
    otpStore.delete(phone);

    res.json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Error in /verify-otp:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==========================
// 🛍️ ADMIN: Add Product
// ==========================
router.post('/products', async (req, res) => {
  try {
    const { name, price, category, description, sizes, imageUrl } = req.body;

    const product = new Product({
      name,
      price,
      category,
      description,
      sizes,
      imageUrl,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully" });

  } catch (err) {
    console.error('Error in /products:', err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// GET /api/auth/products?category=women
router.get('/products', async (req, res) => {
  const category = req.query.category;
  try {
    const products = await Product.find({ category });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});




module.exports = router;
