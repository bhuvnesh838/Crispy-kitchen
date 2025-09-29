const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true },
  cookingTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, default: "Medium" },
  imageUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', recipeSchema);
