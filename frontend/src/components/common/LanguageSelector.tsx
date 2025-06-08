import { useTranslation } from 'react-i18next';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { LanguageContext } from './LanguageContext';
import { FR, GB } from "country-flag-icons/react/3x2";

// Define the type for the language options
interface Language {
    code: string;
    label: string;
    flag: React.ElementType;  // Type for the flag component
}

// List of languages with their respective labels and flags
const languages: Language[] = [
    { code: 'en', label: 'English', flag: GB },
    { code: 'fr', label: 'Français', flag: FR },
];

// External style constants
const selectorContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    position: 'relative' as const,  
    zIndex: 1000,
    maxHeight: '30px',
};

const labelStyle = {
    marginRight: '0px',
};

const selectContainerStyle = {
    position: 'relative' as const,
};

const languageButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '5px',
    height: '20px',
};

const flagStyle = {
    width: '1.5em',
    marginRight: '0.5em',
};

const languageDropdownStyle = {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    border: '1px solid #ccc',
    borderRadius: '4px',
    alignItems: 'start',
    maxHeight: '150px',
    overflowY: 'auto' as const, 
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    zIndex: 2000,
};

const languageOptionStyle = {
    display: 'flex',
    width: '100%',
    padding: '5px 5px 5px 10px',
    cursor: 'pointer',
};


// Define the props for the LanguageSelector component
interface LanguageSelectorProps {
    formClassName?: string;
    labelClassName?: string;
    selectClassName?: string;
    onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ formClassName = '', labelClassName = '', selectClassName = '', onLanguageChange, }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const languageContext = useContext(LanguageContext);
    const selectorRef = useRef<HTMLDivElement>(null); // Référence pour le sélecteur

    const currentLanguage = languageContext?.language || 'en';

    const handleLanguageChange = (selectedLanguage: string) => {
        i18n.changeLanguage(selectedLanguage); // Change la langue
        onLanguageChange(selectedLanguage); // Appelle la fonction de changement de langue
        setIsOpen(false); // Ferme le sélecteur après la sélection
    };

    useEffect(() => {
        document.body.dir = i18n.dir();
    }, [i18n, i18n.language]);

    const CurrentFlag = languages.find(lang => lang.code === currentLanguage)?.flag || GB;

    // Gestionnaire d'événements pour fermer le sélecteur si on clique en dehors
    const handleClickOutside = (event: MouseEvent) => {
        if (
            selectorRef.current && 
            !selectorRef.current.contains(event.target as Node) && 
            event.clientY < window.innerHeight 
        ) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={selectorRef} className={formClassName} style={selectorContainerStyle}>
            <label htmlFor="language-select" className={labelClassName} style={labelStyle}>
                {t('components.footer.languageLabel')}
            </label>
            <div className={selectClassName} style={selectContainerStyle}>
                <div 
                    id="language-select" 
                    onClick={() => setIsOpen(!isOpen)}
                    style={languageButtonStyle}
                >
                    <CurrentFlag style={flagStyle} />
                    {languages.find(lang => lang.code === currentLanguage)?.label}
                </div>
                {isOpen && (
                    <div style={{ ...languageDropdownStyle }}>
                        {languages.map((lang) => {
                            const Flag = lang.flag;
                            return (
                                <div 
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)} 
                                    style={languageOptionStyle}
                                >
                                    <Flag style={flagStyle} />
                                    <span>{lang.label}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LanguageSelector;