import { useContext, useState } from "react";
import ChatContext from "../context/ChatContext";
import SocketContext from "../context/SocketContext";
import AuthContext from "../context/AuthContext";

const Chat = () => {
    const [message, setMessage] = useState("");
    const {
        selectedChat,
        messagesOfSelectedChat,
        isFetchingMessages,
        getParticipant,
        addMessages,
    } = useContext(ChatContext);
    const { sendMessage } = useContext(SocketContext);
    const authContext = useContext(AuthContext);

    return (
        <>
            {selectedChat ? (
                <div
                    style={{
                        border: "1px solid grey",
                        background: "#1a1a1a",
                        borderRadius: "15px",
                        flexGrow: 1,
                        flexShrink: 1,
                        margin: "0 20px 20px 20px",
                        display: "flex",
                        flexDirection: "column-reverse",
                        padding: "10px",
                    }}
                >
                    <input
                        style={{
                            padding: 10,
                            borderRadius: 15,
                        }}
                        type="text"
                        name="message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={e => {
                            if (!message.trim()) return;

                            if (e.key === "Enter") {
                                sendMessage(
                                    {
                                        to: getParticipant(selectedChat).id,
                                        content: message,
                                        chatId: selectedChat,
                                    },
                                    messageFromServer => {
                                        addMessages([messageFromServer]);
                                    },
                                );

                                setMessage("");
                            }
                        }}
                        placeholder="Введите текст..."
                    />
                    <div
                        style={{
                            flexShrink: 1,
                            flexGrow: 1,
                            marginBottom: 10,
                            overflowY: "scroll",
                        }}
                    >
                        {isFetchingMessages ? (
                            <h1>Loading...</h1>
                        ) : !!messagesOfSelectedChat?.length ? (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "end",
                                    alignItems: "start",
                                }}
                            >
                                {messagesOfSelectedChat.map(m => (
                                    <div
                                        style={{
                                            padding: "10px",
                                            borderRadius: "10px",
                                            background:
                                                m.fromId === authContext.user.id
                                                    ? "#808080"
                                                    : "#2b2a33",
                                            margin: "5px 20px",
                                        }}
                                        key={m.id}
                                    >
                                        {m.text}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Нету сообщений</p>
                        )}
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </>
    );
};

export default Chat;
