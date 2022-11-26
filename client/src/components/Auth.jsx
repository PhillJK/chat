import { useState } from "react";
import Register from "./Registeration";
import Login from "./Login";

const Auth = () => {
    const [authState, setAuthState] = useState("login");

    return (
        <div>
            {authState === "login" ? <Login /> : <Register />}
            {authState === "login" ? (
                <p>
                    Нету аккаунта?{" "}
                    <a onClick={() => setAuthState("register")}>Регистрация</a>
                </p>
            ) : (
                <p>
                    Есть аккаунт?{" "}
                    <a onClick={() => setAuthState("login")}>Логин</a>
                </p>
            )}
        </div>
    );
};

export default Auth;
