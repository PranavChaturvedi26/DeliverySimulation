import React, { useContext } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./utils/AuthProvider";
import { logoutUser } from "./api/auth";

import Dashboard from "./pages/Dashboard";
import Simulation from "./pages/Simulation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Drivers from "./pages/Drivers";
import RoutesPage from "./pages/Routes";
import Orders from "./pages/Orders";

function ProtectedRoute({ user, loading, children }) {
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const { user, loading, logout } = useAuth();

  async function handleLogout() {
    try {
      await logoutUser();
      logout();
    } catch (error) {
      console.error('Logout error:', error);
      logout();
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow p-4 flex justify-between">
        <h1 className="font-bold text-xl">GreenCart</h1>
        <div>
          {user ? (
            <>
              <Link to="/" className="mr-4 hover:underline">Dashboard</Link>
              <Link to="/simulation" className="mr-4 hover:underline">Simulation</Link>
              <Link to="/drivers" className="mr-4 hover:underline">Drivers</Link>
              <Link to="/routes" className="mr-4 hover:underline">Routes</Link>
              <Link to="/orders" className="mr-4 hover:underline">Orders</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-4 hover:underline">Login</Link>
              <Link to="/register" className="hover:underline">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulation"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Simulation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drivers"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Drivers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/routes"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <RoutesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute user={user} loading={loading}>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
