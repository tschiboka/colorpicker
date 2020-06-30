import React, { Component } from 'react';
import GradientSliderRuler from "../GradientSliderRuler/GradientSliderRuler";
import GradientSliderButtonBox from "../GradientSliderButtonBox/GradientSliderButtonBox";
import ColorStop from "../ColorStop/ColorStop";
import { sortGradientByColorStopsPercentage, filterIdenticalColorPercentages } from "../../functions/slider";
import { setZIndexAscending, getPercentToFixed, mousePos } from "../../functions/slider";
import { getImmutableGradientCopy } from "../../functions/gradient";

import "./GradientSlider.scss";



export default class GradientSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: `GradientSlider-${this.props.index}`,
            buttonStates: { colorStopOn: true, colorHintOn: false, deleteOn: false },
            colorStopTextOpenIndex: undefined,
            mouseAtPercentage: undefined,
        }
    }



    handleSliderOnMouseMove(event) {
        const sliderDiv = document.getElementById(this.state.id).children[0];
        const width = Math.round(sliderDiv.getBoundingClientRect().width);
        const mouseX = mousePos(event, "#" + this.state.id);

        let mouseAtPercentage;
        if (mouseX <= 20) mouseAtPercentage = 0;
        else if (mouseX >= width - 20) mouseAtPercentage = 100;
        else mouseAtPercentage = getPercentToFixed(width - 40, mouseX - 20);

        this.setState({ ...this.state, mouseAtPercentage });
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
                textOpen={this.state.colorStopTextOpenIndex === index}
                units={this.props.gradient.units}
            />
        });
    }


    render() {
        return (
            <div
                id={this.state.id}
                className="GradientSlider"
            >
                <div
                    className="GradientSlider__slider"
                    onMouseMove={e => this.handleSliderOnMouseMove(e)}
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