import React, {createContext, useEffect, useState} from "react";
import {Ajax} from "../services/ajax";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [error, setError] = useState('');
    const [isAuthenticate, setIsAuthenticate] = useState(false);

    const login = async (login, password) => {
        setLoading(true);
        const loginData = {
            "email": login,
            "pwd": password
        }
        try {
            const response = await Ajax.postRequest('/admin/auth/login', loginData);
            if (response.status === 200) {
                sessionStorage.setItem('token', response.data.token);
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                console.log("Je suis la personne connecte: ",response.data.user);
                setUser(response.data.user);
                setIsAuthenticate(true);
            }
        }catch(error) {
            if (error.response.status === 401) {
                setError(error.response.data);
            }
        }finally {
            setLoading(false);
        }
    }

    const logout = () => {
        sessionStorage.clear()
        setIsAuthenticate(false);
    }

    useEffect(() => {
        const session = sessionStorage.getItem('token');
        if (session) {
            const usr = sessionStorage.getItem('user');
            if (usr) {
                setUser(JSON.parse(usr));
                setIsAuthenticate(true);
            }
        }
    },[])

    return (
        <AuthContext.Provider value={{ loading, setLoading, user,login,error,setError,isAuthenticate,logout  }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
