import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/api';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await apiLogin(credentials);
      setAccessToken(response.accessToken);
      
      // Use the user info from the login response
      const userInfo = {
        id: response.id,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        role: response.role
      };
      setUser(userInfo);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await apiRegister(userData);
      setAccessToken(response.accessToken);
      
      // Use the user info from the registration response
      const userInfo = {
        id: response.id,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        role: response.role
      };
      setUser(userInfo);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  };

  const isAuthenticated = () => {
    return !!accessToken;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      login, 
      register, 
      logout, 
      isAuthenticated,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 