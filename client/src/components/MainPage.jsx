import React from "react";
import Header from "./Header";

const MainPage = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100vh",
                border: "1px solid red",
            }}
        >
            <Header />
        </div>
    );
};

export default MainPage;
