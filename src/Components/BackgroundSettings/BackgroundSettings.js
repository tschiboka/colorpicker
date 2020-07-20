import React, { Component } from 'react';
import { ToggleButton } from "../ToggleButton/ToggleButton";
import LengthInput from '../LengthInput/LengthInput';
import "./BackgroundSettings.scss";



export default class BackgroundSettings extends Component {
    render() {
        const gradient = this.props.gradients[this.props.index];

        return (
            <div
                className="BackgroundSettings"
                onClick={(e) => { e.stopPropagation() }}
            >
                <div className="BackgroundSettings__header">
                    <span>
                        Background Settings of [
                        
                        <span>{gradient.name}</span>
                        
                        ] gradient
                    </span>

                    <button onClick={() => this.props.openBackgroundSettings(false, this.props.index)}>
                        &times;
                    </button>
                </div>

                <div className="BackgroundSettings__body">
                    <div className="BackgroundSettings__section">
                        <div>
                            <span>Position</span>

                            <ToggleButton />
                        </div>

                        <div className="BackgroundSettings__position">
                            <div>
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

                            <div>
                                <div>
                                    x:
                                    <LengthInput />
                                </div>

                                <div>
                                    y:
                                    <LengthInput />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="BackgroundSettings__section">
                        <div>
                            <span>Size</span>

                            <ToggleButton />
                        </div>

                        <div className="BackgroundSettings__size">
                            <button>cover</button>

                            <button>contain</button>

                            <div>
                                <span>x: </span>

                                <LengthInput />
                            </div>

                            <div>
                                <span>y: </span>
                                
                                <LengthInput />
                            </div>
                        </div>
                    </div>
 
                    <div className="BackgroundSettings__section">
                        <div>
                            <span>Repeat</span>

                            <ToggleButton />
                        </div>
                    </div>

                    <div className="BackgroundSettings__section">
                        <div>
                            <span>Color</span>

                            <ToggleButton />
                        </div>
                    </div>

                    <div className="BackgroundSettings__section">
                        <button>Apply</button>

                        <button>Discard</button>
                    </div>
                </div>
            </div>
        );
    }
}