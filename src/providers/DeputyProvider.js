import React, { createContext, useContext, useEffect, useState } from "react";
import { AssemblyContext } from "./AssemblyProvider";
import { hosts } from "../env/Environment";
import { Ajax } from "../services/ajax";

const DeputyContext = createContext();

const DeputyProvider = ({ children }) => {
    const { loading, provincialAssembly } = useContext(AssemblyContext);
    const [deputyLoading, setDeputyLoading] = useState(true);
    const [deputies, setDeputies] = useState([]);
    const [onCreateDeputy, setOnCreateDeputy] = useState(false);
    const [ setOnUpdateDeputy] = useState(false);
    const [deputyError, setDeputyError] = useState(null);


    const createDeputy = async (deputyData, photoFile) => {
        setOnCreateDeputy(true)
        const formData = new FormData();
        formData.append("data", JSON.stringify(deputyData));
        if (photoFile) {
            formData.append("photo", photoFile);
        }


        try {
            const {data} = await Ajax.postRequest("/admin/deputies", formData);

            // Optionnel : recharger la liste après création
            if (!data.error) {
                // convertir le député créé en format FR pour affichage
                const newDeputy = {
                    id: data.object.id,
                    nom: data.object.name,
                    circonscription: data.object.constituency,
                    region: data.object.region,
                    parti: data.object.party,
                    commission: data.object.commission,
                    statut: data.object.status,
                    telephone: data.object.phone,
                    email: data.object.email,
                    photo: `${hosts.image}/${data.object.photo}`,
                    published: data.object.published
                };

                setDeputies(prev => [...prev, newDeputy]);
            }

            return data;
        } catch (error) {
            console.error("Erreur:", error);
            throw error;
        }finally {
            setDeputyLoading(false);
        }
    };

    const updateDeputyPhoto = async (deputyId, photoFile) => {
        if (!deputyId || !photoFile) {
            console.warn("ID du député ou fichier photo manquant");
            return;
        }

        setOnCreateDeputy(true);

        const formData = new FormData();
        formData.append("photo", photoFile);

        try {
            const { data } = await Ajax.putRequest(`/admin/deputies/${deputyId}/photo`, formData);

            if (!data.error) {
                const updatedDeputy = {
                    id: data.object.id,
                    nom: data.object.name,
                    circonscription: data.object.constituency,
                    region: data.object.region,
                    parti: data.object.party,
                    commission: data.object.commission,
                    statut: data.object.status,
                    telephone: data.object.phone,
                    email: data.object.email,
                    photo: `${hosts.image}/${data.object.photo}`,
                    published: data.object.published
                };

                // Met à jour localement le député avec la nouvelle photo
                setDeputies(prev =>
                    prev.map(dep => dep.id === updatedDeputy.id ? updatedDeputy : dep)
                );
            }

            return data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la photo :", error);
            throw error;
        } finally {
            setOnCreateDeputy(false);
        }
    };

    const publishDeputy = async (id, published) => {
        setOnUpdateDeputy(true);
        try {
            const {data} = await Ajax.putRequest(`/admin/deputies/publish/${id}?published=${published}`);

            if (!data.error) {
                setDeputies((prev) =>
                    prev.map((dep) =>
                        dep.id === id ? { ...dep, published: published } : dep
                    )
                );
            }

            return data;
        } catch (error) {
            console.error("Erreur lors de la mise à jour du statut publication :", error);
            throw error;
        }finally {
            setDeputyLoading(false);
        }
    };
    const deleteDeputy = async (id) => {
        try {
            await Ajax.deleteRequest(`/admin/deputies/${id}`);

            // Mise à jour locale : on enlève le député supprimé du state
            setDeputies(prev => prev.filter(dep => dep.id !== id));

            setDeputyError("Député supprimé avec succès");
        } catch (error) {
            setDeputyError("Erreur lors de la suppression");
        }
    };



    useEffect(() => {
        const fetchDeputies = async () => {
            if (!provincialAssembly) return;
            setDeputyLoading(true);
            setDeputyError(null);

            try {
                const { data } = await Ajax.getRequest(`/admin/deputies/assembly/${provincialAssembly.id}`);
                if (!data.error) {
                    const transformed = data.object.map(dep => ({
                        id: dep.id,
                        nom: dep.name,
                        circonscription: dep.constituency,
                        region: dep.region,
                        parti: dep.party,
                        commission: dep.commission,
                        statut: dep.status,
                        telephone: dep.phone,
                        email: dep.email,
                        photo: `${hosts.image}/${dep.photo}`,
                        published: dep.published
                    }));
                    setDeputies(transformed);
                } else {
                    setDeputyError("Erreur lors du chargement des députés.");
                }
            } catch (err) {
                console.error(err);
                setDeputyError("Impossible de contacter le serveur.");
            } finally {
                setDeputyLoading(false);
            }
        };

        if (!loading && provincialAssembly) {
            fetchDeputies();
        }
    }, [loading, provincialAssembly]);

    return (
        <DeputyContext.Provider value={{ deputyLoading, deputies, deputyError, createDeputy, onCreateDeputy, publishDeputy, deleteDeputy,updateDeputyPhoto }}>
            {children}
        </DeputyContext.Provider>
    );
};

export { DeputyProvider, DeputyContext };