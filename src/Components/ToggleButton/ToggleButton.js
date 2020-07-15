import React from 'react';
import "./ToggleButton.scss";



export function ToggleButton(props) {
    return (
        <div
            className="ToggleButton"
            onClick={() => props.handleOnClick()}
        >
            <div style={{ left: props.on ? "" : "1.5px", right: props.on ? "1.5px" : "" }}>
                <div
                    style={{ background: props.on ? "#4cc3f1" : "#ff1493" }}
                >

                </div>
            </div>
        </div>
    );
}
