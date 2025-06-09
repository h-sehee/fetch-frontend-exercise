import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Search from "./pages/Search";

import Layout from "./components/Layout";

import ProtectedRoute from "./components/ProtectedRoute";

/**
 * App component sets up the main application routes.
 * - "/" and "/login" render the Login page.
 * - "/search" is a protected route that renders the Search page inside the Layout.
 */
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route index element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Protected search route */}
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Layout>
              <Search />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
