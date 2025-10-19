

import React from "react";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <h1 style={styles.title}>CV-QA</h1>
    </nav>
  );
}

const styles = {
  nav: {
    width: "100%",
    position: "fixed",
    top: 0,
    left: 0,
    backgroundColor: "#3b82f6",
    color: "white",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
    padding: "15px",
    textAlign: "center",
    zIndex: 999,
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
  },
};
