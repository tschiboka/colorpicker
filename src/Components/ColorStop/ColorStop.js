import React from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import "./ColorStop.scss";



export default function ColorStop(props) {
    function handleThumbOnMouseDown(event) { props.setActiveColorStop(props.index, event); }



    function validateInput(event) {
        if (!props.gradient.repeating) {
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
        const textValue = !props.repeating ? props.position + "%" : undefined;

        return (
            <input
                placeholder={textValue}
                type="text"
                min={0}
                onChange={e => validateInput(e)}
                onMouseDown={() => props.setActiveColorStopText(props.index)}
                onTouchStart={() => props.setActiveColorStopText(props.index)}
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
                zIndex: props.isActive ? 100 : Math.round(props.position || 0)
            }}
        >
            <div className="ColorStop__text-box">
                {renderInput()}
            </div>

            <div className="ColorStop__line">
                <svg width="100%" height="100%">
                    <line x1="50%" y1="0" x2="50%" y2="100%" />
                </svg>
            </div>

            <div className="ColorStop__thumb">
                <svg width="14">
                    <line x1="0" y1="100%" x2="7" y2="0" />

                    <line x1="7" y1="0" x2="14" y2="100%" />

                    <line x1="0" y1="100%" x2="100%" y2="100%" />
                </svg>

                <div
                    title={props.color}
                    className={`ColorStop--${props.deleteOn ? "delete-on" : ""}`}
                    style={{ background: `linear-gradient(${props.color} 0%, ${props.color} 100%), url(${checkeredRect}`, }}
                    onMouseDown={e => handleThumbOnMouseDown(e)}
                    onTouchStart={e => handleThumbOnMouseDown(e)}
                >
                </div>
            </div>
        </div>
    );
}