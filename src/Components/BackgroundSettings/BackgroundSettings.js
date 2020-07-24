import React, { Component } from 'react';
import { ToggleButton } from "../ToggleButton/ToggleButton";
import LengthInput from '../LengthInput/LengthInput';
import "./BackgroundSettings.scss";
import checkeredBg from "../../images/checkered_rect.png";
import {getImmutableGradientCopy} from "../../functions/gradient";



export default class BackgroundSettings extends Component {
    handlePositionKeywordBtnOnClick(keyword, posIndex) {
        const newGradient = getImmutableGradientCopy(this.props.gradients[this.props.index]);
        newGradient.background.position[posIndex].keyword = keyword;
        newGradient.background.position[posIndex].value = undefined;
        newGradient.background.position[posIndex].unit = undefined;
        this.props.updateGradient(newGradient, this.props.index);
        console.log(this.props.gradient);
    }



    render() {
        const gradient = this.props.gradients[this.props.index];
        const background = gradient.background;

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
                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("top", 0)}
                                        >
                                            <div className={background.position[0].keyword === "top" ? "btn--active" : "btn--inactive"}></div>
                                        top</button>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("left", 0)}
                                        >
                                            <div className={background.position[0].keyword === "left" ? "btn--active" : "btn--inactive"}></div>
                                        left</button>

                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("center", 0)}
                                        >
                                            <div className={background.position[0].keyword === "center" ? "btn--active" : "btn--inactive"}></div>
                                        center</button>

                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("right", 0)}
                                        >
                                            <div className={background.position[0].keyword === "right" ? "btn--active" : "btn--inactive"}></div>
                                        right</button>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("bottom", 0)}
                                        >
                                            <div className={background.position[0].keyword === "bottom" ? "btn--active" : "btn--inactive"}></div>
                                        bottom</button>
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("top", 1)}
                                        >
                                            <div className={background.position[1].keyword === "top" ? "btn--active" : "btn--inactive"}></div>
                                        top</button>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("left", 1)}
                                        >
                                            <div className={background.position[1].keyword === "left" ? "btn--active" : "btn--inactive"}></div>
                                        left</button>

                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("center", 1)}
                                        >
                                            <div className={background.position[1].keyword === "center" ? "btn--active" : "btn--inactive"}></div>
                                        center</button>

                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("right", 1)}
                                        >
                                            <div className={background.position[1].keyword === "right" ? "btn--active" : "btn--inactive"}></div>
                                        right</button>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("bottom", 1)}
                                        >
                                            <div className={background.position[1].keyword === "bottom" ? "btn--active" : "btn--inactive"}></div>
                                        bottom</button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div>
                                    x:
                                    <LengthInput 
                                        id="7"
                                        name="bg-position1"
                                        value={background.position[0].value || ""}
                                        unit={background.position[0].unit || "px"}
                                        units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                        //onChange={handleSizeInputOnChange}
                                    />
                                </div>

                                <div>
                                    y:
                                    <LengthInput
                                        id="8"
                                        name="bg-position2"
                                        value={background.position[1].value || ""}
                                        unit={background.position[1].unit || "px"}
                                        units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                        //onChange={handleSizeInputOnChange}
                                    />
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
                            <div>
                                <button>cover</button>

                                <button>contain</button>
                            </div>

                            <div>
                                <div>
                                    <span>x: </span>
                        
                                    <LengthInput
                                        id="9"
                                        name="bg-size-x"
                                        value={background.size.x.value || ""}
                                        unit={background.size.x.unit || "px"}
                                        units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                        //onChange={handleSizeInputOnChange}
                                    />
                                </div>
                        
                                <div>
                                    <span>y: </span>
                                    
                                    <LengthInput
                                        id="10"
                                        name="bg-size-y"
                                        value={background.size.y.value || ""}
                                        unit={background.size.y.unit || "px"}
                                        units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                        //onChange={handleSizeInputOnChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
 
                    <div className="BackgroundSettings__section">
                        <div>
                            <span>Repeat</span>

                                <ToggleButton />
                            </div>
                            
                            <div className="BackgroundSettings__repeat">
                                <button>repeat</button>

                                <button>no-repeat</button>

                                <button>repeat-x</button>

                                <button>repeat-y</button>
                                
                                <button>space</button>
                                
                                <button>round</button>
                            </div>
                    </div>

                    <div className="BackgroundSettings__section">
                        <div>
                            <span>Color</span>

                            <ToggleButton />
                        </div>

                        <div className="BackgroundSettings__color">
                            <div style={{backgroundImage: `url(${checkeredBg})`}}>

                            </div>
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