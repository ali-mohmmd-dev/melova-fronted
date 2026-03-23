"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = sessionStorage.getItem("melova_token");
    const savedRole = sessionStorage.getItem("melova_role");
    const savedUser = sessionStorage.getItem("melova_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setRole(savedRole);
      setUser(JSON.parse(savedUser));
      // Set the authorization header for initial state
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (authPayload) => {
    // Backend might return 'access' (SimpleJWT) or 'token'
    const accessToken = authPayload.access || authPayload.token;
    const { refresh, user } = authPayload;

    // Determine role for backward compatibility if needed, 
    // but preference is to use user.is_staff / user.is_superuser
    const userRole = user?.is_superuser ? "superadmin" : user?.is_staff ? "admin" : "user";

    setToken(accessToken);
    setRole(userRole);
    setUser(user);

    sessionStorage.setItem("melova_token", accessToken);
    if (refresh) sessionStorage.setItem("melova_refresh", refresh);
    sessionStorage.setItem("melova_role", userRole);
    sessionStorage.setItem("melova_user", JSON.stringify(user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

    return userRole;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}api/auth/login/`, {
      email,
      password,
    });

    return handleAuthSuccess(res.data);
  };

  const register = async (payload) => {
    const res = await axios.post(`${API_URL}api/auth/register/`, payload);
    return handleAuthSuccess(res.data);
  };

  const loginWithGoogle = async (googleIdToken) => {
    try {
      // The backend expects exactly { "id_token": "..." }
      const res = await axios.post(`${API_URL}api/auth/google/`, {
        id_token: googleIdToken,
      });
      return handleAuthSuccess(res.data);
    } catch (err) {
      console.error("Google Login Error:", err.response?.data || err.message);
      throw err;
    }
  };

  const updateProfile = async (payload) => {
    const accessToken = sessionStorage.getItem("melova_token");
    const res = await axios.patch(`${API_URL}api/auth/me/`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const updatedUser = res.data.user;
    setUser(updatedUser);
    sessionStorage.setItem("melova_user", JSON.stringify(updatedUser));
    return updatedUser;
  };

  const logout = async () => {
    const refreshToken = sessionStorage.getItem("melova_refresh");
    const accessToken = sessionStorage.getItem("melova_token");

    if (refreshToken && accessToken) {
      try {
        await axios.post(
          `${API_URL}api/auth/logout/`,
          { refresh: refreshToken },
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );
      } catch (err) {
        console.error("Logout error:", err);
      }
    }

    setToken(null);
    setRole(null);
    setUser(null);
    sessionStorage.removeItem("melova_token");
    sessionStorage.removeItem("melova_refresh");
    sessionStorage.removeItem("melova_role");
    sessionStorage.removeItem("melova_user");
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
