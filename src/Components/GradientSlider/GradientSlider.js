import React, { Component } from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import { mousePos } from "../../functions/slider";
import { sortGradientByColorStopsPercentage, filterIdenticalColorPercentages, correctGradientEdges, setZIndexAscending } from "../../functions/slider";
import "./GradientSlider.scss";



export default class GradientSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeThumb: undefined,
            thumbMoved: false,
            mousePos: undefined,
        }
    }



    handleThumbMouseDown(event) {
        const activeThumb = event.target.id.match(/GradientSlider\d+_\d+$/g) ? event.target : null;

        if (activeThumb) {
            const measureText = document.getElementById(`gradient-mesure${this.state.index}_${activeThumb.id.match(/\d+$/)}`);
            activeThumb.style.zIndex = 1000;
            measureText.style.zIndex = 1000;

            this.setState({
                ...this.state,
                activeThumb,
                mousePos: mousePos(event, this.props.index),
            });
        }
    }



    handleThumbOnMouseMove(event) {
        const moveActiveThumb = () => {
            const thumbBox = document.getElementById(`GradientSlider__thumbs-box${this.props.index}`);
            const thumbBoxWidth = Math.round(thumbBox.getBoundingClientRect().width);
            const newThumbX = this.state.mousePos;

            if (!this.props.gradient.repeating) {
                const newPercentage = (newThumbX / thumbBoxWidth * 100);
                if (newPercentage >= 0 && newPercentage <= 100) {
                    const colorIndex = this.state.activeThumb.id.match(/\d+$/)[0];
                    const newGradient = { ...this.props.gradient, colors: [...this.props.gradient.colors] };
                    newGradient.colors[colorIndex].stop = Number(newPercentage.toFixed(newPercentage % 1 !== 0 ? 1 : 0));

                    this.props.updateGradient(newGradient, this.props.index);
                }
            }
        }

        if (this.state.activeThumb) {
            this.setState({
                ...this.state,
                thumbMoved: true,
                mousePos: mousePos(event, this.props.index),
            }, () => moveActiveThumb());
        }
    }


    handleThumbMouseUp() {
        if (!this.state.thumbMoved) {
            const thumbIndex = this.state.activeThumb.id.match(/\d+$/)[0];
            const color = this.props.gradient.colors[thumbIndex].color;

            this.props.openColorPicker(this.props.index, thumbIndex, color);
        }
        else {
            if (this.state.activeThumb) {
                if (!this.props.gradient.repeating) {
                    const sorted = sortGradientByColorStopsPercentage(this.props.gradient);
                    const filtered = filterIdenticalColorPercentages(sorted);
                    const updatedGradient = correctGradientEdges(filtered);

                    this.props.updateGradient(updatedGradient, this.props.index);
                }
            }
        }
        this.setState({
            ...this.state,
            activeThumb: undefined,
            thumbMoved: false,
            mousePos: undefined
        }, () => { setZIndexAscending(this.props.index); });
    }



    renderMeasureText() {
        return this.props.gradient.colors.map((colorStop, i) => {
            if (!this.props.gradient.repeating) {
                return <span
                    id={`gradient-mesure${this.state.index}_${i}`}
                    key={`gradient-mesure${this.state.index}_${i}`}
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
        const strokeColor = "rgba(255, 255, 255, 0.5)";
        const getThumbPosition = colorStopAt => {
            if (!this.props.gradient.repeating) return `${colorStopAt.stop}%`;
        }

        return this.props.gradient.colors.map((colorStop, i) => (
            <div
                id={`GradientSlider${this.props.index}_${i}`}
                key={`colorStopThumb${i}`}
                title={`${colorStop.color}`}
                style={{
                    background: `linear-gradient(${colorStop.color} 0%, ${colorStop.color} 100%), url(${checkeredRect}`,
                    left: `calc(${getThumbPosition(colorStop)} - 7.5px)`,
                    border: `1px solid ${strokeColor}`
                }}
            >
                <svg width="14" height="14">
                    <line x1="0" y1="14px" x2="7px" y2="7px" style={{ stroke: strokeColor, strokeWidth: 1 }} />

                    <line x1="7px" y1="7px" x2="14px" y2="14px" style={{ stroke: strokeColor, strokeWidth: 1 }} />

                    <line x1="0" y1="14px" x2="14px" y2="14px" style={{ stroke: strokeColor, strokeWidth: 1 }} />
                </svg>
            </div>
        ));
    }



    renderHelperLines() {
        return this.props.gradient.colors.map((color, i) => {
            const left = this.props.gradient.repeating ? "" : color.stop + "%";

            return <svg key={`helperLine_${i}`} width="100%" height="100%" style={{ left: left }}>
                <line x1={color.colorStop} y1="0" x2={color.colorStop} y2="100%" strokeDasharray="3" style={{ stroke: "#777", strokeWidth: 2 }} />
            </svg>
        })
    }



    render() {
        return (
            <div className="GradientSlider">
                <div className="GradientSlider__ruler">
                    <div className="GradientSlider__helper-lines">{this.renderHelperLines()}</div>

                    <div
                        id={`GradientSlider__measure-text-box${this.props.index}`}
                        className="GradientSlider__measure-text-box"
                    >
                        {this.renderMeasureText()}
                    </div>

                    <div className="GradientSlider__ruler-box">{this.renderRuler()}</div>

                    <div
                        id={`GradientSlider__thumbs-box${this.props.index}`}
                        className="GradientSlider__thumbs-box"
                        onMouseDown={e => this.handleThumbMouseDown(e)}
                        onMouseUp={() => this.handleThumbMouseUp()}
                        onMouseMove={e => this.handleThumbOnMouseMove(e)}
                    >
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