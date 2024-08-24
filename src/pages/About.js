import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>ABOUT US</h1>
      <div style={styles.textContainer}>
        <p>Welcome From Car Market Thailand</p>
        <p>No 1 Digital Car Market in Thailand</p>
        <p>Thanks Everyone Customer For Trusting Us</p>
      </div>
      <div style={styles.buttonContainer}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={styles.button}>Home</button>
        </Link>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <button style={styles.button}>Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '40px',
    fontFamily: "'Montserrat', sans-serif",
    backgroundColor: '#1b1f3a',
    color: '#ffffff',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#ffffff',
    marginBottom: '20px',
  },
  textContainer: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    lineHeight: '1.6',
  },
  buttonContainer: {
    marginTop: '30px',
  },
  button: {
    marginRight: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#ffffff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
  },
};

export default About;