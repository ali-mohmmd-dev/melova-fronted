"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, register, loading: authLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      let strength = 0;
      if (value.length >= 6) strength++;
      if (value.length >= 10) strength++;
      if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;
      if (/\d/.test(value)) strength++;
      if (/[^a-zA-Z\d]/.test(value)) strength++;

      if (strength <= 2) setPasswordStrength("weak");
      else if (strength <= 4) setPasswordStrength("medium");
      else setPasswordStrength("strong");

      if (value.length === 0) setPasswordStrength("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const role = await register(formData); // ✅ calls Django /api/auth/register/

      // New users are always "user" role → go to shop
      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    } catch (err) {
      // ✅ Show Django validation errors
      const data = err.response?.data;
      if (data) {
        const messages = Object.values(data).flat().join(" ");
        setError(messages);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-wrapper">
      <style>{`
        .signup-page-wrapper {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
        }
        .signup-container {
          max-width: 500px;
          width: 100%;
          padding: 2rem;
        }
        .signup-card {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
        }
        .signup-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 5px;
          background: linear-gradient(90deg, #8B4513 0%, #D2691E 100%);
        }
        .signup-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .signup-logo { width: 120px; margin-bottom: 1rem; }
        .signup-header h1 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        .signup-header p { color: #6c757d; font-size: 0.95rem; }
        .form-group { margin-bottom: 1.5rem; }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .form-row .form-group { margin-bottom: 0; }
        .form-control {
          width: 100%;
          border: 2px solid #e9ecef;
          border-radius: 10px;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .form-control:focus {
          outline: none;
          border-color: #8B4513;
          box-shadow: 0 0 0 0.2rem rgba(139, 69, 19, 0.1);
        }
        .input-icon { position: relative; }
        .input-icon i {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #6c757d;
        }
        .input-icon input { padding-right: 2.5rem; }
        .btn-signup {
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
          cursor: pointer;
        }
        .btn-signup:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(139, 69, 19, 0.3);
        }
        .btn-signup:disabled { opacity: 0.7; cursor: not-allowed; }
        .error-message {
          background: #ffeaea;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .divider {
          text-align: center;
          margin: 1.5rem 0;
          position: relative;
        }
        .divider::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          width: 100%; height: 1px;
          background: #e9ecef;
        }
        .divider span {
          background: white;
          padding: 0 1rem;
          color: #6c757d;
          font-size: 0.9rem;
          position: relative;
        }
        .login-link { text-align: center; color: #6c757d; font-size: 0.95rem; }
        .login-link a { color: #8B4513; text-decoration: none; font-weight: 600; }
        .back-home { text-align: center; margin-top: 1.5rem; }
        .back-home a { color: #6c757d; text-decoration: none; font-size: 0.9rem; }
        .password-strength {
          height: 4px;
          background: #e9ecef;
          border-radius: 2px;
          margin-top: 0.5rem;
          overflow: hidden;
        }
        .password-strength-bar {
          height: 100%;
          width: 0%;
          transition: all 0.3s ease;
        }
        .password-strength-bar.weak   { width: 33%; background: #e74c3c; }
        .password-strength-bar.medium { width: 66%; background: #f39c12; }
        .password-strength-bar.strong { width: 100%; background: #27ae60; }
        .strength-label {
          font-size: 0.78rem;
          margin-top: 0.3rem;
          font-weight: 500;
        }
      `}</style>

      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <img
              src="/img/melova_logo.png"
              alt="MyMelova Logo"
              className="signup-logo"
            />
            <h1>Create Account</h1>
            <p>Join MyMelova and start your chocolate journey</p>
          </div>

          {/* ✅ Django error display */}
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* First + Last Name in one row */}
            <div className="form-row">
              <div className="form-group">
                <div className="input-icon">
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    placeholder="First Name"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <i className="fas fa-user"></i>
                </div>
              </div>
              <div className="form-group">
                <div className="input-icon">
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    placeholder="Last Name"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  <i className="fas fa-user"></i>
                </div>
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <i className="fas fa-envelope"></i>
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon">
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Phone Number"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                <i className="fas fa-phone"></i>
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon">
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <i className="fas fa-lock"></i>
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon">
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                <i className="fas fa-lock"></i>
              </div>
            </div>

            {/* ✅ Loading spinner while registering */}
            <button type="submit" className="btn btn-signup" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Creating Account...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i> Create Account
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="login-link">
            Already have an account? <Link href="/login">Login</Link>
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
