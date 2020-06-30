import React, { Component } from 'react';
import GradientSliderRuler from "../GradientSliderRuler/GradientSliderRuler";
import GradientSliderButtonBox from "../GradientSliderButtonBox/GradientSliderButtonBox";
import "./GradientSlider.scss";



export default class GradientSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonStates: { colorStopOn: true, colorHintOn: false, deleteOn: false }
        }
    }



    setButtonStates(buttonStates) { this.setState({ ...this.state, buttonStates }); }



    render() {
        return (
            <div
                id={`GradientSlider__ruler-${this.props.index}`}
                className="GradientSlider"
            >
                <div
                    className="GradientSlider__slider"
                >
                    <GradientSliderRuler units={this.props.gradient.units} />
                </div>

                <GradientSliderButtonBox
                    buttonStates={this.state.buttonStates}
                    setButtonStates={this.setButtonStates.bind(this)}
                />
            </div>
        );
    }
}