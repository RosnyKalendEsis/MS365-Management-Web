import React, {createContext, useEffect, useState} from "react";
import {Ajax} from "../services/ajax";

const AssemblyContext = createContext();

const AssemblyProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [provincialAssembly, setProvincialAssembly] = useState(null);
    const [actualities, setActualities] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const {data} = await Ajax.getRequest(`/exposed/assemblies`)
                if(!data.error){
                    setProvincialAssembly(data.object[0])
                }
            }catch (error) {
                console.log(error)
            }finally {
                setLoading(false)
            }
        }
        fetchData();
    }, []);

    return (
        <AssemblyContext.Provider value={{ loading, setLoading, provincialAssembly }}>
            {children}
        </AssemblyContext.Provider>
    );
};

export { AssemblyContext, AssemblyProvider };
