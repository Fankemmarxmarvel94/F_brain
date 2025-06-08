import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "./LanguageContext";
import { useContext, useState } from "react";
import LanguageSelector from "./LanguageSelector";

function Header() {
  const { t } = useTranslation();
  
  // Access the language context to get the changeLanguage function
  const languageContext = useContext(LanguageContext);
  const handleLanguageChange = languageContext?.changeLanguage ?? (() => {});

  // State to manage menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div>
      <nav className="bg-white border-b border-red-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate blanditiis recusandae pariatur sequi tenetur vel dolore non error illo consequatur, exercitationem, tempore facilis vitae dignissimos quaerat laborum, necessitatibus laudantium provident!
          <div>
            <LanguageSelector onLanguageChange={handleLanguageChange} />
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
