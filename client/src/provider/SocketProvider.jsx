import React, { useCallback, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import ChatContext from "../context/ChatContext";
import SocketContext from "../context/SocketContext";
import { useSocket } from "../hooks/useSocket";

const SocketProvider = ({ children }) => {
    const [socket, isConnected] = useSocket("ws://localhost:3000", {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: true,
        withCredentials: true,
    });

    const chatContext = useContext(ChatContext);

    useEffect(() => {
        if (!isConnected) return;

        const handleMessageEvent = async message => {
            if (chatContext.isParticipantInSelectedChat(message.fromId)) {
                chatContext.addMessages([message]);
                return;
            }

            const chat = chatContext.getChatFromParticipantId(message.fromId);

            if (chat) {
                const participant = chat.participants.find(
                    participant => participant.id === message.fromId,
                );
                toast.success(`У вас новое сообщение от ${participant.name}`);
            } else {
                const chats = await chatContext.getChats();

                const chat = chats.find(chat => chat.id === message.chatId);
                const participant = chat.participants.find(
                    participant => participant.id === message.fromId,
                );

                toast.success(`У вас новое сообщение от ${participant.name}`);
            }
        };

        socket.on("message_receive", handleMessageEvent);

        return () => {
            socket.off("message_receive", handleMessageEvent);
        };
    }, [chatContext, isConnected]);

    const sendMessage = useCallback(
        (data, cb = () => {}) => {
            if (!isConnected) return;

            socket.emit("message_send", data, cb);
        },
        [isConnected],
    );

    const sendFile = useCallback(
        (file, data, cb = () => {}) => {
            if (!isConnected) return;

            socket.emit("message_send_file", file, data, cb);
        },
        [isConnected],
    );

    return (
        <SocketContext.Provider value={{ sendMessage, sendFile }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
