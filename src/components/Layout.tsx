// src/components/Layout.tsx
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh"
    }}
    >
      <Header />

      <main style={{ flex: 1, padding: "1rem 2rem" }}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
