import React, { createContext, useContext, useEffect, useState } from "react";
import { Ajax } from "../services/ajax";

const RapportContext = createContext();

export const RapportProvider = ({ children }) => {
    const [rapports, setRapports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generating, setGenerating] = useState(false);

    // 🔹 Charger les rapports
    const fetchRapports = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await Ajax.getRequest("/api/rapports");

            const rapportsTransformes = data.map((rapport, index) => ({
                id: rapport.id, // ou rapport.id si tu veux garder l’id original
                titre: rapport.title,
                reference: rapport.reference,
                type: rapport.type,
                date: rapport.date,
                statut: rapport.status,
                auteur: rapport.author,
                taille: rapport.size,
                format: rapport.format,
                description: rapport.description,
                url: rapport.url,
            }));

            setRapports(rapportsTransformes);
        } catch (err) {
            console.error("Erreur fetchRapports:", err);
            setError("Impossible de charger les rapports.");
        } finally {
            setLoading(false);
        }
    };


    // 🔹 Générer un rapport PDF
    const generateRapport = async () => {
        setGenerating(true);
        try {
            const { data } = await Ajax.postRequest("/api/rapports/generate");
            await fetchRapports(); // Rafraîchir la liste après création
            return data; // chemin du fichier PDF généré
        } catch (err) {
            console.error("Erreur generateRapport:", err);
            throw err;
        } finally {
            setGenerating(false);
        }
    };

    // 🔹 Supprimer un rapport
    const deleteRapport = async (id) => {
        try {
            await Ajax.deleteRequest(`/api/rapports/${id}`);
            setRapports(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error("Erreur deleteRapport:", err);
            setError("Suppression échouée.");
        }
    };

    // 🔹 Modifier un rapport
    const updateRapport = async (id, rapport) => {
        try {
            const { data } = await Ajax.putRequest(`/api/rapports/${id}`, rapport);
            setRapports(prev => prev.map(r => (r.id === id ? data : r)));
            return data;
        } catch (err) {
            console.error("Erreur updateRapport:", err);
            throw err;
        }
    };

    // 🔹 Créer un rapport manuellement
    const createRapport = async (rapport) => {
        try {
            const { data } = await Ajax.postRequest(`/api/rapports`, rapport);
            setRapports(prev => [...prev, data]);
            return data;
        } catch (err) {
            console.error("Erreur createRapport:", err);
            throw err;
        }
    };

    useEffect(() => {
        fetchRapports();
    }, []);

    return (
        <RapportContext.Provider
            value={{
                rapports,
                loading,
                error,
                generating,
                generateRapport,
                fetchRapports,
                deleteRapport,
                updateRapport,
                createRapport,
            }}
        >
            {children}
        </RapportContext.Provider>
    );
};

export const useRapportContext = () => useContext(RapportContext);
