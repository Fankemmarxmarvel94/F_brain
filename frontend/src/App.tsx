import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header";
import MangaPage from "./pages/MangaPage";
import FavoritesPage from "./pages/FavoritesPage";

function App() {
  const [activeTab, setActiveTab] = useState<"manga" | "favorites">("manga");

  return (
    <AuthProvider>
      <FavoritesProvider>
        <div className="min-h-screen bg-gray-50">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === "manga" ? <MangaPage /> : <FavoritesPage />}
          </main>
        </div>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
