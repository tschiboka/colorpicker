import React, { Component } from 'react';
import { ToggleButton } from "../ToggleButton/ToggleButton";
import LengthInput from '../LengthInput/LengthInput';
import { produce } from 'immer';
import "./BackgroundSettings.scss";



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



    handleSizeToggleOnClick() {
        this.updateSize(undefined, undefined, "0");
        this.updateSize(undefined, undefined, "1");

        // clear input fields
        document.querySelector("#LengthInput_9").value = "";
        document.querySelector("#LengthInput_10").value = "";
    }



    handleRepeatToggleOnClick() { this.updateRepeat(undefined); }



    handleSizeInputOnChange() {
        const [name, value, unit] = [...arguments];
        const index = name.match(/\d$/g)[0];

        this.updateSize(value, unit, index)
    }



    handleRepeatBtnOnClick(repeatValue) { this.updateRepeat(repeatValue); }



    updatePosition(keyword, input, unit, index) {
        const value = Number(input) || undefined;
        const updated = produce(this.props.gradients[this.props.index], draft => {
            draft.background.position[index] = {keyword, value, unit};
        });

        this.props.updateGradient(updated, this.props.index);
    }



    updateSize(input, unit, index) {
        const value = Number(input) || undefined;
        const updated = produce(this.props.gradients[this.props.index], draft => {
            draft.background.size[index === "0" ? "x" : "y"] = {value, unit};
        });

        this.props.updateGradient(updated, this.props.index);
    }


    updateRepeat(repeatValue) {
        const updated = produce(this.props.gradients[this.props.index], draft => {
            draft.background.repeat = repeatValue;           
        });
        this.props.updateGradient(updated, this.props.index);
    }



    discardChanges() {
        const clearBackground = {
            position: [
                { keyword: undefined, value: undefined, unit: undefined },
                { keyword: undefined, value: undefined, unit: undefined }
            ],
            size: {
                x: { value: undefined, unit: undefined },
                y: { value: undefined, unit: undefined }
            },
            repeat: undefined,
        };

        const updated = produce(this.props.gradients[this.props.index], draft => {
            draft.background = clearBackground;
        });
        this.props.updateGradient(updated, this.props.index);

        // Close Background Settings
        this.props.openBackgroundSettings(false, this.props.index)
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

                    <button onClick={() => this.discardChanges()}>
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

                            <ToggleButton
                                on={ background.size.x.value !== undefined || background.size.y.value !== undefined }
                                handleOnClick={() => this.handleSizeToggleOnClick()}
                            />
                        </div>

                        <div className="BackgroundSettings__size">
                            <div>
                                <div>
                                    <span>x:&nbsp;&nbsp;</span>
                        
                                    <LengthInput
                                        id="9"
                                        name="bg-size-0"
                                        value={background.size.x.value || ""}
                                        unit={background.size.x.unit || "px"}
                                        units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                        onChange={this.handleSizeInputOnChange.bind(this)}
                                    />
                                </div>
                        
                                <div>
                                    <span>y:&nbsp;&nbsp;</span>
                                    
                                    <LengthInput
                                        id="10"
                                        name="bg-size-1"
                                        value={background.size.y.value || ""}
                                        unit={background.size.y.unit || "px"}
                                        units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                                        onChange={this.handleSizeInputOnChange.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
 
                    <div className="BackgroundSettings__section">
                        <div>
                            <span>Repeat</span>

                            <ToggleButton
                                on={ background.repeat}
                                handleOnClick={() => this.handleRepeatToggleOnClick()}
                            />
                        </div>
                            
                        <div className="BackgroundSettings__repeat">
                            <button onClick={() => this.handleRepeatBtnOnClick("repeat")} >repeat
                                <div className={background.repeat === "repeat" ? "btn--active" : "btn--inactive"}></div>
                            </button>

                            <button onClick={() => this.handleRepeatBtnOnClick("no-repeat")} >no-repeat
                                <div className={background.repeat === "no-repeat" ? "btn--active" : "btn--inactive"}></div>
                            </button>

                            <button onClick={() => this.handleRepeatBtnOnClick("repeat-x")} >repeat-x
                                <div className={background.repeat === "repeat-x" ? "btn--active" : "btn--inactive"}></div>
                            </button>

                            <button onClick={() => this.handleRepeatBtnOnClick("repeat-y")} >repeat-y
                                <div className={background.repeat === "repeat-y" ? "btn--active" : "btn--inactive"}></div>
                            </button>

                            <button onClick={() => this.handleRepeatBtnOnClick("space")} >space
                                <div className={background.repeat === "space" ? "btn--active" : "btn--inactive"}></div>
                            </button>

                            <button onClick={() => this.handleRepeatBtnOnClick("round")} >round
                                <div className={background.repeat === "round" ? "btn--active" : "btn--inactive"}></div>
                            </button>
                        </div>
                    </div>

                    <div className="BackgroundSettings__section">
                        <button onClick={() => this.props.openBackgroundSettings(false, this.props.index)}>Apply</button>

                        <button onClick={() => this.discardChanges()}>Discard</button>
                    </div>
                </div>
            </div>
        );
    }
}