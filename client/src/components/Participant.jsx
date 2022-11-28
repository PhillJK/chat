import React from "react";

const Participant = ({ participant, onClick = () => {}, isActive }) => {
    return (
        <div
            style={{
                margin: "10px 0",
                padding: "10px",
                background: isActive ? "grey" : "#1a1a1a",
                borderRadius: "15px",
                cursor: "pointer",
                display: "flex",
                gap: "10px",
            }}
            onClick={onClick}
        >
            <span>{participant.name}</span>
            <span>ID: {participant.id}</span>
        </div>
    );
};

export default Participant;
