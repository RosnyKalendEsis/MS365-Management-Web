import React, { createContext, useContext, useEffect, useState } from 'react';
import { Ajax } from '../services/ajax';
import {hosts} from "../env/Environment";

const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);



    const fetchActivities = async () => {
        try {
            const { data } = await Ajax.getRequest('/admin/activities');
            if (!data.error) {
                const updatedActivities = data.object.map(activity => ({
                    ...activity,
                    images: activity.images.map(img => `${hosts.image}/activity/${img}`)
                }));
                setActivities(updatedActivities);
                console.log("data activity: ", updatedActivities);
            }
        } catch (err) {
            console.error("Erreur lors du chargement des activités:", err);
        } finally {
            setLoading(false);
        }
    };

    const getActivityById = async (id) => {
        try {
            const res = await Ajax.getRequest(`/admin/activities/${id}`);
            return res.data;
        } catch (err) {
            console.error("Erreur lors de la récupération de l’activité:", err);
        }
    };

    const createActivity = async (activityData,attachments = []) => {


        const formData = new FormData();
        formData.append("data", JSON.stringify(activityData));

        if (attachments.length > 0) {
            attachments.forEach(file => {
                console.log("File:", file);
                formData.append("attachments", file);
            });
        }

        try {
            const { data } = await Ajax.postRequest("/admin/activities", formData);

            if (!data.error) {
                await fetchActivities();
            }
        } catch (error) {
            console.error("Erreur:", error);
            throw error;
        }
    };

    const deleteActivity = async (id) => {
        try {
            const res = await Ajax.deleteRequest(`/admin/activities/${id}`);
            if (res.status === 200) {
                await fetchActivities();
            }
        } catch (err) {
            console.error("Erreur lors de la suppression de l’activité:", err);
        }
    };

    const likeActivity = async (activityId) => {
        try {
            const res = await Ajax.postRequest(`/admin/activities/${activityId}/likes`,{});
            if (res.status === 200) {
                await fetchActivities(); // Refresh list to update like count
            }
        } catch (err) {
            console.error("Erreur lors du like de l’activité:", err);
        }
    };

    const commentActivity = async (activityId, content) => {
        try {
            const res = await Ajax.postRequest(`/admin/activities/${activityId}/comments`, { content });
            if (res.status === 200 || res.status === 201) {
                await fetchActivities(); // Refresh list to include comment
            }
        } catch (err) {
            console.error("Erreur lors du commentaire de l’activité:", err);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    return (
        <ActivityContext.Provider value={{
            activities,
            loading,
            fetchActivities,
            getActivityById,
            createActivity,
            deleteActivity,
            likeActivity,
            commentActivity
        }}>
            {children}
        </ActivityContext.Provider>
    );
};

export const useActivity = () => useContext(ActivityContext);