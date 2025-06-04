import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Search from './pages/Search';

import Layout from './components/Layout';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import PublicRoute from './components/PublicRoute';

const basename =
  process.env.NODE_ENV === 'production'
    ? '/fetch-frontend-exercise'
    : '/';

function App() {
  return (
    <AuthProvider>
      <Router basename={basename}>
        <Layout>
          <Routes>
            <Route index element={<Login />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
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
      </Router>
    </AuthProvider>
  );
}

export default App;
