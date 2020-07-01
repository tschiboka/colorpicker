import React from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import "./ColorStop.scss";



export default function ColorStop(props) {
    const stroke = "rgba(255, 255, 255, 0.5)";



    function validateInput(event) {
        if (props.units === "percentage") {
            const value = event.target.value;
            const nonEmpty = value !== "";
            const isNumber = typeof Number(value) === "number";
            const lt5Char = value.length < 5;
            const gt0 = Number(value) >= 0;
            const lt100 = Number(value) <= 100
            const isValid = isNumber && nonEmpty && lt5Char && gt0 && lt100;

            event.target.setCustomValidity(isValid ? "" : " ");
        }
    }



    function renderInput() {
        const textValue = props.units === "percentage" ? props.position + "%" : undefined;

        return (
            <input
                placeholder={textValue}
                type="text"
                min={0}
                onChange={e => validateInput(e)}
                onMouseDown={() => props.setActiveColorStopText(props.index)}
                onBlur={e => props.handleInputOnBlur(e)}
                onKeyDown={e => props.handleInputOnKeyDown(e)}
            />
        );
    }



    return (
        <div
            className="ColorStop"
            style={{
                left: `calc(${props.position}% - 20px)`,
                zIndex: props.isActive ? 100 : 1
            }}
        >
            <div className="ColorStop__text-box">
                {renderInput()}
            </div>

            <div className="ColorStop__line">
                <svg width="100%" height="100%">
                    <line x1="50%" y1="0" x2="50%" y2="100%" style={{ stroke: "rgba(221, 221, 221, 0.2)" }} />
                </svg>
            </div>

            <div className="ColorStop__thumb">
                <svg width="14">
                    <line x1="0" y1="100%" x2="7" y2="0" style={{ stroke, strokeWidth: 1 }} />

                    <line x1="7" y1="0" x2="14" y2="100%" style={{ stroke, strokeWidth: 1 }} />

                    <line x1="0" y1="100%" x2="100%" y2="100%" style={{ stroke, strokeWidth: 1 }} />
                </svg>

                <div
                    title={props.color}
                    style={{
                        background: `linear-gradient(${props.color} 0%, ${props.color} 100%), url(${checkeredRect}`,
                        border: props.deleteOn ? `1px dotted deeppink` : `1px solid ${stroke}`,
                    }}
                    onMouseDown={() => props.setActiveColorStop(props.index)}
                >
                </div>
            </div>
        </div>
    );
}