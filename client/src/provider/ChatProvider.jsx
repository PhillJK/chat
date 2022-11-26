import { useState, useEffect, useContext } from "react";
import ChatContext from "../context/ChatContext";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const ChatProvider = ({ children }) => {
    const [isFetchingChats, setIsFetchingChats] = useState(true);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState();
    const [messages, setMessages] = useState([]);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (!authContext?.user?.id) return;

        axios
            .get(
                `${import.meta.env.VITE_SERVER_URL}/api/chat/user/${
                    authContext.user.id
                }`,
            )
            .then(response => {
                setChats(response.data.chats);
            })
            .catch(error => {
                toast.error(`Произошла ошибка во время феча Чатов... ${error}`);
            })
            .finally(() => {
                setIsFetchingChats(false);
            });
    }, [authContext.user]);

    const findUsersToChatWith = async query => {
        const { data } = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/chat/find?name=${query}`,
        );

        if (data.status === "ok") return data.users;
        else throw new Error(data?.message);
    };

    const addChatToUser = async (userId, otherUserId) => {
        const { data } = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/chat/addChat`,
            { userId, otherUserId },
        );

        if (data.status === "ok") setChats(prev => [...prev, data?.chat]);
        else throw new Error(data?.message);
    };

    const getChat = async chatId => {
        const { data } = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/chat/${chatId}`,
        );

        if (data.status === "ok") setMessages(data?.messages);
        else throw new Error(data?.message);
    };

    return (
        <ChatContext.Provider
            value={{
                chats,
                isFetchingChats,
                findUsersToChatWith,
                addChatToUser,
                getChat,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;
