import React from 'react';
import LengthInput from "../LengthInput/LengthInput";
import "./RadialSettings.scss";



export default function RadialSettings(props) {
    const hasSizeKeyword = index => props.gradients[props.index]?.radial?.size?.keyword
        && props.gradients[props.index]?.radial?.size?.keyword[index];

    function updateGradientPropertyTo(key, value) {
        const gradient = props.gradients[props.index];
        const radial = gradient.radial ? { ...gradient.radial } : {}

        if (key === "shape") {
            radial.shape = value;
            if (value === "circle") {
                // get rid of size[1]
            }
        }

        if (key === "size-keyword-0") {
            const size = { keyword: [value, hasSizeKeyword(1) || "corner"] }
            radial.size = size;
        }

        if (key === "size-keyword-1") {
            const size = { keyword: [hasSizeKeyword(0) || "farthest", value] }
            radial.size = size;
        }

        if (key === "size") {
            radial.size = value;
        }

        if (key === "position") {
            radial.position = value;
        }

        const updatedGradient = { ...gradient };
        updatedGradient.radial = radial;

        props.updateGradient(updatedGradient, props.index);
        console.log(radial);
    }



    function isActive(key, value) {
        const gradient = props.gradients[props.index];
        let active = false;

        if (key === "shape") {
            if (gradient.radial?.shape === value) active = true;
        }

        if (key === "size-keyword-0") {
            if (hasSizeKeyword(0) === value) active = true;
        }

        if (key === "size-keyword-1") {
            if (hasSizeKeyword(1) === value) active = true;
        }

        if (key === "position-keyword-x") {
            if (gradient?.radial?.position?.keyword?.x === value) active = true;
        }

        if (key === "position-keyword-y") {
            if (gradient?.radial?.position?.keyword?.y === value) active = true;
        }

        if (key === "position-keyword-center") {
            if (gradient?.radial?.position?.keyword?.x === "center" || gradient?.radial?.position?.keyword?.y === "center") active = true;
        }

        return active ? "btn--active" : "btn--inactive";
    }



    function updatePositionKeyword(value) {
        const gradient = props.gradients[props.index];
        const oldPos = gradient?.radial?.position || {};
        const x = gradient?.radial?.position?.keyword?.x;
        const y = gradient?.radial?.position?.keyword?.y;
        const position = oldPos;

        if (value === "left" || value === "right") {
            position.keyword = { x: value, y: y || "center" };
        }

        if (value === "top" || value === "bottom") {
            position.keyword = { x: x || "center", y: value };
        }

        if (value === "center") {
            position.keyword = { x: "center", y: "center" };
        }

        updateGradientPropertyTo("position", position);
    }



    function handleSizeInputOnChange(inputName, value, unit) {
        const gradient = props.gradients[props.index];
        if (gradient?.radial?.shape === "circle") {
            updateGradientPropertyTo("size", { x: { value, unit } });
        } else {
            if (inputName === "size1") {
                const y = gradient?.radial?.size?.y || { value: "0", unit: "px" }
                updateGradientPropertyTo("size", { x: { value, unit }, y: { value: y.value, unit: y.unit } });
            }
            if (inputName === "size2") {
                const x = gradient?.radial?.size?.x || { value: "0", unit: "px" }
                updateGradientPropertyTo("size", { x: { value: x.value, unit: x.unit }, y: { value, unit } });
            }
        }
    }



    function handlePositionInputOnChange(inputName, value, unit) {
        //        const positionIndex = inputName === "position1" ? 0 : 1;
        //
        //        if (value !== "") updatePositionKeyword(positionIndex, (value || "0") + (unit || "px"));
    }



    function getPositionInputValue(positionIndex) {
        //      const positionValue = props.gradients[props.index].radial.position[positionIndex];
        //      return /top|bottom|left|right|center/g.test(positionValue) ? "" : positionValue.match(/[0-9.]+/g)[0];
    }



    function getPositionUnit(positionIndex) {
        //       const positionUnit = props.gradients[props.index].radial.position[positionIndex];
        //       return /top|bottom|left|right|center/g.test(positionUnit) ? "" : positionUnit.match(/%|px|vw|vh|em|rem/g)[0];
    }



    return (
        <div
            className="RadialSettings"
            onClick={(e) => { e.stopPropagation() }}
        >
            <div className="RadialSettings__header">
                <span>
                    Radial Settings of [
                    <span>{props.gradients[props.index].name}</span>
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

                            <div className={isActive("shape", "ellipse")}></div>
                        </button>

                        <button onClick={() => updateGradientPropertyTo("shape", "circle")}>
                            circle

                            <div className={isActive("shape", "circle")}></div>
                        </button>
                    </div>
                </div>

                <div className="RadialSettings__section">
                    <div>Size</div>

                    <div className="RadialSettings__size-btns">
                        <div className="RadialSettings__size-btns__named">
                            <div>
                                <button onClick={() => updateGradientPropertyTo("size-keyword-0", "closest")}>
                                    closest
                                    <div className={isActive("size-keyword-0", "closest")}></div>
                                </button>

                                <button onClick={() => updateGradientPropertyTo("size-keyword-1", "corner")}>
                                    corner
                                    <div className={isActive("size-keyword-1", "corner")}></div>
                                </button>
                            </div>

                            <div>
                                <button onClick={() => updateGradientPropertyTo("size-keyword-0", "farthest")}>
                                    farthest
                                    <div className={isActive("size-keyword-0", "farthest")}></div>
                                </button>

                                <button onClick={() => updateGradientPropertyTo("size-keyword-1", "side")}>
                                    side
                                    <div className={isActive("size-keyword-1", "side")}></div>
                                </button>
                            </div>
                        </div>

                        <div className="RadialSettings__size-btns__length">
                            <span>length:</span>

                            <LengthInput
                                id="1"
                                name="size1"
                                value={props.gradients[props.index]?.radial?.size?.x?.value || ""}
                                unit={props.gradients[props.index]?.radial?.size?.x?.unit || "px"}
                                units={props.gradients[props.index]?.radial?.shape === "circle" ? ["px", "vw", "vh", "em", "rem"].reverse() : ["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                onChange={handleSizeInputOnChange}
                            />

                            <LengthInput
                                id="2"
                                name="size2"
                                disabled={props.gradients[props.index]?.radial?.shape === "circle"}
                                value={props.gradients[props.index]?.radial?.size?.y?.value || ""}
                                unit={props.gradients[props.index]?.radial?.size?.y?.unit || "px"}
                                units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                onChange={handleSizeInputOnChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="RadialSettings__section">
                    <div>Position</div>

                    <div className="RadialSettings__position-btns">
                        <div>
                            <div>
                                <button onClick={() => updatePositionKeyword("top")}>
                                    top

                                    <div className={isActive("position-keyword-y", "top")}></div>
                                </button>
                            </div>

                            <div>
                                <button onClick={() => updatePositionKeyword("left")}>
                                    left

                                    <div className={isActive("position-keyword-x", "left")}></div>
                                </button>

                                <button onClick={() => updatePositionKeyword("center")}>
                                    center

                                    <div className={isActive("position-keyword-center")}></div>
                                </button>

                                <button onClick={() => updatePositionKeyword("right")}>
                                    right

                                    <div className={isActive("position-keyword-x", "right")}></div>
                                </button>
                            </div>

                            <div>
                                <button onClick={() => updatePositionKeyword("bottom")}>
                                    bottom

                                    <div className={isActive("position-keyword-y", "bottom")}></div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <span>at:</span>

                            <LengthInput
                                id="3"
                                name="position1"
                                value={getPositionInputValue(0)}
                                unit={getPositionUnit(0)}
                                units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                onChange={handlePositionInputOnChange}
                            />

                            <LengthInput
                                id="4"
                                name="position2"
                                value={getPositionInputValue(1)}
                                unit={getPositionUnit(1)}
                                units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                onChange={handlePositionInputOnChange}
                            />
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