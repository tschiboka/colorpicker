import React from 'react';
import LengthInput from "../LengthInput/LengthInput";
import "./RadialSettings.scss";



export default function RadialSettings(props) {
    const gradient = props.gradients[props.index];
    const shape = gradient.radial.shape;
    const size = gradient.radial.size;
    const isSizeNamed = /^(closest|farthest)-(side|corner)$/g.test(size);
    const sizeNamed = isSizeNamed ? size.split("-") : [];
    console.log(sizeNamed);

    console.log("SETTINGS", gradient)



    function updateGradientPropertyTo(key, value) {
        const updatedGradient = { ...gradient };
        updatedGradient.radial[key] = value;

        props.updateGradient(updatedGradient, props.index);
    }



    return (
        <div
            className="RadialSettings"
            onClick={(e) => { e.stopPropagation() }}
        >
            <div className="RadialSettings__header">
                <span>
                    Radient Settings [
                    <span>{gradient.name || "Untitled " + props.index}</span>
                ]</span>

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
                                <button onClick={() => updateGradientPropertyTo("size", "closest-" + sizeNamed[1])}>
                                    closest
                                    <div className={`btn--${sizeNamed[0] === "closest" ? "active" : "inactive"}`}></div>
                                </button>

                                <button onClick={() => updateGradientPropertyTo("size", sizeNamed[0] + "-corner")}>
                                    corner
                                    <div className={`btn--${sizeNamed[1] === "corner" ? "active" : "inactive"}`}></div>
                                </button>
                            </div>

                            <div>
                                <button onClick={() => updateGradientPropertyTo("size", "farthest-" + sizeNamed[1])}>
                                    farthest
                                    <div className={`btn--${sizeNamed[0] === "farthest" ? "active" : "inactive"}`}></div>
                                </button>

                                <button onClick={() => updateGradientPropertyTo("size", sizeNamed[0] + "-side")}>
                                    side
                                    <div className={`btn--${sizeNamed[1] === "side" ? "active" : "inactive"}`}></div>
                                </button>
                            </div>
                        </div>

                        <div className="RadialSettings__size-btns__length">
                            length:
                        
                            <LengthInput />
                        </div>
                    </div>
                </div>

                <div className="RadialSettings__section">
                    <div>Position</div>

                    <div className="RadialSettings__position-btns">
                        <div>
                            <div>
                                <button>top</button>
                            </div>

                            <div>
                                <button>left</button>

                                <button>center</button>

                                <button>right</button>
                            </div>

                            <div>
                                <button>bottom</button>
                            </div>
                        </div>

                        <div>
                            <div>
                                <button>top</button>
                            </div>

                            <div>
                                <button>left</button>

                                <button>center</button>

                                <button>right</button>
                            </div>

                            <div>
                                <button>bottom</button>
                            </div>
                        </div>
                        <div>
                            at:<input type="text" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="RadialSettings__apply-box">
                <button onClick={() => props.openRadialSettings(false, props.index, true)}>Apply</button>

                <button onClick={() => props.openRadialSettings(false, props.index, false)}>Discard</button>
            </div>
        </div >
    );
}