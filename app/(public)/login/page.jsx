"use client";
import React, { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login
    alert("Login not implemented in static version yet.");
  };

  return (
    <div className="login-page-wrapper">
      <style>{`
        .login-page-wrapper {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
        }
        .login-container {
          max-width: 450px;
          width: 100%;
          padding: 2rem;
        }
        .login-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(90deg, #8B4513 0%, #D2691E 100%);
        }
        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-logo {
          width: 120px;
          margin-bottom: 1rem;
        }
        .login-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        .login-header p {
          color: #6c757d;
          font-size: 0.95rem;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-control {
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        .form-control:focus {
          border-color: #8B4513;
          box-shadow: 0 0 0 0.2rem rgba(139, 69, 19, 0.1);
        }
        .input-icon {
          position: relative;
        }
        .input-icon i {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }
        .input-icon input {
          padding-right: 2.5rem;
        }
        .remember-forgot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .form-check-label {
          color: #6c757d;
          font-size: 0.9rem;
        }
        .forgot-link {
          color: #8B4513;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .btn-login {
          width: 100%;
          background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%);
          border: none;
          color: white;
          padding: 0.875rem;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
          margin-bottom: 1rem;
        }
        .btn-login:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(139, 69, 19, 0.3);
        }
        .divider {
          text-align: center;
          margin: 1.5rem 0;
          position: relative;
        }
        .divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 100%;
          height: 1px;
          background: #e9ecef;
        }
        .divider span {
          background: white;
          padding: 0 1rem;
          color: #6c757d;
          font-size: 0.9rem;
          position: relative;
        }
        .signup-link {
          text-align: center;
          color: #6c757d;
          font-size: 0.95rem;
        }
        .signup-link a {
          color: #8B4513;
          text-decoration: none;
          font-weight: 600;
        }
        .back-home {
          text-align: center;
          margin-top: 1.5rem;
        }
        .back-home a {
          color: #6c757d;
          text-decoration: none;
          font-size: 0.9rem;
        }
      `}</style>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img
              src="/img/melova_logo.png"
              alt="MyMelova Logo"
              className="login-logo"
            />
            <h1>Welcome Back</h1>
            <p>Login to access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-icon">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <i className="fas fa-envelope"></i>
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <i className="fas fa-lock"></i>
              </div>
            </div>

            <div className="remember-forgot">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                />
                <label className="form-check-label" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <a href="#" className="forgot-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="btn btn-login">
              <i className="fas fa-sign-in-alt"></i> Login
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="signup-link">
            Don't have an account? <Link href="/signup">Sign Up</Link>
          </div>

          <div className="back-home">
            <Link href="/">
              <i className="fas fa-arrow-left"></i> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
