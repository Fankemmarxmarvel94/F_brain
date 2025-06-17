import React, { useState } from "react";
import { User, LogIn, LogOut, Heart, BookOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
interface HeaderProps {
  activeTab: "manga" | "favorites";
  onTabChange: (tab: "manga" | "favorites") => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et titre */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MangaJoker
              </h1>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              <button
                onClick={() => onTabChange("manga")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "manga"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Manga</span>
              </button>

              <button
                onClick={() => onTabChange("favorites")}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === "favorites"
                    ? "bg-red-100 text-red-700"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                <Heart className="h-4 w-4" />
                <span className="font-medium">Favoris</span>
              </button>
            </nav>

            {/* Authentification */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {user.username}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm">Déconnexion</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Se connecter</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default Header;
