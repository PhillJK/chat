import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { AxiosError } from "axios";

const Register = () => {
    const authContext = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const submitForm = () => {
        setLoading(true);

        authContext
            .signup(formData)
            .catch(error => {
                if (error instanceof AxiosError) {
                    setError(error.response?.data?.message);
                } else {
                    setError(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className="page-register">
            <h1 className="title">Register</h1>

            {error && (
                <>
                    <h1>Ошибка!</h1>
                    <p>Произошла ошибка во время регистрации</p>
                    <p>Error: {error}</p>
                </>
            )}

            <div>
                <label>
                    <p>Имя</p>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={e =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                    />
                </label>
            </div>

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

            <button disabled={loading} onClick={submitForm}>
                Войти
            </button>
        </div>
    );
};

export default Register;
