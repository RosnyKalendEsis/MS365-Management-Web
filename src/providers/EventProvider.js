import React, { createContext, useContext, useEffect, useState } from "react";
import {Ajax} from "../services/ajax";
import { AssemblyContext } from "./AssemblyProvider";
import {hosts} from "../env/Environment";

const EventContext = createContext();

const EventProvider = ({ children }) => {
    const { loading, provincialAssembly } = useContext(AssemblyContext);
    const [eventLoading, setEventLoading] = useState(true);
    const [lastEvents, setLastEvents] = useState([]);
    const [events, setEvents] = useState([]);
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
        const fetchEvents = async () => {
            if (!provincialAssembly) return;
            setEventLoading(true);
            setError(null);

            try {
                const { data } = await Ajax.getRequest(`/exposed/events/assembly/${provincialAssembly.id}`);
                if (!data.error) {
                    const formatted = data.object
                        .sort((a, b) => {
                            const dateA = a.date ? new Date(a.date) : 0;
                            const dateB = b.date ? new Date(b.date) : 0;
                            return dateB - dateA;
                        })
                        .map(actu => ({
                            ...actu,
                            date: actu.date ? formatDateFr(actu.date) : null,
                            start: actu.start ? formatDateFr(actu.start) : null,
                            end: actu.end ? formatDateFr(actu.end) : null,
                            imageUrl: `${hosts.image}/${actu.imageUrl}`
                        }));


                    setEvents(formatted);
                    setLastEvents(formatted.slice(0, 4)); // Garde uniquement les deux plus récentes
                } else {
                    setError("Erreur lors du chargement des actualités.");
                }
            } catch (err) {
                console.error(err);
                setError("Impossible de contacter le serveur.");
            } finally {
                setEventLoading(false);
            }
        };

        if (!loading && provincialAssembly) {
            fetchEvents();
        }
    }, [loading, provincialAssembly]);

    return (
        <EventContext.Provider value={{ eventLoading,lastEvents, events, error }}>
            {children}
        </EventContext.Provider>
    );
};

export { EventProvider, EventContext };