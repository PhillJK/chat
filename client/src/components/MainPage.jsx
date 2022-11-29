import React from "react";
import Header from "./Header";
import Users from "./Users";
import Chat from "./Chat";
import SocketProvider from "../provider/SocketProvider";

const MainPage = () => {
    return (
        <div
            id="main"
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                width: "100%",
                height: "100%",
            }}
        >
            <Header />
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "stretch",
                    flexDirection: "row",
                    width: "100%",
                    height: "90%",
                }}
            >
                <SocketProvider>
                    <Users />
                    <Chat />
                </SocketProvider>
            </div>
        </div>
    );
};

export default MainPage;
