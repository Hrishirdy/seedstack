"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, UserRole } from "../types";
import { demoStore, DEMO_USERS } from "../store/demo-store";

export interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isFarmer: boolean;
  isBuyer: boolean;
  isAdmin: boolean;
  allDemoUsers: UserProfile[];
  login: (
    phoneOrEmail: string,
    pinOrPass: string,
    preferredRole?: string
  ) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  logout: () => void;
  switchUser: (userId: string) => void;
  register: (profileData: Omit<UserProfile, "id" | "created_at" | "verification_status">) => void;
  isDemoMode: boolean;
}

const BUYER_ROLES = ["wholesaler", "retail_vendor", "supermarket", "food_processor"];

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USERS[0],
  isAuthenticated: true,
  isFarmer: true,
  isBuyer: false,
  isAdmin: false,
  allDemoUsers: DEMO_USERS,
  login: async () => ({ success: true, user: DEMO_USERS[0] }),
  logout: () => {},
  switchUser: () => {},
  register: () => {},
  isDemoMode: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(demoStore.getCurrentUser());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(demoStore.getAllUsers());

  useEffect(() => {
    setUser(demoStore.getCurrentUser());
    setAllUsers(demoStore.getAllUsers());
  }, []);

  const login = async (
    phoneOrEmail: string,
    pinOrPass: string,
    preferredRole?: string
  ): Promise<{ success: boolean; user?: UserProfile; error?: string }> => {
    // Attempt mobile / PIN authentication
    const result = demoStore.loginWithPhone(phoneOrEmail, pinOrPass, preferredRole);
    if (result.success && result.user) {
      setUser(result.user);
      setAllUsers(demoStore.getAllUsers());
      return result;
    }

    // Fallback to credentials authentication
    const credResult = demoStore.loginWithCredentials(phoneOrEmail, pinOrPass);
    if (credResult.success && credResult.user) {
      setUser(credResult.user);
      setAllUsers(demoStore.getAllUsers());
      return credResult;
    }

    return { success: false, error: result.error || "Authentication failed" };
  };

  const logout = () => {
    demoStore.logout();
    setUser(null);
  };

  const switchUser = (userId: string) => {
    const updated = demoStore.setCurrentUser(userId);
    setUser(updated);
  };

  const register = (profileData: Omit<UserProfile, "id" | "created_at" | "verification_status">) => {
    const newUser = demoStore.registerUser(profileData);
    setUser(newUser);
    setAllUsers(demoStore.getAllUsers());
  };

  const isFarmer = user?.role === "farmer";
  const isBuyer = Boolean(user && BUYER_ROLES.includes(user.role));
  const isAdmin = user?.role === "admin";
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isFarmer,
        isBuyer,
        isAdmin,
        allDemoUsers: allUsers,
        login,
        logout,
        switchUser,
        register,
        isDemoMode: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
