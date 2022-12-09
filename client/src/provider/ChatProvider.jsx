import { useState, useEffect, useContext, useCallback } from "react";
import ChatContext from "../context/ChatContext";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const ChatProvider = ({ children }) => {
    const [isFetchingChats, setIsFetchingChats] = useState(true);
    const [isFetchingMessages, setIsFetchingMessages] = useState(false);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState();
    const [messages, setMessages] = useState([]);
    const authContext = useContext(AuthContext);

    useEffect(() => {
        if (!authContext?.user) return;

        axios
            .get(`${import.meta.env.VITE_SERVER_URL}/api/chat/user`, {
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            })
            .then(response => {
                setChats(response.data.chats);
            })
            .catch(error => {
                toast.error(
                    `Произошла ошибка во время феча Чатов... ${error?.message}`,
                );
            })
            .finally(() => {
                setIsFetchingChats(false);
            });
    }, [authContext.user]);

    useEffect(() => {
        if (!selectedChat) return;
        setIsFetchingMessages(true);

        getChatMessages(selectedChat)
            .then(messages => {
                setMessages([]);
                addMessages(messages);
            })
            .catch(error => {
                toast.error(`Произошла ошибка... ${error?.message}`);
            })
            .finally(() => {
                setIsFetchingMessages(false);
            });
    }, [selectedChat]);

    const getChats = useCallback(async () => {
        setIsFetchingChats(true);

        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/chat/user`,
                {
                    withCredentials: true,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                },
            );

            setChats(data.chats);
            setIsFetchingChats(false);

            return data.chats;
        } catch (error) {
            toast.error(
                `Произошла ошибка во время феча Чатов... ${error?.message}`,
            );
            setIsFetchingChats(false);
        }
    }, []);

    const addMessages = messages => {
        setMessages(prev =>
            [...prev, ...messages].sort((a, b) => {
                var firstDate = a.createdAt;
                var secondDate = b.createdAt;

                if (firstDate < secondDate) {
                    return -1;
                } else if (firstDate == secondDate) {
                    return 0;
                } else {
                    return 1;
                }
            }),
        );
    };

    const findUsersToChatWith = async query => {
        const { data } = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/chat/find?name=${query}`,
            {
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );

        if (data.status === "ok") return data.users;
        else throw new Error(data?.message);
    };

    const addChatToUser = async userId => {
        const { data } = await axios.post(
            `${import.meta.env.VITE_SERVER_URL}/api/chat/addChat`,
            { userId },
            {
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );

        if (data.status === "ok") setChats(prev => [...prev, data?.chat]);
        else throw new Error(data?.message);
    };

    const isParticipantInSelectedChat = participant => {
        const chat = chats.filter(({ id }) => id === selectedChat)[0];

        if (!chat) return false;

        return chat.participants.some(p => p.id === participant);
    };

    const getChatMessages = async chatId => {
        const { data } = await axios.get(
            `${import.meta.env.VITE_SERVER_URL}/api/chat/${chatId}`,
            {
                withCredentials: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
            },
        );

        if (data.status === "ok") return data?.messages;
        else throw new Error(data?.message);
    };

    const getParticipant = chat => {
        if (typeof chat === "number") {
            chat = chats.filter(ch => ch.id === chat)[0];
        }

        const participant = chat.participants.filter(
            user => user.id !== authContext.user.id,
        );
        return participant[0];
    };

    const getChatFromParticipantId = useCallback(
        userId => {
            return chats.find(chat =>
                chat.participants.some(
                    participant => participant.id === userId,
                ),
            );
        },
        [chats],
    );

    return (
        <ChatContext.Provider
            value={{
                chats,
                isFetchingChats,
                isFetchingMessages,
                selectedChat,
                messagesOfSelectedChat: messages,
                addMessages,
                findUsersToChatWith,
                addChatToUser,
                getChatMessages,
                setSelectedChat,
                isParticipantInSelectedChat,
                getParticipant,
                getChats,
                getChatFromParticipantId,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;
