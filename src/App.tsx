import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Search from "./pages/Search";

import Layout from "./components/Layout";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
