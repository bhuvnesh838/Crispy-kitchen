import React from "react";
import './footer.css';
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>© 2025 Food Recipe App. All Rights Reserved.</p>
      <p>Designed by Yash pathak</p>
    </footer>
  );
};

const styles = {
  footer: {
    marginTop: "50px",
    padding: "1px",
    backgroundColor: "#ff7043",
    color: "#fff",
    textAlign: "center",
  },
};

export default Footer;
