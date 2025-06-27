import React, { createContext, useContext, useEffect, useState } from "react";
import {Ajax} from "../services/ajax";
import { AssemblyContext } from "./AssemblyProvider";
import {hosts} from "../env/Environment";

const ActualityContext = createContext();

const ActualityProvider = ({ children }) => {
    const { loading, provincialAssembly } = useContext(AssemblyContext);
    const [actualityLoading, setActualityLoading] = useState(true);
    const [lastActualities, setLastActualities] = useState([]);
    const [actualities, setActualities] = useState([]);
    const [error, setError] = useState(null);
    const [onCreateActuality, setOnCreateActuality] = useState(false);
    const [onDeleteActuality, setOnDeleteActuality] = useState(false);

    const createActuality = async (actualityData, coverFile, attachments = []) => {
        setOnCreateActuality(true);

        // 🔒 Vérification obligatoire de l'image principale
        if (!coverFile) {
            console.log("Veuillez sélectionner une image principale (cover) avant de continuer.");
            setOnCreateActuality(false);
            return;
        }

        // 🧠 Transformation des données
        const transformedActualityData = {
            title: actualityData.title,
            type: actualityData.type,
            status: actualityData.statut,
            important: actualityData.isImportant,
            author: actualityData.auteur,
            date: actualityData.date,
            description: actualityData.description,
            details: actualityData.details,
            assemblyId: provincialAssembly.id
        };

        const formData = new FormData();
        formData.append("data", JSON.stringify(transformedActualityData));
        formData.append("cover", coverFile); // ✅ Assuré qu’il est présent

        if (attachments.length > 0) {
            attachments.forEach(file => {
                formData.append("attachments", file);
            });
        }

        try {
            const { data } = await Ajax.postRequest("/admin/actualities", formData);

            if (!data.error) {
                const actuality = data.object;

                const newActuality = {
                    id: actuality.id,
                    type: actuality.type,
                    title: actuality.title,
                    date: actuality.date,
                    description: actuality.description,
                    details: actuality.details,
                    imageUrl: `${hosts.image}/${actuality.imageUrl}`,
                    statut: actuality.status,
                    isImportant: actuality.important,
                    piecesJointes: actuality.attachments,
                    auteur: actuality.author
                };

                setActualities(prev => [...prev, newActuality]);
            }

            return data;
        } catch (error) {
            console.error("Erreur:", error);
            throw error;
        } finally {
            setOnCreateActuality(false);
        }
    };

    const deleteActuality = async (id) => {
        setOnDeleteActuality(true);
        try {
            await Ajax.deleteRequest(`/admin/actualities/${id}`);
            setActualities(prev => prev.filter(actuality => actuality.id !== id));
            setError("Député supprimé avec succès");
        } catch (error) {
            setError("Erreur lors de la suppression");
        }finally {
            setOnDeleteActuality(false);
        }
    };




    useEffect(() => {
        const fetchActualities = async () => {
            if (!provincialAssembly) return;
            setActualityLoading(true);
            setError(null);

            try {
                const { data } = await Ajax.getRequest(`/exposed/actualities/assembly/${provincialAssembly.id}`);
                if (!data.error) {
                    const formatted = data.object
                        .sort((a, b) => new Date(b.date) - new Date(a.date)) // 1. Tri du plus récent au plus ancien
                        .map(actu => ({
                            id: actu.id, // ou actu.id si tu veux garder l'UUID
                            type: actu.type,
                            title: actu.title,
                            date: actu.date, // ou formatDateFr(actu.date) si souhaité
                            description: actu.description,
                            details: actu.details,
                            imageUrl: `${hosts.image}/${actu.imageUrl}`,
                            statut: actu.status,
                            isImportant: actu.important,
                            piecesJointes: actu.attachments || [],
                            auteur: actu.author
                        }));


                    setActualities(formatted);
                    console.log("actualite: ",formatted)
                    setLastActualities(formatted.slice(0, 2)); // Garde uniquement les deux plus récentes
                } else {
                    setError("Erreur lors du chargement des actualités.");
                }
            } catch (err) {
                console.error(err);
                setError("Impossible de contacter le serveur.");
            } finally {
                setActualityLoading(false);
            }
        };

        if (!loading && provincialAssembly) {
            fetchActualities();
        }
    }, [loading, provincialAssembly]);

    return (
        <ActualityContext.Provider value={{ actualityLoading,lastActualities, actualities, error,createActuality,onCreateActuality,deleteActuality,onDeleteActuality}}>
            {children}
        </ActualityContext.Provider>
    );
};

export { ActualityProvider, ActualityContext };