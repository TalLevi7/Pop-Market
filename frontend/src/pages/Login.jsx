import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      // Save token and redirect
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error, please try again.');
    }
  };

  return (
    <div className = "login-page">
      <img src='./images/login-left.png' alt="login Left Pic" className="login-side-image" />
      <div className="login-container">
        <h2>Login to your Account</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          <button type="submit">Login</button>
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
      <img src='./images/login-right.png' alt="login right Pic" className="login-side-image" />
    </div>
  );
}

export default Login;