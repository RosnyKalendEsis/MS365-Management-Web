import React, { createContext, useContext, useEffect, useState } from 'react';
import {Ajax} from "../services/ajax";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const res = await Ajax.getRequest('/admin/settings');
           if(res.status === 200) {
               setSettings(res.data);
               console.log("Settings loaded: ", res.data);
           }
        } catch (err) {
            console.error('Erreur lors du chargement des paramètres:', err);
        } finally {
            setLoading(false);
        }
    };

    function updateSiteMeta({ title, favicon }) {
        // 🟦 Mettre à jour le titre de la page
        if (title) {
            document.title = title;
        }

        // 🟦 Mettre à jour le favicon
        if (favicon) {
            let link = document.querySelector("link[rel~='icon']");

            if (!link) {
                link = document.createElement("link");
                link.rel = "icon";
                document.head.appendChild(link);
            }

            link.href = favicon;
        }
    }

    const updateSettings = async (settingData, logoFile, faviconFile) => {

        const formData = new FormData();
        formData.append("data", JSON.stringify(settingData));
        formData.append("logo", logoFile);
        formData.append("favicon", faviconFile);
        try {
            const { data } = await Ajax.postRequest("/admin/settings", formData);

            if (!data.error) {
               await fetchSettings();
            }
        } catch (error) {
            console.error("Erreur:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, updateSettings,updateSiteMeta }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);