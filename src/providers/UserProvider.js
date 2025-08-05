import React, { createContext, useContext, useEffect, useState } from "react";
import { Ajax } from "../services/ajax";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState(null);
    const [onCreateUser, setOnCreateUser] = useState(false);
    const [onUpdateUser, setOnUpdateUser] = useState(false);

    // 🔹 Charger tous les utilisateurs
    const fetchUsers = async () => {
        setUserLoading(true);
        setUserError(null);

        try {
            const { data } = await Ajax.getRequest("/api/users");
            if (!data.error) {
                setUsers(data);
                console.log(data);
            } else {
                setUserError("Erreur lors du chargement des utilisateurs.");
            }
        } catch (error) {
            console.error("Erreur fetchUsers:", error);
            setUserError("Impossible de contacter le serveur.");
        } finally {
            setUserLoading(false);
        }
    };

    // 🔹 Créer un utilisateur
    const createUser = async (userData) => {
        setOnCreateUser(true);
        try {
            const { data } = await Ajax.postRequest("/api/users", userData);
            if (!data.error) {
                setUsers(prev => [...prev, data]);
            }
            return data;
        } catch (error) {
            console.error("Erreur createUser:", error);
            throw error;
        } finally {
            setOnCreateUser(false);
        }
    };

    // 🔹 Modifier un utilisateur
    const updateUser = async (userId, updatedData) => {
        setOnUpdateUser(true);
        try {
            const { data } = await Ajax.putRequest(`/api/users/${userId}`, updatedData);
            if (!data.error) {
                setUsers(prev =>
                    prev.map(user => (user.id === userId ? data : user))
                );
            }
            return data;
        } catch (error) {
            console.error("Erreur updateUser:", error);
            throw error;
        } finally {
            setOnUpdateUser(false);
        }
    };

    // 🔹 Supprimer un utilisateur
    const deleteUser = async (userId) => {
        try {
            await Ajax.deleteRequest(`/api/users/${userId}`);
            setUsers(prev => prev.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Erreur deleteUser:", error);
            setUserError("Échec de la suppression.");
        }
    };

    // 🔹 Obtenir les licences d'un utilisateur
    const fetchUserLicenses = async (userId) => {
        try {
            const { data } = await Ajax.getRequest(`/api/users/${userId}/licenses`);
            return data;
        } catch (error) {
            console.error("Erreur fetchUserLicenses:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <UserContext.Provider
            value={{
                users,
                userLoading,
                userError,
                onCreateUser,
                onUpdateUser,
                createUser,
                updateUser,
                deleteUser,
                fetchUserLicenses,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);