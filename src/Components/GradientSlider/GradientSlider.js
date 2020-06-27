import React, { Component } from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import { mousePos } from "../../functions/slider";
import { sortGradientByColorStopsPercentage, filterIdenticalColorPercentages } from "../../functions/slider";
import { correctGradientEdges, setZIndexAscending, getPercentToFixed } from "../../functions/slider";
import { getImmutableGradientCopy } from "../../functions/gradient";
import "./GradientSlider.scss";



export default class GradientSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeRuler: true,
            activeThumb: undefined,
            thumbMoved: false,
            mousePos: undefined,
            addButtonOn: false,
            delButtonOn: false
        }
    }



    handleThumbMouseDown(event) {
        const activeThumb = event.target.id.match(/GradientSlider\d+_\d+$/g) ? event.target : null;

        if (activeThumb) {
            if (this.state.delButtonOn) { return this.deleteColorStop(activeThumb.id); }
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
                const newPercentage = getPercentToFixed(thumbBoxWidth, newThumbX);
                const colorIndex = this.state.activeThumb.id.match(/\d+$/)[0];
                const newGradient = getImmutableGradientCopy(this.props.gradient);
                newGradient.colors[colorIndex].stop = newPercentage;

                this.props.updateGradient(newGradient, this.props.index);
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
        if (this.state.activeThumb) {
            if (!this.state.thumbMoved && !this.state.delButtonOn) {
                const thumbIndex = this.state.activeThumb.id.match(/\d+$/)[0];
                const color = this.props.gradient.colors[thumbIndex].color;

                this.props.openColorPicker(this.props.index, thumbIndex, color);
            }
            else {

                if (!this.props.gradient.repeating) {
                    const gradientCopy = getImmutableGradientCopy(this.props.gradient)
                    const sorted = sortGradientByColorStopsPercentage(gradientCopy);
                    const filtered = filterIdenticalColorPercentages(sorted);
                    const updatedGradient = correctGradientEdges(filtered);

                    this.props.updateGradient(updatedGradient, this.props.index);
                }
            }
            this.setState({
                ...this.state,
                activeThumb: undefined,
                thumbMoved: false,
                mousePos: undefined
            }, () => { setZIndexAscending(this.props.index); });
        }
    }



    handleAddBtnOnClick() {
        if (!this.state.addButtonOn) {
            this.setState({ ...this.state, addButtonOn: !this.state.addButtonOn, activeRuler: false, delButtonOn: false });
        }
    }


    handleDelBtnOnClick() { this.setState({ ...this.state, delButtonOn: !this.state.delButtonOn, addButtonOn: false }); }



    handleShadowOnBlur() { setTimeout(() => { this.setState({ ...this.state, addButtonOn: false, activeRuler: true }) }, 200) }



    handleShadowOnMouseMove(event) {
        const element = document.getElementById(`GradientSlider__shadow-${this.props.index}`);
        const mouseX = mousePos(event, this.props.index);
        const elementWidth = event.target.getBoundingClientRect().width;
        const percent = getPercentToFixed(elementWidth, mouseX);
        const titleDiv = element.children[0];

        titleDiv.innerHTML = percent + "%";
        titleDiv.style.right = elementWidth - mouseX + 10 + "px";
    }



    handleMeasureTextOnClick(event) {
        if (this.state.delButtonOn) { this.deleteColorStop(event.target.id); }
    }



    addNewColorStop(event) {
        const mouseX = mousePos(event, this.props.index);
        const elementWidth = event.target.getBoundingClientRect().width;
        const newGradient = getImmutableGradientCopy(this.props.gradient);

        if (!this.props.gradient.repeating) {
            newGradient.colors.push({ color: "rgb(255, 255, 255)", stop: getPercentToFixed(elementWidth, mouseX) });
            const sorted = sortGradientByColorStopsPercentage(newGradient);
            const filtered = filterIdenticalColorPercentages(sorted);
            this.props.updateGradient(filtered, this.props.index);
        }
        this.setState({ ...this.state, activeRuler: true, addButtonOn: false });
    }



    deleteColorStop(id) {
        let newGradient = getImmutableGradientCopy(this.props.gradient);
        const index = Number(id.match(/\d+$/)[0]);
        newGradient.colors = newGradient.colors.filter((_, i) => i !== index);
        newGradient = correctGradientEdges(newGradient);

        this.props.updateGradient(newGradient, this.props.index);
        this.setState({ ...this.state, delButtonOn: false });
    }



    renderMeasureText() {
        return this.props.gradient.colors.map((colorStop, i) => {
            if (!this.props.gradient.repeating) {
                return <span
                    id={`gradient-mesure${this.state.index}_${i}`}
                    key={`gradient-mesure${this.state.index}_${i}`}
                    style={{
                        left: `calc(${colorStop.stop}% - 20px)`,
                        border: this.state.delButtonOn && "1px dotted deeppink"
                    }}
                    onClick={e => this.handleMeasureTextOnClick(e)}
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
                    border: this.state.delButtonOn ? `1px dotted deeppink` : `1px solid ${strokeColor}`
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



    renderAddColorStopShadow() {
        return <button
            id={`GradientSlider__shadow-${this.props.index}`}
            className="GradientSlider__shadow"
            onBlur={e => this.handleShadowOnBlur(e)}
            onClick={e => this.addNewColorStop(e)}
            onMouseMove={e => this.handleShadowOnMouseMove(e)}
            tabIndex={1}
            autoFocus={true}
        ><div>---</div></button>
    }



    render() {
        return (
            <div className="GradientSlider">
                <div className={`GradientSlider__ruler ${this.state.activeRuler ? "" : "GradientSlider__ruler--inactive"}`}>
                    <div className="GradientSlider__helper-lines">{this.renderHelperLines()}</div>

                    {this.state.addButtonOn && this.renderAddColorStopShadow()}

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
                    <button
                        title="add new color [stop click on slider]"
                        onClick={() => this.handleAddBtnOnClick()}
                    >
                        Add
                            <div className={`btn--${this.state.addButtonOn ? "active" : "inactive"}`}></div>
                    </button>

                    <button
                        title="delete color stop [click on slider thumb]"
                        onClick={() => this.handleDelBtnOnClick()}
                    >
                        Del
                        <div className={`btn--${this.state.delButtonOn ? "active" : "inactive"}`}></div>
                    </button>
                </div>
            </div>
        );
    }
}