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
    const savedToken = localStorage.getItem("melova_token");
    const savedRole = localStorage.getItem("melova_role");
    const savedUser = localStorage.getItem("melova_user");

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
    const { token, refresh, role, user } = authPayload;

    setToken(token);
    setRole(role);
    setUser(user);

    localStorage.setItem("melova_token", token);
    localStorage.setItem("melova_refresh", refresh);
    localStorage.setItem("melova_role", role);
    localStorage.setItem("melova_user", JSON.stringify(user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return role;
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
    const res = await axios.post(`${API_URL}api/auth/google-login/`, {
      id_token: googleIdToken,
    });

    return handleAuthSuccess(res.data);
  };

  const updateProfile = async (payload) => {
    const accessToken = localStorage.getItem("melova_token");
    const res = await axios.put(`${API_URL}api/auth/profile/update/`, payload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const updatedUser = res.data.user;
    setUser(updatedUser);
    localStorage.setItem("melova_user", JSON.stringify(updatedUser));
    return updatedUser;
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("melova_refresh");
    const accessToken = localStorage.getItem("melova_token");

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
    localStorage.removeItem("melova_token");
    localStorage.removeItem("melova_refresh");
    localStorage.removeItem("melova_role");
    localStorage.removeItem("melova_user");
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
