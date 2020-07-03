import React, { Component } from 'react';
import AngleMeter from "../AngleMeter/AngleMeter";
import { getImmutableGradientCopy } from "../../functions/gradient";
import "./GradientButtons.scss";



export default class GradientButtons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            repeatGradInputVisible: this.props.gradient.repeating,
            radientSpecififcationOn: false,
        }
    }



    handleAngleInputKeyDown(event) {
        const key = event.which || event.keyCode || event.key;
        const value = event.target.value;
        const target = event.target;

        if (key === 27 || key === "Escape" || key === "Esc") { 
            event.target.value = "";
            event.target.blur();    
        }

        if (key === 13 || key === "Enter") this.setGradientAngle(value, target);
    }



    setGradientAngle(angle, resetInput) {
        const newAngle = parseInt(angle);
        const valid = !resetInput ? true : resetInput.validity.valid;

        if (newAngle >= 0 && newAngle < 360 && valid) {
            const updatedGradient = getImmutableGradientCopy(this.props.gradient);
            updatedGradient.angle = newAngle;

            this.props.updateGradient(updatedGradient, this.props.index);
        }

        if (resetInput) {
            resetInput.value = "";
            resetInput.blur();
        }
    }



    isActiveBtn(angle) {
        const gradientAngle = Number(this.props.gradient.angle);
        const isActive = gradientAngle === angle;
        const activeStr = isActive ? "active" : "inactive";

        return `btn--${activeStr}`;
    }



    render() {
        return (
            <div className="GradientButtons">    
                <div>
                    <button title="90 degree" onClick={() => this.setGradientAngle(90)}>
                        &rarr;
                        
                        <div className={this.isActiveBtn(90)}></div>
                    </button>

                    <button title="270 degree" onClick={() => this.setGradientAngle(270)}>
                        &larr;

                        <div className={this.isActiveBtn(270)}></div>
                    </button>
                </div>

                <div>
                    <button title="0 degree" onClick={() => this.setGradientAngle(0)}>
                        &uarr;

                    <div className={this.isActiveBtn(0)}></div>    
                    </button>

                    <button title="180 degree" onClick={() => this.setGradientAngle(180)}>
                        &darr;

                        <div className={this.isActiveBtn(180)}></div>
                    </button>
                </div>

                <div>
                    <button title="315 degree" onClick={() => this.setGradientAngle(315)}>
                        &#x2196;
                        
                        <div className={this.isActiveBtn(315)}></div>
                    </button>

                    <button title="45 degree" onClick={() => this.setGradientAngle(45)}>
                        &#x2197;
                        
                        <div className={this.isActiveBtn(45)}></div>
                    </button>

                    <button title="225 degree" onClick={() => this.setGradientAngle(225)}>
                        &#x2199;
                        
                        <div className={this.isActiveBtn(225)}></div>
                    </button>

                    <button title="135 degree" onClick={() => this.setGradientAngle(135)}>
                        &#x2198;
                        
                        <div className={this.isActiveBtn(135)}></div>
                    </button>
                </div>

                <div>
                    <button title="repeating gradient">&#x25A5;</button>

                    {this.state.repeatGradInputVisible && (
                        <input
                            type="text"
                        />
                    )}
                </div>

                <div>
                    <button
                        title="diagonal gradient"
                        onClick={() => this.setState({...this.state, radientSpecififcationOn: true})}
                    >&#9678;
                    
                    <div className={`btn--${this.props.gradient.angle === "radial" ? "active": "inactive"}`}></div>
                    </button>
                </div>

                <div>
                    <AngleMeter
                        gradient={this.props.gradient}
                        index={this.props.index}
                        updateGradient={this.props.updateGradient}
                        setAngleMeterIsActive={this.props.setAngleMeterIsActive}
                     />
                    
                    <input
                        type="text" 
                        placeholder={this.props.gradient.angle + '\u00B0'}
                        pattern="\d{1,2}|[1-2]\d\d|3[0-5]\d"
                        onBlur={e => this.setGradientAngle(e.target.value, e.target)}
                        onKeyDown={e => this.handleAngleInputKeyDown(e)}
                    />
                </div>


                {this.state.radientSpecififcationOn && (
                    <div className="GradientButtons__radiant-spec">
                        <div>
                            <button>&#x25cb;</button>

                            <button>&#11053;</button>
                        </div>
                        
                        <div>
                            <div>
                                <button>closest</button>

                                <button>farthest</button>
                            </div>

                            <div>
                                <button>side</button>

                                <button>corner</button>
                            </div>
                        </div>

                        <div>
                            r:
                            
                            <input type="text"/>
                        </div>


                    </div>)}
            </div>
        );
    }
}