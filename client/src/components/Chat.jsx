import { useContext, useState } from "react";
import ChatContext from "../context/ChatContext";
import SocketContext from "../context/SocketContext";
import AuthContext from "../context/AuthContext";
import toast from "react-hot-toast";

const Chat = () => {
    const [message, setMessage] = useState("");
    const {
        selectedChat,
        messagesOfSelectedChat,
        isFetchingMessages,
        getParticipant,
        addMessages,
    } = useContext(ChatContext);
    const { sendMessage, sendFile } = useContext(SocketContext);
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
                        flexBasis: "600px",
                        margin: "0 20px 20px 20px",
                        display: "flex",
                        flexDirection: "column-reverse",
                        padding: "10px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "10px",
                        }}
                    >
                        <input
                            style={{
                                padding: 10,
                                borderRadius: 15,
                                flexGrow: 1,
                                flexShrink: 1,
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
                        <input
                            type="file"
                            name="file"
                            onChange={e => {
                                const file = e.target.files[0];
                                const index = file.name.lastIndexOf(".");
                                const ext = file.name.slice(index + 1);

                                sendFile(
                                    file,
                                    {
                                        to: getParticipant(selectedChat).id,
                                        chatId: selectedChat,
                                        ext,
                                    },
                                    response => {
                                        if (response.error)
                                            return toast.error(
                                                "Не получилось отправить файл",
                                            );

                                        delete response.error;

                                        addMessages([response]);
                                    },
                                );
                            }}
                        />
                    </div>
                    {isFetchingMessages ? (
                        <h1>Loading...</h1>
                    ) : !!messagesOfSelectedChat?.length ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "end",
                                alignItems: "start",
                                overflowY: "scroll",
                                marginBottom: "10px",
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
                                    {m.type === "Text" ? (
                                        m.text
                                    ) : (
                                        <>
                                            <span>Файл:</span>
                                            <a
                                                href={m.url}
                                                download
                                                target="_blank"
                                            >
                                                Скачать
                                            </a>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Нету сообщений</p>
                    )}
                </div>
            ) : (
                <div></div>
            )}
        </>
    );
};

export default Chat;
