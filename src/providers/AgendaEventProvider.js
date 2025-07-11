import React, {createContext, useContext, useEffect, useState} from 'react';
import { message } from 'antd';
import {Ajax} from "../services/ajax";
import {hosts} from "../env/Environment";


const AgendaEventContext = createContext();

export const useAgendaEvent = () => useContext(AgendaEventContext);

export const AgendaEventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [onCreatingAgenda, setOnCreatingAgenda] = useState(false);
    const [onUpdateAgenda, setOnUpdateAgenda] = useState(false);
    const [onDeleteAgenda, setOnDeleteAgenda] = useState(false);
    const [loadingAgenda, setLoadingAgenda] = useState(false);

    // 🔄 GET ALL
    const fetchEvents = async () => {
        setLoadingAgenda(true);
        try {
            const { data } = await Ajax.getRequest("/admin/agenda-events");
            if (!data.error) {
                const formattedEvents = data.object.map(event => ({
                    ...event,
                    imageUrl: `${hosts.image}/${event.imageUrl}`
                }));
                setEvents(formattedEvents);
            }
        } catch (e) {
            message.error("Erreur de chargement des événements");
        } finally {
            setLoadingAgenda(false);
        }
    };


    // ✅ CREATE
    const createEvent = async (eventData, coverFile) => {
        setOnCreatingAgenda(true);
        const formData = new FormData();
        const transformedData = {
            ...eventData,
            dateRange: eventData.dateRange || [],
        };

        formData.append("data", JSON.stringify(transformedData));

        if (coverFile) {
            formData.append("cover", coverFile);
        }

        try {
            const { data } = await Ajax.postRequest("/admin/agenda-events", formData);
            if (!data.error) {
                await fetchEvents();
            }
            return data;
        } catch (e) {
            message.error("Erreur lors de la création de l'événement");
            throw e;
        }finally {
            setOnCreatingAgenda(false);
        }
    };

    // ✏️ UPDATE
    const updateEvent = async (id, updatedData) => {
        setOnUpdateAgenda(false);
        try {
            const { data } = await Ajax.putRequest(`/admin/agenda-events/${id}`, updatedData);
            if (!data.error) {
                await fetchEvents();
                message.success("Événement mis à jour !");
            }
            return data;
        } catch (e) {
            message.error("Erreur lors de la mise à jour");
            throw e;
        }finally {
            setOnUpdateAgenda(false);
        }
    };

    // ❌ DELETE
    const deleteEvent = async (id) => {
        setOnDeleteAgenda(false);
        try {
            const { data } = await Ajax.deleteRequest(`/admin/agenda-events/${id}`);
            if (!data.error) {
                await fetchEvents();
                message.success("Événement supprimé !");
            }
            return data;
        } catch (e) {
            message.error("Erreur lors de la suppression");
            throw e;
        }finally {
            setOnDeleteAgenda(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    },[])

    return (
        <AgendaEventContext.Provider value={{
            events,
            onCreatingAgenda,
            onUpdateAgenda,
            onDeleteAgenda,
            loadingAgenda,
            fetchEvents,
            createEvent,
            updateEvent,
            deleteEvent
        }}>
            {children}
        </AgendaEventContext.Provider>
    );
};
