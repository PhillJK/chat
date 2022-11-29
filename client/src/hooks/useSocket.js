import { useRef, useEffect, useState } from "react";
import io from "socket.io-client";

export const useSocket = (uri, opts) => {
    const cachedSocket = useRef();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (cachedSocket.current) cachedSocket.current.disconnect();
        setIsConnected(false);

        const _socket = io(uri, opts);

        _socket.on("connect", () => setIsConnected(true));
        _socket.on("disconnect", () => setIsConnected(false));

        cachedSocket.current = _socket;

        return () => {
            if (cachedSocket.current) cachedSocket.current.disconnect();
        };
    }, [cachedSocket.current]);

    return [cachedSocket.current, isConnected];
};
