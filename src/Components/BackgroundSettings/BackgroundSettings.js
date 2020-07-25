import React, { Component } from 'react';
import { ToggleButton } from "../ToggleButton/ToggleButton";
import LengthInput from '../LengthInput/LengthInput';
import "./BackgroundSettings.scss";
import checkeredBg from "../../images/checkered_rect.png";
import {getImmutableGradientCopy} from "../../functions/gradient";



export default class BackgroundSettings extends Component {
    handlePositionKeywordBtnOnClick(keyword, posIndex) {
        const position = this.props.gradients[this.props.index].background.position[posIndex];
        const {value, unit} = {...position};
        
        this.updatePosition(keyword, value, unit, posIndex);
    }
    
    
    
    handlePositionInputOnChange() {
        const [name, value, unit] = [...arguments];
        const index = name.match(/\d$/g)[0];
        const keyword = this.props.gradients[this.props.index].background.position[index].keyword;

        this.updatePosition(keyword, value, unit, index);
    }



    handlePositionToggleOnClick() {
        this.updatePosition(undefined, undefined, undefined, 0);
        this.updatePosition(undefined, undefined, undefined, 1);

        // clear input fields
        document.querySelector("#LengthInput_7").value = "";
        document.querySelector("#LengthInput_8").value = "";
    }



    updatePosition(keyword, value, unit, index) {
        const newGradient = getImmutableGradientCopy(this.props.gradients[this.props.index]);
        newGradient.background.position[index] = {keyword, value, unit};
        this.props.updateGradient(newGradient, this.props.index);
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

                            <ToggleButton
                            on={
                                background.position[0].keyword !== undefined || background.position[0].value !== undefined ||
                                background.position[1].keyword !== undefined || background.position[1].value !== undefined
                                }
                            handleOnClick={() => this.handlePositionToggleOnClick()}
                            />
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
                                            onClick={() => this.handlePositionKeywordBtnOnClick("left", 1)}
                                        >
                                            <div className={background.position[1].keyword === "left" ? "btn--active" : "btn--inactive"}></div>
                                        left</button>

                                     
                                        <button
                                            onClick={() => this.handlePositionKeywordBtnOnClick("right", 1)}
                                        >
                                            <div className={background.position[1].keyword === "right" ? "btn--active" : "btn--inactive"}></div>
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
                            </div>

                            <div>
                                <div>
                                    x:&nbsp;&nbsp;
                                    <LengthInput 
                                        id="7"
                                        name="bg-position-0"
                                        value={background.position[0].value || ""}
                                        unit={background.position[0].unit || "px"}
                                        units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                        onChange={this.handlePositionInputOnChange.bind(this)}
                                    />
                                </div>

                                <div>
                                    y:&nbsp;&nbsp;
                                    <LengthInput
                                        id="8"
                                        name="bg-position-1"
                                        value={background.position[1].value || ""}
                                        unit={background.position[1].unit || "px"}
                                        units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                        onChange={this.handlePositionInputOnChange.bind(this)}
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
                                <div>
                                    <span>x:&nbsp;&nbsp;</span>
                        
                                    <LengthInput
                                        id="9"
                                        name="bg-size-x"
                                        value={background.size.x.value || ""}
                                        unit={background.size.x.unit || "px"}
                                        units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                    />
                                </div>
                        
                                <div>
                                    <span>y:&nbsp;&nbsp;</span>
                                    
                                    <LengthInput
                                        id="10"
                                        name="bg-size-y"
                                        value={background.size.y.value || ""}
                                        unit={background.size.y.unit || "px"}
                                        units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
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
                            <span>Pattern Background Color</span>

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