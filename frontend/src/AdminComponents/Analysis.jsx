
import React, { useEffect, useState } from "react";
import './Analysis.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    totalRecipes: 0,
    recipesByCategory: {},
    activeUsers: 0,
    recentlyActiveUsers: 0,
    onlineUsers: 0
  });

  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      try {
        // ---------------- Users ----------------
        const usersRes = await fetch("http://localhost:8080/api/users", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const usersData = await usersRes.json();
        setUsers(usersData);

        const totalUsers = usersData.length;
        const totalAdmins = usersData.filter(u => u.role === "admin").length;
        const activeUsers = usersData.filter(u => u.status === "Active").length;

        // Recently active (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentlyActiveUsers = usersData.filter(
          u => u.lastLogin && new Date(u.lastLogin) > thirtyDaysAgo
        ).length;

        // Currently online users
        const onlineUsers = usersData.filter(u => u.isOnline).length;

        // ---------------- Recipes ----------------
        const recipesRes = await fetch("http://localhost:8080/api/recipes", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const recipesData = await recipesRes.json();
        setRecipes(recipesData);

        const totalRecipes = recipesData.length;
        const recipesByCategory = {};
        recipesData.forEach(r => {
          if (r.category) {
            recipesByCategory[r.category] =
              (recipesByCategory[r.category] || 0) + 1;
          }
        });

        setStats({
          totalUsers,
          totalAdmins,
          totalRecipes,
          recipesByCategory,
          activeUsers,
          recentlyActiveUsers,
          onlineUsers
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="analysis-admin-dashboard-container">
      <h1 className="analysis-admin-dashboard-title">Admin Dashboard</h1>

      {/* ---------------- Rectangular Stats Grid ---------------- */}
      <div className="analysis-admin-dashboard-grid">
        <div className="analysis-admin-grid-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="analysis-admin-grid-card">
          <h3>Active Users</h3>
          <p>{stats.activeUsers}</p>
        </div>
        <div className="analysis-admin-grid-card">
          <h3>Currently Online</h3>
          <p>{stats.onlineUsers}</p>
        </div>
        <div className="analysis-admin-grid-card">
          <h3>Recently Active (30d)</h3>
          <p>{stats.recentlyActiveUsers}</p>
        </div>
        <div className="analysis-admin-grid-card">
          <h3>Total Admins</h3>
          <p>{stats.totalAdmins}</p>
        </div>
        <div className="analysis-admin-grid-card">
          <h3>Total Recipes</h3>
          <p>{stats.totalRecipes}</p>
        </div>
        {Object.entries(stats.recipesByCategory).map(([category, count]) => (
          <div className="analysis-admin-grid-card" key={category}>
            <h3>{category}</h3>
            <p>{count}</p>
          </div>
        ))}
      </div>

      {/* ---------------- Users Table ---------------- */}
      <div className="analysis-admin-users-section">
        <h2>All Users</h2>
        <table className="analysis-admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Online</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                </td>
                <td>{u.isOnline ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- Recipes Table ---------------- */}
      <div className="analysis-admin-recipes-section">
        <h2>All Recipes</h2>
        <table className="analysis-admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Cooking Time</th>
              <th>Servings</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map(r => (
              <tr key={r._id}>
                <td>{r.title}</td>
                <td>{r.category}</td>
                <td>{r.difficulty}</td>
                <td>{r.cookingTime} min</td>
                <td>{r.servings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

