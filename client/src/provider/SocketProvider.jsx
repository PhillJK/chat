import React, { useCallback, useContext, useEffect } from "react";
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

        const handleMessageEvent = message => {
            if (chatContext.isParticipantInSelectedChat(message.fromId)) {
                chatContext.addMessages([message]);
            }
        };

        socket.on("message_receive", handleMessageEvent);

        return () => {
            socket.off("message_receive", handleMessageEvent);
        };
    }, [chatContext, isConnected]);

    const sendMessage = useCallback(
        ({ to, content, chatId }, cb) => {
            if (!isConnected) return;

            socket.emit("message_send", { to, content, chatId }, cb);
        },
        [isConnected],
    );

    return (
        <SocketContext.Provider value={{ sendMessage }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
