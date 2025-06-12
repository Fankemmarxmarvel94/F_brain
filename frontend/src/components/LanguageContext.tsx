import { createContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextProps {
    language: string;
    changeLanguage: (newLanguage: string) => void;
}

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState<string>('en');

    useEffect(() => {
        if (i18n.isInitialized) {
            i18n.changeLanguage(language);
            document.body.dir = i18n.dir();
        }
    }, [language, i18n]);

    const changeLanguage = (newLanguage: string) => {
        setLanguage(newLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};