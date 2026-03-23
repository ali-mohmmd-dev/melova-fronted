"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { user, login, loginWithGoogle, loading: authLoading } = useAuth();
  const router = useRouter();
  
  React.useEffect(() => {
    if (!authLoading && user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const role = await login(email, password);

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCredential = async (credential) => {
    setError("");
    setGoogleLoading(true);
    try {
      const role = await loginWithGoogle(credential);
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error || "Google sign-in failed. Please try again.";
      setError(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  React.useEffect(() => {
    if (!window.google || !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: (response) => {
          if (response.credential) {
            handleGoogleCredential(response.credential);
          }
        },
      });

      const buttonContainer = document.getElementById("googleSignInButton");
      if (buttonContainer) {
        window.google.accounts.id.renderButton(buttonContainer, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
        });
      }
    } catch (e) {
      console.error("Failed to initialize Google Identity Services", e);
    }
  }, []);

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
          cursor: pointer;
        }
        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(139, 69, 19, 0.3);
        }
        .btn-login:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
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
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
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
        .role-badge {
          display: inline-block;
          font-size: 0.75rem;
          padding: 0.2rem 0.6rem;
          border-radius: 20px;
          margin-left: 0.5rem;
          font-weight: 600;
        }
        .role-admin { background: #fff3cd; color: #856404; }
        .role-user  { background: #d1ecf1; color: #0c5460; }
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

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

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

            <button type="submit" className="btn btn-login" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span> Logging in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt"></i> Login
                </>
              )}
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <button
              type="button"
              className="btn btn-login"
              style={{
                background: "#fff",
                color: "#444",
                border: "1px solid #dadce0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              onClick={() => {
                if (window.google && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
                  window.google.accounts.id.prompt();
                } else {
                  setError(
                    "Google Sign-In is not configured. Please try again later.",
                  );
                }
              }}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <>
                  <span className="spinner"></span> Signing in with Google...
                </>
              ) : (
                <>
                  <img
                    src="https://developers.google.com/identity/images/g-logo.png"
                    alt="Google"
                    style={{ width: 18, height: 18 }}
                  />
                  Continue with Google
                </>
              )}
            </button>
            <div id="googleSignInButton" style={{ display: "none" }} />
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
