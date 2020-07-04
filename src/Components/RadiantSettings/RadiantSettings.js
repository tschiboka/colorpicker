import React from 'react';
import "./RadiantSettings.scss";



export default function RadiantSettings(props) {
    const gradient = props.gradients[props.index];



    function updateGradientPropertyTo(key, value) {
        const updatedGradient = { ...gradient };
        updatedGradient.radial[key] = value;

        props.updateGradient(updatedGradient, props.index);
    }



    return (
        <div
            className="RadiantSettings"
            onClick={(e) => { e.stopPropagation() }}
        >
            <div className="RadiantSettings__header">
                <span>
                    Radient Settings [
                    <span>{gradient.name || "Untitled " + props.index}</span>
                ]</span>

                <button onClick={() => props.openRadiantSettings(false)}                >
                    &times;
                </button>
            </div>

            <div className="RadiantSettings__body">
                <div className="RadiantSettings__section">
                    <div>Shape</div>

                    <div className="RadiantSettings__shape-btns">
                        <button onClick={() => updateGradientPropertyTo("shape", "ellipse")}>
                            Ellipse

                            <div className={`btn--${gradient.radial.shape === "ellipse" ? "active" : "inactive"}`}></div>
                        </button>

                        <button>
                            Circle

                            <div className={`btn--${gradient.radial.shape === "circle" ? "active" : "inactive"}`}></div>
                        </button>
                    </div>
                </div>

                <div className="RadiantSettings__section">
                    <div>Size</div>

                    <div className="RadiantSettings__size-btns">
                        <div className="RadiantSettings__size-btns__named">
                            <div>
                                <button>Closest</button>

                                <button>Corner</button>
                            </div>

                            <div>
                                <button>Farthest</button>

                                <button>Side</button>
                            </div>
                        </div>

                        <div className="RadiantSettings__size-btns__length">
                            Length:
                        <input type="text" />
                        </div>
                    </div>
                </div>

                <div className="RadiantSettings__section">
                    <div>Position</div>

                    <div className="RadiantSettings__position-btns">
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

            <div className="RadiantSettings__apply-box">
                <button>Apply</button>

                <button>Discard</button>
            </div>
        </div>
    );
}