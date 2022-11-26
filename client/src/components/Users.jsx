import { useContext, useState } from "react";
import ChatContext from "../context/ChatContext";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import User from "./User";
import Participant from "./Participant";
import AuthContext from "../context/AuthContext";

const Users = () => {
    const { isFetchingChats, chats, findUsersToChatWith, addChatToUser } =
        useContext(ChatContext);
    const [query, setQuery] = useState("");
    const [users, setUsers] = useState([]);
    const authContext = useContext(AuthContext);

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

    const handleAddChat = (userId, otherUserId) => {
        addChatToUser(userId, otherUserId)
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

    const getParticipant = chat => {
        const participant = chat.participants.filter(
            user => user.id !== authContext.user.id,
        );
        return participant[0];
    };

    return (
        <div
            style={{
                width: 300,
                height: "100%",
            }}
        >
            {isFetchingChats ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div>
                        <label>
                            <input
                                type="text"
                                name="query"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                            <button onClick={submitForm}>Найти</button>
                        </label>
                    </div>
                    {!!users.length ? (
                        users.map(user => (
                            <User
                                key={user.id}
                                name={user.name}
                                onClick={() =>
                                    handleAddChat(authContext.user.id, user.id)
                                }
                            />
                        ))
                    ) : chats.length ? (
                        chats.map(chat => (
                            <Participant
                                key={chat.id}
                                participant={getParticipant(chat)}
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
