import React from 'react';
import LengthInput from "../LengthInput/LengthInput";
import "./RadialSettings.scss";



export default function RadialSettings(props) {
    const gradient = props.gradients[props.index];
    const shape = gradient.radial.shape;
    const size = gradient.radial.size;
    const isSizeNamed = /^(closest|farthest)-(side|corner)$/g.test(size);
    const sizeNamed = isSizeNamed ? size.split("-") : [];
    const sizeLengths = size.match(/(\d+(%|px|vw|vh|rem|em))/g);
    const sizeLengthsObj = !sizeLengths ? [] : sizeLengths.map(size => ({
        value: size.match(/\d+/g)[0],
        unit: size.match(/%|px|vw|vh|rem|em/g)[0]
    }
    ));
    const position = gradient.radial.position;
    const positionObj = position.map(pos => /(\d+(%|px|vw|vh|rem|em))/g.test(pos)
        ? {
            value: pos.match(/\d+/g)[0],
            unit: pos.match(/%|px|vw|vh|rem|em/g)[0]
        }
        : undefined
    );



    function updateGradientPropertyTo(key, value) {
        if (key === "shape" && value === "circle") {
            if (sizeLengthsObj[0] && sizeLengthsObj[0].unit === "%") {
                updateGradientPropertyTo("size", "farthest-corner");
            }
        }
        const updatedGradient = { ...gradient };
        updatedGradient.radial[key] = value;

        props.updateGradient(updatedGradient, props.index);
    }



    function updatePosition(index, value) {
        const updatedGradient = { ...gradient };
        const oppositeAxisIndex = index === 0 ? 1 : 0;
        const oppositePos = position[oppositeAxisIndex];
        const oppositeAxis = (oppositePos === "top" || oppositePos === "bottom") ? "vertical" : (oppositePos === "left" || oppositePos === "right") ? "horizontal" : "center";

        if (oppositeAxis === "vertical" && (value === "top" || value === "bottom")) updatedGradient.radial.position[oppositeAxisIndex] = "center";
        if (oppositeAxis === "horizontal" && (value === "left" || value === "right")) updatedGradient.radial.position[oppositeAxisIndex] = "center";
        updatedGradient.radial.position[index] = value;

        props.updateGradient(updatedGradient, props.index);
    }



    function handleSizeInputOnChange(inputName, value, unit) {
        if (shape === "circle") {
            updateGradientPropertyTo("size", value + (unit || "px"));
        }
        else {
            if (!sizeLengthsObj.length) sizeLengthsObj.push(...[{ value: value, unit: unit }, { value: value, unit: unit }]);

            if (inputName === "size1") updateGradientPropertyTo("size", value + (unit || "px") + " " + (sizeLengthsObj[1].value || 0) + sizeLengthsObj[1].unit);

            if (inputName === "size2") updateGradientPropertyTo("size", (sizeLengthsObj[0].value || 0) + sizeLengthsObj[0].unit + " " + value + (unit || "px"));
        }
    }



    function handlePositionInputOnChange(inputName, value, unit) {
        console.log("UPDATE", ...arguments);
        const positionIndex = inputName === "position1" ? 0 : 1;

        updatePosition(positionIndex, (value || "0") + (unit || "px"));
    }



    return (
        <div
            className="RadialSettings"
            onClick={(e) => { e.stopPropagation() }}
        >
            <div className="RadialSettings__header">
                <span>
                    Radial Settings of [
                    <span>{gradient.name || "Untitled " + props.index}</span>
                ] gradient</span>

                <button onClick={() => props.openRadialSettings(false, props.index, false)}>
                    &times;
                </button>
            </div>

            <div className="RadialSettings__body">
                <div className="RadialSettings__section">
                    <div>Shape</div>

                    <div className="RadialSettings__shape-btns">
                        <button onClick={() => updateGradientPropertyTo("shape", "ellipse")}>
                            ellipse

                            <div className={`btn--${shape === "ellipse" ? "active" : "inactive"}`}></div>
                        </button>

                        <button onClick={() => updateGradientPropertyTo("shape", "circle")}>
                            circle

                            <div className={`btn--${shape === "circle" ? "active" : "inactive"}`}></div>
                        </button>
                    </div>
                </div>

                <div className="RadialSettings__section">
                    <div>Size</div>

                    <div className="RadialSettings__size-btns">
                        <div className="RadialSettings__size-btns__named">
                            <div>
                                <button onClick={() => updateGradientPropertyTo("size", "closest-" + (sizeNamed[1] || "corner"))}>
                                    closest
                                    <div className={`btn--${sizeNamed[0] === "closest" ? "active" : "inactive"}`}></div>
                                </button>

                                <button onClick={() => updateGradientPropertyTo("size", (sizeNamed[0] || "farthest") + "-corner")}>
                                    corner
                                    <div className={`btn--${sizeNamed[1] === "corner" ? "active" : "inactive"}`}></div>
                                </button>
                            </div>

                            <div>
                                <button onClick={() => updateGradientPropertyTo("size", "farthest-" + (sizeNamed[1] || "corner"))}>
                                    farthest
                                    <div className={`btn--${sizeNamed[0] === "farthest" ? "active" : "inactive"}`}></div>
                                </button>

                                <button onClick={() => updateGradientPropertyTo("size", (sizeNamed[0] || "farthest") + "-side")}>
                                    side
                                    <div className={`btn--${sizeNamed[1] === "side" ? "active" : "inactive"}`}></div>
                                </button>
                            </div>
                        </div>

                        <div className="RadialSettings__size-btns__length">
                            <span>length:</span>

                            <div>
                                <LengthInput
                                    id="1"
                                    name="size1"
                                    value={sizeLengthsObj[0] ? sizeLengthsObj[0].value : ""}
                                    unit={sizeLengthsObj[0] ? sizeLengthsObj[0].unit : ""}
                                    units={shape === "circle" ? ["px", "vw", "vh", "em", "rem"] : ["%", "px", "vw", "vh", "em", "rem"]}
                                    onChange={handleSizeInputOnChange}
                                />

                                <div className={`btn--${sizeLengthsObj[0] ? "active" : "inactive"}`}></div>
                            </div>

                            <div>
                                <LengthInput
                                    id="2"
                                    name="size2"
                                    disabled={shape === "circle"}
                                    value={sizeLengthsObj[1] ? sizeLengthsObj[1].value : ""}
                                    unit={sizeLengthsObj[1] ? sizeLengthsObj[1].unit : ""}
                                    units={["%", "px", "vw", "vh", "em", "rem"]}
                                    onChange={handleSizeInputOnChange}
                                />

                                <div className={`btn--${sizeLengthsObj[1] ? "active" : "inactive"}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="RadialSettings__section">
                    <div>Position</div>

                    <div className="RadialSettings__position-btns">
                        <div>
                            <div>
                                <button onClick={() => updatePosition(0, "top")}>
                                    top

                                    <div className={`btn--${position[0] === "top" ? "active" : "inactive"}`}></div>
                                </button>
                            </div>

                            <div>
                                <button onClick={() => updatePosition(0, "left")}>
                                    left

                                    <div className={`btn--${position[0] === "left" ? "active" : "inactive"}`}></div>
                                </button>

                                <button onClick={() => updatePosition(0, "center")}>
                                    center

                                    <div className={`btn--${position[0] === "center" ? "active" : "inactive"}`}></div>
                                </button>

                                <button onClick={() => updatePosition(0, "right")}>
                                    right

                                    <div className={`btn--${position[0] === "right" ? "active" : "inactive"}`}></div>
                                </button>
                            </div>

                            <div>
                                <button onClick={() => updatePosition(0, "bottom")}>
                                    bottom

                                    <div className={`btn--${position[0] === "bottom" ? "active" : "inactive"}`}></div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <div>
                                <button onClick={() => updatePosition(1, "top")}>
                                    top

                                    <div className={`btn--${position[1] === "top" ? "active" : "inactive"}`}></div>
                                </button>
                            </div>

                            <div>
                                <button onClick={() => updatePosition(1, "left")}>
                                    left

                                    <div className={`btn--${position[1] === "left" ? "active" : "inactive"}`}></div>
                                </button>

                                <button onClick={() => updatePosition(1, "center")}>
                                    center

                                    <div className={`btn--${position[1] === "center" ? "active" : "inactive"}`}></div>
                                </button>

                                <button onClick={() => updatePosition(1, "right")}>
                                    right

                                    <div className={`btn--${position[1] === "right" ? "active" : "inactive"}`}></div>
                                </button>
                            </div>

                            <div>
                                <button onClick={() => updatePosition(1, "bottom")}>
                                    bottom

                                    <div className={`btn--${position[1] === "bottom" ? "active" : "inactive"}`}></div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <span>at:</span>

                            <div>
                                <LengthInput
                                    id="3"
                                    name="position1"
                                    value={positionObj[0] ? positionObj[0].value : ""}
                                    unit={positionObj[0] ? positionObj[0].unit : ""}
                                    units={["%", "px", "vw", "vh", "em", "rem"]}
                                    onChange={handlePositionInputOnChange}
                                />

                                <div className={`btn--${positionObj[0] ? "active" : "inactive"}`}></div>
                            </div>

                            <div>
                                <LengthInput
                                    id="4"
                                    name="position2"
                                    value={positionObj[1] ? positionObj[1].value : ""}
                                    unit={positionObj[1] ? positionObj[1].unit : ""}
                                    units={["%", "px", "vw", "vh", "em", "rem"]}
                                    onChange={handlePositionInputOnChange}
                                />

                                <div className={`btn--${positionObj[1] ? "active" : "inactive"}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="RadialSettings__apply-box">
                <button onClick={() => props.openRadialSettings(false, props.index, true)}>Apply</button>

                <button onClick={() => props.openRadialSettings(false, props.index, false)}>Discard</button>
            </div>
        </div>
    );
}