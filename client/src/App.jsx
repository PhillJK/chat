import { useContext } from "react";
import "./App.css";
import Auth from "./components/Auth";
import MainPage from "./components/MainPage";
import AuthContext from "./context/AuthContext";
import ChatProvider from "./provider/ChatProvider";
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
                <ChatProvider>
                    <MainPage />
                </ChatProvider>
            )}
            <Toaster reverseOrder={true} position="bottom-right" />
        </div>
    );
}

export default App;
