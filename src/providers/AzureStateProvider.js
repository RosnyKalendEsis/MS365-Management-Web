import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ajax } from "../services/ajax";

const AzureStateContext = createContext();

export const useAzureState = () => useContext(AzureStateContext);

export const AzureStateProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [azureStates, setAzureStates] = useState([]);

    const fetchAzureStates = async () => {
        setLoading(true);
        try {
            const { data } = await Ajax.getRequest("/api/azure-state");
            console.log("azuri: ",data);
            setAzureStates(data);
        } catch (error) {
            console.error("❌ Erreur lors du chargement des AzureState", error);
        } finally {
            setLoading(false);
        }
    };

    const createOrUpdateAzureState = async (state) => {
        try {
            const { data } = await Ajax.postRequest("/api/azure-state", state);
            await fetchAzureStates(); // refresh after update
            return data;
        } catch (error) {
            console.error("❌ Erreur lors de la création ou mise à jour", error);
        }
    };

    const deleteAzureState = async (id) => {
        try {
            await Ajax.deleteRequest(`/api/azure-state/${id}`);
            await fetchAzureStates();
        } catch (error) {
            console.error("❌ Erreur lors de la suppression", error);
        }
    };

    const getAzureStateById = async (id) => {
        try {
            const { data } = await Ajax.getRequest(`/api/azure-state/${id}`);
            return data;
        } catch (error) {
            console.error("❌ Erreur lors de la récupération par ID", error);
        }
    };

    useEffect(() => {
        fetchAzureStates();
    }, []);

    return (
        <AzureStateContext.Provider
            value={{
                loading,
                azureStates,
                fetchAzureStates,
                createOrUpdateAzureState,
                deleteAzureState,
                getAzureStateById
            }}
        >
            {children}
        </AzureStateContext.Provider>
    );
};