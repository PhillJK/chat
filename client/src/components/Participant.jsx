import React from "react";

const Participant = ({ participant, onClick = () => {} }) => {
    return (
        <div
            style={{
                margin: "10px 0",
                padding: "10px",
                background: "grey",
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
