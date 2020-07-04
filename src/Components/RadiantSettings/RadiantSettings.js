import React from 'react';
import "./RadiantSettings.scss";



export default function RadiantSettings(props) {
    return (
        <div
            className="RadiantSettings"
            onClick={(e) => { e.stopPropagation() }}
        >
            <div className="RadiantSettings__header">
                Radient Settings

                <button>&times;</button>
            </div>

            <div className="RadiantSettings__body">
                <div className="RadiantSettings__section">
                    <div>Shape</div>

                    <div className="RadiantSettings__shape-btns">
                        <button>Ellipse</button>

                        <button>Circle</button>
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
                            Length
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

                                <button>bottom</button>

                                <button>right</button>
                            </div>

                            <div>
                                <button>center</button>
                            </div>
                        </div>

                        <div>
                            <div>
                                <button>top</button>
                            </div>

                            <div>
                                <button>left</button>

                                <button>bottom</button>

                                <button>right</button>
                            </div>

                            <div>
                                <button>center</button>
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