import React from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <NavBar />

      <main style={{ flex: 1, padding: "1rem 2rem" }}>{children}</main>

      <Footer />
    </div>
  );
};

export default Layout;
