import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const initialAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextType>(initialAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const loadUserFromStorage = async () => {
      try {
        const userString = await AsyncStorage.getItem('@user');
        if (userString) {
          const userData = JSON.parse(userString);
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to load user data from storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, you'd make an API call to validate credentials here
      // For this demo, we'll simulate successful login with any non-empty credentials

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a fake user object for demo purposes
      const userData: User = {
        id: `user_${Date.now()}`,
        name: email.split('@')[0], // Just using the first part of email as name for demo
        email,
      };

      // Store user in AsyncStorage
      await AsyncStorage.setItem('@user', JSON.stringify(userData));

      // Update state
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // In a real app, you'd make an API call to register the user
      // For this demo, we'll simulate successful registration

      if (!name || !email || !password) {
        throw new Error('Name, email, and password are required');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a new user
      const userData: User = {
        id: `user_${Date.now()}`,
        name,
        email,
      };

      // Store user in AsyncStorage
      await AsyncStorage.setItem('@user', JSON.stringify(userData));

      // Update state
      setUser(userData);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Remove user from AsyncStorage
      await AsyncStorage.removeItem('@user');

      // Update state
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
