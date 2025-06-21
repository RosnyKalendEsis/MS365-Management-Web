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

    const formatDateFr = (isoString) => {
        const date = new Date(isoString);
        const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const mois = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];

        const jourSemaine = jours[date.getDay()];
        const jour = date.getDate();
        const moisNom = mois[date.getMonth()];
        const heures = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const jourTexte = (jour === 1) ? "1er" : jour;

        return `${jourSemaine} ${jourTexte} ${moisNom} ${heures}H${minutes}`;
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
                            ...actu,
                            date: formatDateFr(actu.date), // 2. Formatage de la date
                            imageUrl: `${hosts.image}/${actu.imageUrl}` // 3. Ajout du préfixe d'hôte à imageUrl
                        }));

                    setActualities(formatted);
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
        <ActualityContext.Provider value={{ actualityLoading,lastActualities, actualities, error }}>
            {children}
        </ActualityContext.Provider>
    );
};

export { ActualityProvider, ActualityContext };