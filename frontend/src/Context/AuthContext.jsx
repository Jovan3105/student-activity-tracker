import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, patchRequest, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    });
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
        role: 1
    });
    const [isConfirmationLoading, setIsConfirmationLoading] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState(null);
    const [confirmationCode, setConfimationCode] = useState(0);



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

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);

    const updateRegisterInfo = useCallback((info) => {
        console.log(info)
        setRegisterInfo(info)
    }, []);

    const updateConfirmCode = useCallback((info) => {
        //console.log(info)
        setConfimationCode(info);
    }, []);

    const registerUser = useCallback(async (e) => {

        e.preventDefault(); // prevent reloading the page when submiting a form
        setIsRegisterLoading(true);
        setRegisterError(null); // reset the presence of an error

        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo))

        setIsRegisterLoading(false);

        if (response.error) {
            return setRegisterError(response);
        }
        // if there is no error then set user
        // localStorage.setItem("User", JSON.stringify(response));
        // setUser(response);

    }, [registerInfo]);

    const confirmAccount = useCallback(async (e) => {

        e.preventDefault(); // prevent reloading the page when submiting a form
        setIsConfirmationLoading(true);
        setConfirmationMessage(null); // reset the presence of an error

        const response = await patchRequest(`${baseUrl}/users/register/confirm`, { confirmationCode: confirmationCode.number })

        setIsConfirmationLoading(false);
        //console.log("response", response)
        if (!response) {
            return setConfirmationMessage({ error: "User not found or already confirmed." })
        }

        if (response) {
            return setConfirmationMessage({ pass: "Account confirmed successfully." });
        }


    }, [confirmationCode]);


    return <AuthContext.Provider value={{
        user,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,
        logoutUser,
        registerUser,
        registerError,
        registerInfo,
        updateRegisterInfo,
        isRegisterLoading,
        confirmAccount,
        confirmationMessage,
        isConfirmationLoading,
        updateConfirmCode,
        confirmationCode
    }}>
        {children}
    </AuthContext.Provider>
}