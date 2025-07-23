import React, { createContext, useContext, useEffect, useState } from 'react';
import { Ajax } from '../services/ajax';
import { hosts } from "../env/Environment";

const PlenarySessionContext = createContext();

export const PlenarySessionProvider = ({ children }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            const { data } = await Ajax.getRequest('/admin/plenary-sessions');
            if (!data.error) {
                const updatedSessions = data.object.map(session => ({
                    ...session,
                    documents: session.documents.map(doc => `${hosts.image}/plenary-session/${doc}`)
                }));
                setSessions(updatedSessions);
                console.log("data plenary sessions: ", updatedSessions);
            }
        } catch (err) {
            console.error("Erreur lors du chargement des séances plénières:", err);
        } finally {
            setLoading(false);
        }
    };

    const getSessionById = async (id) => {
        try {
            const res = await Ajax.getRequest(`/admin/plenary-sessions/${id}`);
            return res.data;
        } catch (err) {
            console.error("Erreur lors de la récupération de la séance plénière:", err);
        }
    };


    const createSession  = async (sessionData,attachments = []) => {

        const dataToSend = {
            title: sessionData.title,
            date: sessionData.date,
            time: sessionData.time,
            type: sessionData.type,
            location: sessionData.location,
            description: sessionData.description,
            points: sessionData.points,
            status: sessionData.status,
            featured: sessionData.featured,
        }

        const formData = new FormData();
        formData.append("data", JSON.stringify(dataToSend));

        if (attachments.length > 0) {
            attachments.forEach(file => {
                formData.append("attachments", file);
            });
        }

        try {
            const { data } = await Ajax.postRequest("/admin/plenary-sessions", formData);

            if (!data.error) {
                await fetchSessions();
            }
        } catch (error) {
            console.error("Erreur:", error);
            throw error;
        }
    };

    const updateSession = async (id, sessionData) => {
        try {
            const { data } = await Ajax.putRequest(`/admin/plenary-sessions/${id}`, sessionData);

            if (!data.error) {
                await fetchSessions();
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la séance:", error);
            throw error;
        }
    };

    const deleteSession = async (id) => {
        try {
            const res = await Ajax.deleteRequest(`/admin/plenary-sessions/${id}`);
            if (res.status === 200) {
                await fetchSessions();
            }
        } catch (err) {
            console.error("Erreur lors de la suppression de la séance:", err);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    return (
        <PlenarySessionContext.Provider value={{
            sessions,
            loading,
            fetchSessions,
            getSessionById,
            createSession,
            updateSession,
            deleteSession
        }}>
            {children}
        </PlenarySessionContext.Provider>
    );
};

export const usePlenarySession = () => useContext(PlenarySessionContext);