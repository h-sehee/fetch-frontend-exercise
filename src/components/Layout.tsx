import React from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

/**
 * Props for the Layout component.
 * Expects React children to be rendered inside the layout.
 */
interface LayoutProps {
  children: React.ReactNode;
}

/**
 * Layout component that provides a consistent page structure.
 * Includes a navigation bar at the top, main content area, and footer at the bottom.
 */
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
