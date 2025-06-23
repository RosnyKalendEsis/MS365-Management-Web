import React, { createContext, useContext, useEffect, useState } from "react";
import {Ajax} from "../services/ajax";
import { AssemblyContext } from "./AssemblyProvider";
import {hosts} from "../env/Environment";
import {DeputyContext} from "./DeputyProvider";

const BureauContext = createContext();

const BureauProvider = ({ children }) => {
    const { loading, provincialAssembly } = useContext(AssemblyContext);
    const {updateDeputyPhoto} = useContext(DeputyContext);
    const [bureauLoading, setBureauLoading] = useState(true);
    const [onCreateBureau, setOncreateBureau] = useState(false);
    const [bureau, setBureau] = useState(null);
    const [members, setMembers] = useState([]);
    const [bureauError, setBureauError] = useState(null);
    const [bureauRoles, setBureauRoles] = useState([]);

    const createMember = async (bureauData, photoFile) => {
        setOncreateBureau(true);

        try {
            // Associer le bureauId
            bureauData.bureauId = provincialAssembly?.bureauId;
            // Créer le membre du bureau
            const { data } = await Ajax.postRequest("/admin/assembly-bureau-members", bureauData);

            // Mettre à jour la photo du député si fournie
            if (photoFile && bureauData.deputyId) {
                console.log("il y a une photo")
                await updateDeputyPhoto(bureauData.deputyId, photoFile);
            }

            if (!data.error) {
                const newMember = {
                    id: data.object.id,
                    role: data.object.role,
                    membre: {
                        id: data.object.deputy.id,
                        nom: data.object.deputy.name,
                        circonscription: data.object.deputy.constituency,
                        region: data.object.deputy.region,
                        parti: data.object.deputy.party,
                        commission: data.object.deputy.commission,
                        statut: data.object.deputy.status,
                        telephone: data.object.deputy.phone,
                        email: data.object.deputy.email,
                        photo: `${hosts.image}/${data.object.deputy.photo}`,
                        published: data.object.deputy.published
                    },
                };

                setMembers(prev => [...prev, newMember]);
            }

            return data;
        } catch (error) {
            console.error("Erreur lors de la création du membre :", error);
            throw error;
        } finally {
            setOncreateBureau(false);
        }
    };
    useEffect(() => {
        const fetchBureauData = async () => {
            if (!provincialAssembly) return;
            setBureauLoading(true);
            setBureauError(null);

            try {
                const [rolesResponse, membersResponse] = await Promise.all([
                    Ajax.getRequest(`/admin/bureau-roles`),
                    Ajax.getRequest(`/admin/assembly-bureau-members/by-bureau/${provincialAssembly.bureauId}`)
                ]);

                if (!rolesResponse.data.error) {
                    setBureauRoles(rolesResponse.data.object);
                    console.log("bureau roles:", rolesResponse.data.object);
                } else {
                    setBureauError("Erreur lors du chargement des rôles du bureau.");
                }

                if (!membersResponse.data.error) {
                    const transformedMembers = membersResponse.data.object.map(data => ({
                        id: data.id,
                        role: data.role, // si tu veux juste l’objet brut (id, name, description)
                        membre: {
                            id: data.deputy.id,
                            nom: data.deputy.name,
                            circonscription: data.deputy.constituency,
                            region: data.deputy.region,
                            parti: data.deputy.party,
                            commission: data.deputy.commission,
                            statut: data.deputy.status,
                            telephone: data.deputy.phone,
                            email: data.deputy.email,
                            photo: `${hosts.image}/${data.deputy.photo}`,
                            published: data.deputy.published
                        }
                    }));

                    setMembers(transformedMembers);
                }
 else {
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
        <BureauContext.Provider value={{ bureauLoading, bureau, bureauError,bureauRoles,members,createMember }}>
            {children}
        </BureauContext.Provider>
    );
};

export { BureauProvider, BureauContext };