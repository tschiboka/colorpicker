import React, { Component } from 'react';
import GradientSliderRuler from "../GradientSliderRuler/GradientSliderRuler";
import GradientSliderButtonBox from "../GradientSliderButtonBox/GradientSliderButtonBox";
import ColorStop from "../ColorStop/ColorStop";
import ColorHint from "../ColorHint/ColorHint";
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
            activeColorHintText: undefined,
            mouseAtPercentage: undefined,
            activeColorStop: undefined,
            activeColorHint: undefined,
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

        if (!this.state.buttonStates.deleteOn) {
            const gradientCopy = getImmutableGradientCopy(this.props.gradient);
            if (this.state.activeColorStop !== undefined) {
                gradientCopy.colors[this.state.activeColorStop].stop = this.state.mouseAtPercentage;

                this.props.updateGradient(gradientCopy, this.props.index);
            }
            if (this.state.activeColorHint !== undefined) {
                gradientCopy.colorHints[this.state.activeColorHint] = this.state.mouseAtPercentage;
                gradientCopy.colorHints = [...gradientCopy.colorHints].sort((a, b) => a - b);

                this.props.updateGradient(gradientCopy, this.props.index);
            }
            if (!this.state.colorStopDragged) { this.setState({ ...this.state, colorStopDragged: true }); }
        }
    }



    handleSliderOnMouseUp() {
        if (this.state.activeColorStopText !== undefined) return false;

        if (this.state.buttonStates.deleteOn) {
            if (this.state.activeColorStop !== undefined) { this.deleteColorStop(this.state.activeColorStop); }
            if (this.state.activeColorHint !== undefined) { this.deleteColorHint(this.state.activeColorHint); }

            this.resetStateToInactiveColorStops();
            return false;
        }

        if (this.state.activeColorStop !== undefined) {
            if (this.state.colorStopDragged) { this.upDateSortAndFilterGradients(); }
            else {
                this.props.openColorPicker(this.props.index, this.state.activeColorStop, this.props.gradient.colors[this.state.activeColorStop].color);
            }
        }
        else if (this.state.buttonStates.colorHintOn && this.state.activeColorHint === undefined) {
            this.addNewColorHint();
        }
        else {
            if (!this.state.buttonStates.deleteOn) {
                if (this.state.buttonStates.colorStopOn && this.state.activeColorHint === undefined) { this.addNewColorStop(); }
            }
        }
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
        const gradientCopy = getImmutableGradientCopy(this.props.gradient);
        gradientCopy.colors[index].stop = Number(value);

        const gradientSorted = sortGradientByColorStopsPercentage(gradientCopy);
        const filteredGradient = filterIdenticalColorPercentages(gradientSorted, index);

        this.props.updateGradient(filteredGradient, this.props.index);
        const timer = setTimeout(() => { this.resetStateToInactiveColorStops(); clearTimeout(timer); }, 500);
    }



    deleteColorStop(index) {
        const updatedGradient = getImmutableGradientCopy(this.props.gradient);
        updatedGradient.colors = updatedGradient.colors.filter((_, i) => i !== index);

        this.props.updateGradient(updatedGradient, this.props.index);
    }



    deleteColorHint(index) {
        const updatedGradient = getImmutableGradientCopy(this.props.gradient);
        updatedGradient.colorHints = updatedGradient.colorHints.filter((_, i) => i !== index);

        this.props.updateGradient(updatedGradient, this.props.index);
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



    addNewColorHint() {
        const gradientCopy = getImmutableGradientCopy(this.props.gradient);
        const newStop = this.state.mouseAtPercentage;
        const updatedColorHints = gradientCopy.colorHints;

        updatedColorHints.push(newStop);
        gradientCopy.colorHints = updatedColorHints;
        gradientCopy.colorHints = [...gradientCopy.colorHints].sort((a, b) => a - b);

        this.props.updateGradient(gradientCopy, this.props.index);
    }



    resetStateToInactiveColorStops() {
        this.setState({
            ...this.state,
            colorStopDragged: false,
            activeColorStop: undefined,
            activeColorStopText: undefined,
            activeColorHint: undefined,
            activeColorHintText: undefined,
        });
    }



    setButtonStates(buttonStates) { this.setState({ ...this.state, buttonStates }); }



    setActiveColorStop(activeColorStop) { this.setState({ ...this.state, activeColorStop }); }



    setActiveColorHint(activeColorHint) { this.setState({ ...this.state, activeColorHint }); }



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



    renderColorHints() {
        const hints = [...this.props.gradient.colorHints].sort((a, b) => a - b);

        // get adjecent colors if available and error message if hint is out of range or shadowed by other hints
        const colorHintsWithInfo = [];

        this.props.gradient.colors.forEach((colorStop, colorStopIndex, colorStopsArray) => {
            const currentColorPercentage = colorStop.stop;
            const nextColorPercentage = (colorStopsArray[colorStopIndex + 1] || {}).stop;

            if (nextColorPercentage === undefined) {
                const hintsOutOfRange = hints.filter(hint => hint > currentColorPercentage);
                hintsOutOfRange.forEach(hintOutOfRange => {
                    colorHintsWithInfo.push({ error: "out of range", position: hints[colorHintsWithInfo.length] });
                });
            }
            else {
                const hintsInRange = hints.filter(hint => currentColorPercentage < hint && nextColorPercentage >= hint);
                const highestHint = hintsInRange.length ? Math.max(...hintsInRange) : undefined;

                hintsInRange.forEach(hintInRange => {
                    if (hintInRange === highestHint) {
                        const adjecentColors = [colorStop.color, colorStopsArray[colorStopIndex + 1].color];
                        colorHintsWithInfo.push({ error: "", position: hints[colorHintsWithInfo.length], adjecentColors });
                    }
                    else colorHintsWithInfo.push({ error: "shadowed", position: hints[colorHintsWithInfo.length] });
                });
            }
        });

        return colorHintsWithInfo.map((colorHint, index) => {
            return (
                <ColorHint
                    key={`ColorHint${this.props.index}_${index}`}
                    position={colorHint.position}
                    index={index}
                    units={this.props.gradient.units}
                    deleteOn={this.state.buttonStates.deleteOn}
                    setActiveColorHint={this.setActiveColorHint.bind(this)}
                    errorInfo={colorHint.error}
                    adjecentColors={colorHint.adjecentColors}
                />
            )
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


                    <div className="GradientSlider__colorstops-and-colorhints">
                        {this.renderColorStops()}

                        {this.renderColorHints()}
                    </div>
                </div>

                <GradientSliderButtonBox
                    buttonStates={this.state.buttonStates}
                    setButtonStates={this.setButtonStates.bind(this)}
                />
            </div>
        );
    }
}