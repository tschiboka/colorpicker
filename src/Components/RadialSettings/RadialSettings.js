import React from 'react';
import "./RadialSettings.scss";



export default function RadialSettings(props) {
    const gradient = props.gradients[props.index];
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
                        <button onClick={() => updateGradientPropertyTo("shape", gradient.radial.shape === "ellipse" ? "" : "ellipse")}>
                            Ellipse

                            <div className={`btn--${gradient.radial.shape === "ellipse" ? "active" : "inactive"}`}></div>
                        </button>

                        <button onClick={() => updateGradientPropertyTo("shape", gradient.radial.shape === "circle" ? "" : "circle")}>
                            Circle

                            <div className={`btn--${gradient.radial.shape === "circle" ? "active" : "inactive"}`}></div>
                        </button>
                    </div>
                </div>

                <div className="RadialSettings__section">
                    <div>Size</div>

                    <div className="RadialSettings__size-btns">
                        <div className="RadialSettings__size-btns__named">
                            <div>
                                <button>Closest</button>

                                <button>Corner</button>
                            </div>

                            <div>
                                <button>Farthest</button>

                                <button>Side</button>
                            </div>
                        </div>

                        <div className="RadialSettings__size-btns__length">
                            Length:
                        <input type="text" />
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