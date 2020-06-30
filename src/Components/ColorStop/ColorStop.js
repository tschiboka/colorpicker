import React from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import "./ColorStop.scss";



export default function ColorStop(props) {
    const stroke = "rgba(255, 255, 255, 0.5)";

    return (
        <div
            className="ColorStop"
            style={{ left: `calc(${props.position}% - 20px)` }}
        >
            <div className="ColorStop__text-box"></div>

            <div className="ColorStop__line"></div>

            <div
                className="ColorStop__thumb"
                title="props.color"
            >
                <svg width="14">
                    <line x1="0" y1="100%" x2="7" y2="0" style={{ stroke, strokeWidth: 1 }} />

                    <line x1="7" y1="0" x2="14" y2="100%" style={{ stroke, strokeWidth: 1 }} />

                    <line x1="0" y1="100%" x2="100%" y2="100%" style={{ stroke, strokeWidth: 1 }} />
                </svg>

                <div
                    style={{
                        background: `linear-gradient(${props.color} 0%, ${props.color} 100%), url(${checkeredRect}`,
                        border: props.deleteOn ? `1px dotted deeppink` : `1px solid ${stroke}`
                    }}
                >

                </div>
            </div>
        </div>
    );
}