import React from 'react';
import checkeredRect from "../ColorPicker/images/checkered_rect.png";
import { getPositionInPercent } from "../../functions/slider";
import "./ColorHint.scss";



export default function ColorHint(props) {
    const isInRange = getPositionInPercent(props.position, props.gradient.max) <= 100;
    const background = props.adjecentColors ? `linear-gradient(90deg, ${props.adjecentColors[0]} 0% 50%, ${props.adjecentColors[1]} 50%), url(${checkeredRect}` : "transparent";
    const title = `color hint ${props.index} ` + (props.errorInfo ? "[" + props.errorInfo + "]" : "");



    function handleThumbOnMouseDown(event) { props.setActiveColorHint(props.index, event); event.preventDefault(); }



    function validateInput(event) {
        if (!props.repeating) {
            const value = event.target.value;
            const nonEmpty = value !== "";
            const isNumber = typeof Number(value) === "number";
            const lt5Char = value.length < 5;
            const gt0 = Number(value) >= 0;
            const ltMax = Number(value) <= props.gradient.max;
            const isValid = isNumber && nonEmpty && lt5Char && gt0 && ltMax;

            event.target.setCustomValidity(isValid ? "" : " ");
        }
    }



    function renderInput() {
        const textValue = props.position + props.gradient.repeatingUnit;

        return (
            <input
                placeholder={textValue}
                type="text"
                min={0}
                onChange={e => validateInput(e)}
                onMouseDown={() => props.setActiveColorHintText(props.index)}
                onTouchStart={() => props.setActiveColorHintText(props.index)}
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
                display: isInRange ? "block" : "none",
                left: `calc(${getPositionInPercent(props.position, props.gradient.max)}% - 20px)`,
                zIndex: props.isActive ? 100 : Math.round(getPositionInPercent(props.position, props.gradient.max))
            }}
        >
            <div className="ColorHint__text-box">
                {renderInput()}
            </div>

            <div className="ColorHint__thumb">
                <svg width="100%" height="100%">
                    <line x1="50%" y1="0" x2="50%" y2="50%" />
                </svg>

                <div
                    className={`ColorHint--${props.deleteOn ? "delete-on" : ""}`}
                    title={title}
                    style={{ background }}
                    onMouseDown={e => handleThumbOnMouseDown(e)}
                    onTouchStart={e => handleThumbOnMouseDown(e)}
                    draggable={true}
                >
                    {renderAdjecentColors()}
                </div>
            </div>
        </div>
    );
}