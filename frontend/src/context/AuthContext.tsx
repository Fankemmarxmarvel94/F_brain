import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { User, AuthContextType } from "../types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: 1,
  username: "otaku_fan",
  email: "otaku@manga.com",
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);

    // Simulation d'une requête API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Authentification simple (accepte n'importe quel username/password)
    if (username.trim() && password.trim()) {
      setUser({ ...mockUser, username });
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
