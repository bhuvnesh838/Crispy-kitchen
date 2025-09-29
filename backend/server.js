require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_CODE = process.env.ADMIN_CODE;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

if (!JWT_SECRET || !ADMIN_CODE || !process.env.MONGODB_URI) {
  console.error("FATAL ERROR: Missing required environment variables (JWT_SECRET, ADMIN_CODE, MONGODB_URI).");
  process.exit(1);
}

app.use(express.json());
app.use(cors());

// ------------------ MongoDB Connection ------------------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected to:", mongoose.connection.name))
  .catch(err => console.error("MongoDB connection error:", err));

// ------------------ Middleware ------------------
// Authenticate user
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded token info to request
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Authorize admin
const authorizeAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// ------------------ User Routes ------------------

// Signup
app.post('/api/users/signup', async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Please provide all fields' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    let assignedRole = 'user';
    if (role === 'admin') {
      if (adminCode !== ADMIN_CODE) return res.status(403).json({ message: 'Invalid admin code' });
      assignedRole = 'admin';
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: assignedRole });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: { name, email, role: assignedRole } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // Update last login and mark as online
    user.lastLogin = new Date();
    user.isOnline = true;
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '5h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


app.post('/api/users/logout', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user) {
      user.isOnline = false;
      await user.save();
    }
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get all users (admin only)
app.get('/api/users', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ------------------ Recipe Routes ------------------

// Add Recipe
app.post('/api/recipes', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { title, description, ingredients, steps, cookingTime, servings, category, difficulty, imageUrl } = req.body;
    if (!title || !description || !ingredients || !steps || !cookingTime || !servings || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newRecipe = new Recipe({ title, description, ingredients, steps, cookingTime, servings, category, difficulty, imageUrl, createdBy: req.user.userId });
    await newRecipe.save();
    res.status(201).json({ message: 'Recipe added successfully', recipe: newRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('createdBy', 'name email');
    res.status(200).json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy', 'name email');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update recipe
app.put('/api/recipes/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
    res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete recipe
app.delete('/api/recipes/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found or already deleted' });
    res.status(200).json({ message: 'Recipe deleted successfully', recipe: deletedRecipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ------------------ Password Reset ------------------

// Forgot password
app.post('/api/users/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '15m' });
    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}&email=${email}`;
    res.status(200).json({ message: 'Reset link generated', resetLink });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset password
app.post('/api/users/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) return res.status(400).json({ message: 'Email, token, and new password are required' });

    let decoded;
    try { decoded = jwt.verify(token, JWT_SECRET); } 
    catch (err) { return res.status(400).json({ message: 'Invalid or expired token' }); }

    const user = await User.findOne({ _id: decoded.userId, email });
    if (!user) return res.status(404).json({ message: 'User not found or email mismatch' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ------------------ Admin Dashboard Analytics ------------------
// Get dashboard stats (admin only)
app.get('/api/admin/dashboard', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.find();
    const recipes = await Recipe.find();

    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const totalRecipes = recipes.length;

    const recipesByCategory = {};
    recipes.forEach(r => { if (r.category) recipesByCategory[r.category] = (recipesByCategory[r.category] || 0) + 1; });

    res.status(200).json({ totalUsers, totalAdmins, activeUsers, totalRecipes, recipesByCategory });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});



// GET /api/users/profile
// GET /api/users/me
// Returns logged-in user's info + their recipes
app.get('/api/users/me', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user data (exclude password)
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch user's recipes
    const recipes = await Recipe.find({ createdBy: userId });

    res.status(200).json({ user, recipes });

  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// ------------------ Test Route ------------------
app.get('/', (req, res) => res.send('Backend server is running!'));

// ------------------ Start Server ------------------
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
