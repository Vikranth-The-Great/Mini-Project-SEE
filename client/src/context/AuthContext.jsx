import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Axios instance that attaches the correct Bearer token
export function buildAxios(token) {
  return axios.create({
    baseURL: '/api',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function AuthProvider({ children }) {
  const [userToken,     setUserToken]     = useState(() => localStorage.getItem('userToken') || null);
  const [adminToken,    setAdminToken]    = useState(() => localStorage.getItem('adminToken') || null);
  const [deliveryToken, setDeliveryToken] = useState(() => localStorage.getItem('deliveryToken') || null);

  const [user,     setUser]     = useState(() => JSON.parse(localStorage.getItem('user')     || 'null'));
  const [admin,    setAdmin]    = useState(() => JSON.parse(localStorage.getItem('admin')    || 'null'));
  const [delivery, setDelivery] = useState(() => JSON.parse(localStorage.getItem('delivery') || 'null'));

  // ── User ─────────────────────────────────────────────────────────────────────
  const loginUser = (token, userData) => {
    localStorage.setItem('userToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUserToken(token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setUserToken(null);
    setUser(null);
  };

  // ── Admin ────────────────────────────────────────────────────────────────────
  const loginAdmin = (token, adminData) => {
    localStorage.setItem('adminToken', token);
    localStorage.setItem('admin', JSON.stringify(adminData));
    setAdminToken(token);
    setAdmin(adminData);
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdminToken(null);
    setAdmin(null);
  };

  // NGO aliases for forward compatibility with renamed paths.
  const ngoToken = adminToken;
  const ngo = admin;
  const loginNgo = loginAdmin;
  const logoutNgo = logoutAdmin;

  // ── Delivery ─────────────────────────────────────────────────────────────────
  const loginDelivery = (token, personData) => {
    localStorage.setItem('deliveryToken', token);
    localStorage.setItem('delivery', JSON.stringify(personData));
    setDeliveryToken(token);
    setDelivery(personData);
  };

  const logoutDelivery = () => {
    localStorage.removeItem('deliveryToken');
    localStorage.removeItem('delivery');
    setDeliveryToken(null);
    setDelivery(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userToken, user, loginUser, logoutUser,
        adminToken, admin, loginAdmin, logoutAdmin,
        ngoToken, ngo, loginNgo, logoutNgo,
        deliveryToken, delivery, loginDelivery, logoutDelivery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
