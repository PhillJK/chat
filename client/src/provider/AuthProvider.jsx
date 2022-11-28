import { useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isFetchingUser, setIsFetchingUser] = useState(true);

    useEffect(() => {
        axios
            .get(`${import.meta.env?.VITE_SERVER_URL}/api/auth/fetch-user`, {
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            })
            .then(response => {
                setUser(response.data?.user);
            })
            .catch(error => {
                console.error(
                    `No user exists with the current session... ${error.response?.data?.message}`,
                );
            })
            .finally(() => {
                setIsFetchingUser(false);
            });
    }, []);

    const signup = async formData => {
        const { data } = await axios.post(
            `${import.meta.env?.VITE_SERVER_URL}/api/auth/signup`,
            formData,
            {
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );

        if (data?.status === "ok") setUser(data.user);
        else throw new Error(data?.message);
    };

    const login = async formData => {
        const { data } = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/auth/login`,
            formData,
            {
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );

        if (data?.status === "ok") setUser(data.user);
        else throw new Error(data?.message);
    };

    const logout = async () => {
        const { data } = await axios.get(
            `${import.meta.env?.VITE_SERVER_URL}/api/auth/logout`,
            {
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );

        if (data?.status === "ok") setUser({});
        else throw new Error(data?.message);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isFetchingUser,
                signup,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
