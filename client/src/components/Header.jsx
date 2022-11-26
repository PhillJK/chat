import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";

const Header = () => {
    const [loading, setLoading] = useState(false);
    const authContext = useContext(AuthContext);

    const handleLogout = () => {
        setLoading(true);
        authContext
            .logout()
            .catch(error => {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message);
                } else {
                    toast.error(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "end",
                gap: 30,
                width: "100%",
                height: "10%",
            }}
        >
            <p>Вы залогинены как {authContext.user.name}</p>
            <button disabled={loading} onClick={handleLogout}>
                Выйти
            </button>
        </div>
    );
};

export default Header;
