import React, { Component } from 'react';
import AngleMeter from "../AngleMeter/AngleMeter";
import { getImmutableGradientCopy } from "../../functions/gradient";
import "./GradientButtons.scss";



export default class GradientButtons extends Component {
    constructor(props) {
        super(props);

        this.state = {
            repeatGradInputVisible: this.props.gradient.repeating
        }
    }



    setGradientAngle(angle) {
        const updatedGradient = getImmutableGradientCopy(this.props.gradient);
        updatedGradient.angle = angle;

        this.props.updateGradient(updatedGradient, this.props.index);
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
                    <button title="diagonal gradient">&#9678;</button>
                </div>

                <div>
                    <AngleMeter
                        gradient={this.props.gradient}
                        index={this.props.index}
                        updateGradient={this.props.updateGradient}
                        setAngleMeterIsActive={this.props.setAngleMeterIsActive}
                     />
                    
                    <input type="text" placeholder={this.props.gradient.angle + '\u00B0'}/>
                </div>
            </div>
        );
    }
}