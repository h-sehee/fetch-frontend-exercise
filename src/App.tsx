import React from 'react';
import './App.css';
import { BrowserRouter as Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Search from './pages/Search';

import Layout from './components/Layout';

import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
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
    </AuthProvider>
  );
}

export default App;
