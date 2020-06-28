import React, { Component } from 'react';
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



    render() {
        return (
            <div className="GradientButtons">
                <div>
                    <button title="90 degree" onClick={() => this.setGradientAngle(90)}>&rarr;</button>

                    <button title="270 degree" onClick={() => this.setGradientAngle(270)}>&larr;</button>
                </div>

                <div>
                    <button title="0 degree" onClick={() => this.setGradientAngle(0)}>&uarr;</button>

                    <button title="180 degree" onClick={() => this.setGradientAngle(180)}>&darr;</button>
                </div>

                <div>
                    <button title="315 degree" onClick={() => this.setGradientAngle(315)}>&#x2196;</button>

                    <button title="45 degree" onClick={() => this.setGradientAngle(45)}>&#x2197;</button>

                    <button title="225 degree" onClick={() => this.setGradientAngle(225)}>&#x2199;</button>

                    <button title="135 degree" onClick={() => this.setGradientAngle(135)}>&#x2198;</button>
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
                    <button>degree</button>
                </div>
            </div>
        );
    }
}