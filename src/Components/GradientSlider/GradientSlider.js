import React, { Component } from 'react';
import "./GradientSlider.scss";



export default class GradientSlider extends Component {
    renderRuler() {
        return (
            <svg width="100%" height="100%">
                {new Array(9).fill("").map((_, i) =>
                    <line x1={`${i * 10 + 10}%`} y1="30%" x2={`${i * 10 + 10}%`} y2="70%" style={{ stroke: "rgba(255, 255, 255, 0.5)", strokeWidth: 1 }} key={`helperStripes_${i}`} />)}

                <line x1="0" y1="0" x2="0" y2="100%" style={{ stroke: "rgba(255, 255, 255, 0.5)", strokeWidth: 2 }} />

                <line x1="100%" y1="0" x2="100%" y2="100%" style={{ stroke: "rgba(255, 255, 255, 0.5)", strokeWidth: 2 }} />

                <line x1="0" y1="50%" x2="100%" y2="50%" style={{ stroke: "rgba(255, 255, 255, 0.5)", strokeWidth: 1 }} />
            </svg>
        );
    }



    render() {
        return (
            <div className="GradientSlider">
                <div className="GradientSlider__text-box"></div>

                <div className="GradientSlider__line-box">{this.renderRuler()}</div>

                <div className="GradientSlider__thumbs-box"></div>
            </div>
        );
    }
}