import React from "react";

const User = ({ name, onClick = () => {} }) => {
    return (
        <div
            style={{
                background: "#615f58",
                borderRadius: "15px",
                padding: "10px",
                margin: "5px 0px",
                cursor: "pointer",
            }}
            onClick={onClick}
        >
            {name}
        </div>
    );
};

export default User;
