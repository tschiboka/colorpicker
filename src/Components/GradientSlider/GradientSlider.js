import React, { Component } from 'react';
import "./GradientSlider.scss";



export default class GradientSlider extends Component {
    render() {
        return (
            <div className="GradientSlider">
                <div className="GradientSlider__text-box"></div>
                <div className="GradientSlider__line-box"></div>
                <div className="GradientSlider__thumbs-box"></div>
            </div>
        );
    }
}