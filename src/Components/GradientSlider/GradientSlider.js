import React, { Component } from 'react';
import GradientSliderRuler from "../GradientSliderRuler/GradientSliderRuler";
import GradientSliderButtonBox from "../GradientSliderButtonBox/GradientSliderButtonBox";
import ColorStop from "../ColorStop/ColorStop";
import { sortGradientByColorStopsPercentage, filterIdenticalColorPercentages } from "../../functions/slider";
import { getPercentToFixed, mousePos } from "../../functions/slider";
import { getImmutableGradientCopy } from "../../functions/gradient";

import "./GradientSlider.scss";



export default class GradientSlider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: `GradientSlider-${this.props.index}`,
            buttonStates: {
                colorStopOn: true,
                colorHintOn: false,
                deleteOn: false
            },
            activeColorStopText: undefined,
            mouseAtPercentage: undefined,
            activeColorStop: undefined,
            colorStopDragged: false,
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

        if (this.state.activeColorStop !== undefined) {
            const gradientCopy = getImmutableGradientCopy(this.props.gradient);
            gradientCopy.colors[this.state.activeColorStop].stop = this.state.mouseAtPercentage;

            this.props.updateGradient(gradientCopy, this.props.index);

            if (!this.state.colorStopDragged) { this.setState({ ...this.state, colorStopDragged: true }); }
        }
    }



    handleSliderOnMouseUp() {
        if (this.state.activeColorStopText !== undefined) return false;

        if (this.state.activeColorStop !== undefined) {
            if (this.state.colorStopDragged) { this.upDateSortAndFilterGradients() }

            else { this.props.openColorPicker(this.props.index, this.state.activeColorStop, this.props.gradient.colors[this.state.activeColorStop].color); }
        }
        else { this.addNewColorStop() }

        this.resetStateToInactiveColorStops();
    }



    handleSliderOnMouseLeave() {
        if (this.state.activeColorStop !== undefined && this.state.colorStopDragged) {
            this.upDateSortAndFilterGradients();

            this.resetStateToInactiveColorStops();
        }
    }



    handleInputOnBlur(event) {
        if (event.target.validity.valid && event.target.value.length) { this.setNewColorStopValue(event.target.value, this.state.activeColorStopText); }
        this.clearInput(event.target);
    }



    handleInputOnKeyDown(event) {
        const key = event.which || event.keyCode || event.key;

        if (key === 27 || key === "Escape" || key === "Esc") {
            this.clearInput(event.target);
            event.target.blur();
        }

        if (key === 13 || key === "Enter") {
            if (event.target.validity.valid && event.target.value.length) {
                this.setNewColorStopValue(event.target.value, this.state.activeColorStopText);
            }
            this.clearInput(event.target);
            event.target.blur();
        }
    }



    clearInput(target) {
        target.value = "";
        target.setCustomValidity("");
    }



    setNewColorStopValue(value, index) {
        console.log(value);
        const gradientCopy = getImmutableGradientCopy(this.props.gradient);
        gradientCopy.colors[index].stop = Number(value);
        const gradientSorted = sortGradientByColorStopsPercentage(gradientCopy);
        const filteredGradient = filterIdenticalColorPercentages(gradientSorted, index);
        console.log(filteredGradient);

        this.props.updateGradient(filteredGradient, this.props.index);
        const timer = setTimeout(() => { this.resetStateToInactiveColorStops(); clearTimeout(timer); }, 500);
    }



    upDateSortAndFilterGradients() {
        const gradientCopy = getImmutableGradientCopy(this.props.gradient);
        gradientCopy.colors[this.state.activeColorStop].stop = this.state.mouseAtPercentage;
        const gradientSorted = sortGradientByColorStopsPercentage(gradientCopy);
        const filteredGradient = filterIdenticalColorPercentages(gradientSorted, this.state.activeColorStop);

        this.props.updateGradient(filteredGradient, this.props.index);
    }



    addNewColorStop() {
        const gradientCopy = getImmutableGradientCopy(this.props.gradient);
        const updatedColorStops = gradientCopy.colors;

        updatedColorStops.push({ color: "rgba(255, 255, 255, 0.5)", stop: this.state.mouseAtPercentage });
        gradientCopy.colors = updatedColorStops;

        const gradientSorted = sortGradientByColorStopsPercentage(gradientCopy);
        const filteredGradient = filterIdenticalColorPercentages(gradientSorted, this.state.activeColorStop);

        this.props.updateGradient(filteredGradient, this.props.index);
    }



    resetStateToInactiveColorStops() {
        this.setState({
            ...this.state,
            colorStopDragged: false,
            activeColorStop: undefined,
            activeColorStopText: undefined,
        });
    }



    setButtonStates(buttonStates) { this.setState({ ...this.state, buttonStates }); }



    setActiveColorStop(activeColorStop) { this.setState({ ...this.state, activeColorStop }) }



    setActiveColorStopText(activeColorStopText) { this.setState({ ...this.state, activeColorStopText }); }



    renderColorStops() {
        return this.props.gradient.colors.map((colorStop, index) => {
            const positionInPercentage = this.props.gradient.units === "percentage" ? colorStop.stop : undefined;

            return <ColorStop
                key={`ColorStop${this.props.index}_${index}`}
                position={positionInPercentage}
                color={colorStop.color}
                index={index}
                deleteOn={this.state.buttonStates.deleteOn}
                textOpen={this.state.activeColorStopText === index}
                units={this.props.gradient.units}
                isActive={this.state.activeColorStop === index}
                setActiveColorStop={this.setActiveColorStop.bind(this)}
                setActiveColorStopText={this.setActiveColorStopText.bind(this)}
                handleInputOnBlur={this.handleInputOnBlur.bind(this)}
                handleInputOnKeyDown={this.handleInputOnKeyDown.bind(this)}
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
                    onMouseUp={() => this.handleSliderOnMouseUp()}
                    onMouseLeave={() => this.handleSliderOnMouseLeave()}
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