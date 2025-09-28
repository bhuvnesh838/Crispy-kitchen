import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

import About from "./Components/About";
import AddRecipe from "./Components/AddRecipe";

import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword"; 
import Profile from "./pages/profile";

import AdminHome from "./AdminComponents/AdminHome";
import UpdateRecipe from "./AdminComponents/UpdateRecipe";
import Analysis from "./AdminComponents/Analysis";

import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />

        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-recipe" 
          element={
            <ProtectedRoute>
              <AddRecipe />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Admin-Home" 
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Update-Recipe/:id" 
          element={
            <ProtectedRoute>
              <UpdateRecipe />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Analysis" 
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          } 
        />

        {/* Fallback route */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
