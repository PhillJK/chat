import { useContext, useState } from "react";
import ChatContext from "../context/ChatContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import User from "./User";
import Participant from "./Participant";
import AuthContext from "../context/AuthContext";

const Users = () => {
    const {
        isFetchingChats,
        chats,
        findUsersToChatWith,
        addChatToUser,
        setSelectedChat,
        selectedChat,
        getParticipant,
    } = useContext(ChatContext);
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);

    const submitForm = () => {
        findUsersToChatWith(query)
            .then(users => setUsers(users))
            .catch(error => {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message);
                } else {
                    toast.error(error.message);
                }
            });
    };

    const handleAddChat = userId => {
        addChatToUser(userId)
            .catch(error => {
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.message);
                } else {
                    toast.error(error.message);
                }
            })
            .finally(() => {
                setUsers([]);
                setQuery("");
            });
    };

    const isChatSelected = (chat, selectedChatId) => {
        return chat.id === selectedChatId;
    };

    return (
        <div
            style={{
                width: 300,
            }}
        >
            {isFetchingChats ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div>
                        <label
                            style={{
                                display: "flex",
                                gap: 10,
                                marginBottom: 30,
                            }}
                        >
                            <input
                                style={{
                                    width: "75%",
                                }}
                                placeholder="Введите ник юзера..."
                                type="text"
                                name="query"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <button
                                style={{ width: "25%" }}
                                onClick={submitForm}
                            >
                                Найти
                            </button>
                        </label>
                    </div>
                    {!!users.length ? (
                        users.map(user => (
                            <User
                                key={user.id}
                                name={user.name}
                                onClick={() => handleAddChat(user.id)}
                            />
                        ))
                    ) : chats.length ? (
                        chats.map(chat => (
                            <Participant
                                key={chat.id}
                                participant={getParticipant(chat)}
                                onClick={() => setSelectedChat(chat.id)}
                                isActive={isChatSelected(chat, selectedChat)}
                            />
                        ))
                    ) : (
                        <p>У вас нету чатов</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Users;
