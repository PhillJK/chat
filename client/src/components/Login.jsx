import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Login = () => {
    const authContext = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const submitForm = () => {
        setLoading(true);

        authContext
            .login(formData)
            .catch(error => {
                if (error instanceof AxiosError) {
                    setError(error.response?.data?.message);
                } else {
                    setError(error.message);
                }
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="page-login">
            <h1 className="title">Login</h1>

            {error && (
                <>
                    <h1>Ошибка!</h1>
                    <p>Произошла ошибка во время регистрации</p>
                    <p>Error: {error}</p>
                </>
            )}

            <div>
                <label>
                    <p>Эл. почта</p>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={e =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                </label>
            </div>

            <div>
                <label>
                    <p>Пароль</p>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={e =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                    />
                </label>
            </div>

            <button onClick={submitForm} disabled={loading}>
                Логин
            </button>
        </div>
    );
};

export default Login;
