import React from "react";
import { useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  return (
    <footer
      style={{
        backgroundColor: "#f2f2f2",
        padding: "20px",
        textAlign: "center",
        position: location.pathname === "/model" ? "absolute" : "",
        bottom: location.pathname === "/model" ? "0" : "",
        width: location.pathname === "/model" ? "100%" : ""
      }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <a href="#">Home</a>
        <span style={{ margin: "0 10px" }}>|</span>
        <a href="#">About</a>
        <span style={{ margin: "0 10px" }}>|</span>
        <a href="#">Services</a>
        <span style={{ margin: "0 10px" }}>|</span>
        <a href="#">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;
