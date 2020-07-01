import React from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import "./ColorHint.scss";



export default function ColorHint(props) {
    const stroke = "rgba(255, 255, 255, 0.5)";
    const border = props.deleteOn ? `2px dotted deeppink` : props.adjecentColors ? `2px solid #888` : `2px solid ${stroke}`;
    const background = props.adjecentColors ? `linear-gradient(90deg, ${props.adjecentColors[0]} 0% 50%, ${props.adjecentColors[1]} 50%), url(${checkeredRect}` : "transparent";
    const title = `color hint ${props.index} ` + props.errorInfo;


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



    function renderAdjecentColors() {
        if (props.adjecentColors) {
            return props.adjecentColors.map((adjecentColor, i) => (
                <div
                    key={`adjecentColor_${props.index}-${i}`}
                    style={{ background: adjecentColor }}
                ></div>
            ));
        }
    }



    return (
        <div
            className="ColorHint"
            style={{
                left: `calc(${props.position}% - 20px)`,
                zIndex: props.isActive ? 100 : 1
            }}
        >
            <div className="ColorHint__text-box">
                {renderInput()}
            </div>

            <div className="ColorHint__thumb">
                <svg width="100%" height="100%">
                    <line x1="50%" y1="0" x2="50%" y2="50%" style={{ stroke: "rgba(221, 221, 221, 0.2)" }} />
                </svg>

                <div
                    title={title}
                    style={{ border, background }}
                    onMouseDown={() => props.setActiveColorHint(props.index)}
                >
                    {renderAdjecentColors()}
                </div>
            </div>
        </div >
    );
}