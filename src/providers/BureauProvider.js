import React, { createContext, useContext, useEffect, useState } from "react";
import {Ajax} from "../services/ajax";
import { AssemblyContext } from "./AssemblyProvider";
import {hosts} from "../env/Environment";

const BureauContext = createContext();

const BureauProvider = ({ children }) => {
    const { loading, provincialAssembly } = useContext(AssemblyContext);
    const [bureauLoading, setBureauLoading] = useState(true);
    const [onCreateBureau, setOncreateBureau] = useState(false);
    const [bureau, setBureau] = useState(null);
    const [members, setMembers] = useState([]);
    const [bureauError, setBureauError] = useState(null);
    const [bureauRoles, setBureauRoles] = useState([]);

    const createBureau = async (bureauData, photoFile) => {
        setOncreateBureau(true)
        const formData = new FormData();
        formData.append("data", JSON.stringify(bureauData));
        if (photoFile) {
            formData.append("photo", photoFile);
        }
        console.log("Fichier photo:", formData.get("photo"));
        console.log("Données JSON:", formData.get("data"));


        // try {
        //     const {data} = await Ajax.postRequest("/admin/deputies", formData);
        //
        //     // Optionnel : recharger la liste après création
        //     if (!data.error) {
        //         // convertir le député créé en format FR pour affichage
        //         const newMember = {
        //             id: data.object.id,
        //             role: data.object.name,
        //             membre: data.object.constituency,
        //         };
        //
        //         setMembers(prev => [...prev, newMember]);
        //     }
        //
        //     return data;
        // } catch (error) {
        //     console.error("Erreur:", error);
        //     throw error;
        // }finally {
        //     setOncreateBureau(false);
        // }
    };

    useEffect(() => {
        const fetchBureauData = async () => {
            if (!provincialAssembly) return;
            setBureauLoading(true);
            setBureauError(null);

            try {
                const [rolesResponse, bureausResponse] = await Promise.all([
                    Ajax.getRequest(`/admin/bureau-roles`),
                    Ajax.getRequest(`/admin/bureaus/${provincialAssembly.bureauId}`)
                ]);

                if (!rolesResponse.data.error) {
                    setBureauRoles(rolesResponse.data.object);
                    console.log("bureau roles:", rolesResponse.data.object);
                } else {
                    setBureauError("Erreur lors du chargement des rôles du bureau.");
                }

                if (!bureausResponse.data.error) {
                    setBureau(bureausResponse.data.object);
                    console.log("bureau:", bureausResponse.data.object);
                } else {
                    setBureauError("Erreur lors du chargement des membres du bureau.");
                }

            } catch (err) {
                console.error(err);
                setBureauError("Impossible de contacter le serveur.");
            } finally {
                setBureauLoading(false);
            }
        };


        if (!loading && provincialAssembly) {
            fetchBureauData();
        }
    }, [loading, provincialAssembly]);

    return (
        <BureauContext.Provider value={{ bureauLoading, bureau, bureauError,bureauRoles,members }}>
            {children}
        </BureauContext.Provider>
    );
};

export { BureauProvider, BureauContext };