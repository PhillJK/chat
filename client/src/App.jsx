import { useContext } from "react";
import "./App.css";
import Auth from "./components/Auth";
import MainPage from "./components/MainPage";
import AuthContext from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
    const { isFetchingUser, user } = useContext(AuthContext);

    return (
        <div className="App">
            {isFetchingUser ? (
                <h1>Loading...</h1>
            ) : !user?.id ? (
                <Auth />
            ) : (
                <MainPage />
            )}
            <Toaster reverseOrder={true} position="bottom-right" />
        </div>
    );
}

export default App;
