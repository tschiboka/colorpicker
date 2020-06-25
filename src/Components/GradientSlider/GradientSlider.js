import React, { Component } from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import "./GradientSlider.scss";



export default class GradientSlider extends Component {
    renderMeasureText() {
        return this.props.gradient.colors.map((colorStop, i) => {
            if (!this.props.gradient.repeating) {
                return <span
                    key={`gradient-mesure${i}`}
                    style={{ left: `calc(${colorStop.stop}% - 20px)` }}
                >{colorStop.stop}%</span>
            }

            return {}
        });
    }



    renderRuler() {
        const bodyWith = document.querySelector("body").getBoundingClientRect().width;
        const gradientListWidth = bodyWith > 1000 ? bodyWith / 2 : bodyWith;

        return (
            <svg width="100%" height="100%">
                {
                    new Array(100).fill("").map((_, i) => {
                        const isTens = !(i % 10);
                        const widthSmallAndNotTens = gradientListWidth < 700 && !isTens;
                        const strokeColor = widthSmallAndNotTens ? "transparent" : !isTens ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.5)";
                        const y = i % 10 ? 40 : 30;

                        return <line x1={`${i}%`} y1={`${y}%`} x2={`${i}%`} y2={`${100 - y}%`} style={{ stroke: strokeColor, strokeWidth: 1 }} key={`helperStripes_${i}`} />
                    })
                }

                <line x1="0" y1="0" x2="0" y2="100%" style={{ stroke: "rgba(255, 255, 255, 0.5)", strokeWidth: 2 }} />

                <line x1="100%" y1="0" x2="100%" y2="100%" style={{ stroke: "rgba(255, 255, 255, 0.5)", strokeWidth: 2 }} />

                <line x1="0" y1="50%" x2="100%" y2="50%" style={{ stroke: "rgba(255, 255, 255, 0.5)", strokeWidth: 1 }} />

                <line x1="50%" y1="20%" x2="50%" y2="80%" style={{ stroke: "rgba(255, 255, 255, 0.5)", strokeWidth: 1 }} />
            </svg>
        );
    }



    renderThumbs() {
        const getThumbPosition = colorStopAt => {
            if (!this.props.gradient.repeating) return `${colorStopAt.stop}%`;
        }

        return this.props.gradient.colors.map((colorStop, i) => (
            <div
                key={`colorStopThumb${i}`}
                title={`${colorStop.color}`}
                style={{
                    background: `linear-gradient(${colorStop.color} 0%, ${colorStop.color} 100%), url(${checkeredRect}`,
                    left: `calc(${getThumbPosition(colorStop)} - 7.5px)`
                }}
            >
                <svg width="14" height="14">
                    <line x1="0" y1="14px" x2="7px" y2="7px" style={{ stroke: "#ddd", strokeWidth: 1 }} />

                    <line x1="7px" y1="7px" x2="14px" y2="14px" style={{ stroke: "#ddd", strokeWidth: 1 }} />

                    <line x1="0" y1="14px" x2="14px" y2="14px" style={{ stroke: "#ddd", strokeWidth: 1 }} />
                </svg>
            </div>
        ));
    }



    render() {
        return (
            <div className="GradientSlider">
                <div className="GradientSlider__ruler">
                    <div className="GradientSlider__measure-text-box">{this.renderMeasureText()}</div>

                    <div className="GradientSlider__ruler-box">{this.renderRuler()}</div>

                    <div className="GradientSlider__thumbs-box">
                        {this.renderThumbs()}
                    </div>
                </div>

                <div className="GradientSlider__btn-box">
                    <button>Add</button>

                    <button>Del</button>
                </div>
            </div>
        );
    }
}