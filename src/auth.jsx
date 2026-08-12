import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * DEMO AUTH — frontend only.
 * Accounts and passwords are stored in the browser's localStorage, in plain
 * text, with no hashing or server-side verification. This is fine for
 * wiring up the UI/UX, but it is NOT secure and must NOT be used once real
 * users or real money are involved. Swap this file for calls to a real
 * backend (or a hosted auth provider) before going live.
 */

const AuthContext = createContext(null);
const USERS_KEY = "vaultx_users";
const SESSION_KEY = "vaultx_session";

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  }, [user]);

  function signup({ name, email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const users = loadUsers();
    if (users.some((u) => u.email === cleanEmail)) {
      throw new Error("An account with this email already exists.");
    }
    const newUser = { name: name.trim(), email: cleanEmail, password };
    saveUsers([...users, newUser]);
    setUser({ name: newUser.name, email: newUser.email });
  }

  function login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const users = loadUsers();
    const match = users.find((u) => u.email === cleanEmail && u.password === password);
    if (!match) throw new Error("Invalid email or password.");
    setUser({ name: match.name, email: match.email });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}