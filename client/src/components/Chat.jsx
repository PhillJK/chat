import { useContext, useState } from "react";
import ChatContext from "../context/ChatContext";

const Chat = () => {
    const [message, setMessage] = useState("");
    const { selectedChat, messagesOfSelectedChat } = useContext(ChatContext);

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
                        onChange={e => setMessage(e.target.value)}
                        placeholder="Введите текст..."
                    />
                    <div>
                        {!!messagesOfSelectedChat?.length &&
                            messagesOfSelectedChat.map(m => (
                                <div>{m.text}</div>
                            ))}
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </>
    );
};

export default Chat;
