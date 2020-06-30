import React, { Component } from 'react';
import GradientSliderRuler from "../GradientSliderRuler/GradientSliderRuler";
import GradientSliderButtonBox from "../GradientSliderButtonBox/GradientSliderButtonBox";
import ColorStop from "../ColorStop/ColorStop";
import "./GradientSlider.scss";



export default class GradientSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonStates: { colorStopOn: true, colorHintOn: false, deleteOn: false }
        }
    }



    setButtonStates(buttonStates) { this.setState({ ...this.state, buttonStates }); }



    renderColorStops() {
        return this.props.gradient.colors.map((colorStop, index) => {
            const positionInPercentage = this.props.gradient.units === "percentage" ? colorStop.stop : undefined;

            return <ColorStop
                key={`ColorStop${this.props.index}_${index}`}
                position={positionInPercentage}
                color={colorStop.color}
                index={index}
                deleteOn={this.state.buttonStates.deleteOn}
            />
        });
    }



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


                    <div className="GradientSlider__colorstops-and-colorhints">{this.renderColorStops()}</div>
                </div>

                <GradientSliderButtonBox
                    buttonStates={this.state.buttonStates}
                    setButtonStates={this.setButtonStates.bind(this)}
                />
            </div>
        );
    }
}