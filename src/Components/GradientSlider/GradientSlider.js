import React, { Component } from 'react';
import GradientSliderButtonBox from "../GradientSliderButtonBox/GradientSliderButtonBox";
import "./GradientSlider.scss";



export default class GradientSlider extends Component {
    render() {
        return (
            <div
                id={`GradientSlider__ruler-${this.props.index}`}
                className="GradientSlider"
            >
                <div
                    className="GradientSlider__slider"
                >
                </div>

                <GradientSliderButtonBox

                />
            </div>
        );
    }
}