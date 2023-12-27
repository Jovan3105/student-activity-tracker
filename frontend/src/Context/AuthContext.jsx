import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    });

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)
    }, []);

    const loginUser = useCallback(async (e) => {

        e.preventDefault(); // prevent reloading the page when submiting a form
        setIsLoginLoading(true);
        setLoginError(null); // reset the presence of an error

        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo))

        setIsLoginLoading(false);

        if (response.error) {
            return setLoginError(response);
        }
        // if there is no error then set user
        localStorage.setItem("User", JSON.stringify(response));
        setUser(response);

    }, [loginInfo]);

    useEffect(() => {
        const user = localStorage.getItem("User");

        setUser(JSON.parse(user));
    }, []);


    return <AuthContext.Provider value={{
        user,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading
    }}>
        {children}
    </AuthContext.Provider>
}