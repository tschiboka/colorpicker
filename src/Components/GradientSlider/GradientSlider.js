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
            mouseAtPercentage: undefined,
            activeColorHint: undefined,
            activeColorHintText: undefined,
            activeColorStop: undefined,
            activeColorStopText: undefined,
            colorStopDragged: false,
        }
    }



    handleSliderOnMouseMove(event) {
        // Do nothing when delete button is on
        if (this.state.buttonStates.deleteOn) return false;

        const colorStopPressed = this.state.activeColorStop !== undefined;
        const colorHintPressed = this.state.activeColorHint !== undefined;
        const thumbDragged = this.state.colorStopDragged;
        const gradientCopy = (colorStopPressed || colorHintPressed) ? getImmutableGradientCopy(this.props.gradient) : undefined;

        // Set dragged state if mouse pressed on color stop or color hint
        if (!thumbDragged && (colorStopPressed || colorHintPressed)) this.setState({ ...this.state, colorStopDragged: true });

        // Drag colors stop
        if (colorStopPressed) {
            gradientCopy.colors[this.state.activeColorStop].stop = this.getMousePosXInPercentage({ ...event });
            this.props.updateGradient(gradientCopy, this.props.index);
        }

        // Drag color hint
        if (colorHintPressed) {
            gradientCopy.colorHints[this.state.activeColorHint] = this.getMousePosXInPercentage({ ...event });
            gradientCopy.colorHints = [...gradientCopy.colorHints].sort((a, b) => a - b);
            this.props.updateGradient(gradientCopy, this.props.index);
        }
    }



    handleSliderOnMouseUp(event) {
        if (this.props.preventMouseUp) return false;
        // Do nothing if any text input is active on slider
        const textActive = this.state.activeColorStopText !== undefined || this.state.activeColorHintText !== undefined;
        if (textActive) return false;

        const deleteOn = this.state.buttonStates.deleteOn;
        const colorHintOn = this.state.buttonStates.colorHintOn;
        const colorStopOn = this.state.buttonStates.colorStopOn;
        const colorStopPressed = this.state.activeColorStop !== undefined;
        const colorHintPressed = this.state.activeColorHint !== undefined;
        const thumbDragged = this.state.colorStopDragged;

        // Delete color stop / color hint
        if (deleteOn) {
            if (colorStopPressed) this.deleteColorStop(this.state.activeColorStop);
            if (colorHintPressed) this.deleteColorHint(this.state.activeColorHint);
            this.resetStateTo();
            return false;
        }

        // Color stop thumb can open color picker or leave thumb where it has been dragged 
        else if (colorStopPressed) {
            if (thumbDragged) this.sortAndFilterGradients();
            else this.props.openColorPicker(this.props.index, this.state.activeColorStop, this.props.gradient.colors[this.state.activeColorStop].color);
        }
        else {
            // No items were dragged add color stop or color hint accordingly
            if (!thumbDragged) {
                if (colorHintOn && !colorHintPressed) this.addNewColorHint({ ...event });
                if (colorStopOn && !colorStopPressed) this.addNewColorStop({ ...event });
            }
        }

        this.resetStateTo();
    }



    handleInputOnBlur(event) {
        if (event.target.validity.valid && event.target.value.length) {
            if (this.state.activeColorStopText !== undefined) { this.setNewColorStopValue(event.target.value, this.state.activeColorStopText); }
            if (this.state.activeColorHintText !== undefined) { this.setNewColorHintValue(event.target.value, this.state.activeColorHintText); }
        }

        this.clearInput(event.target);
        const timer = setTimeout(() => { this.resetStateTo(); clearTimeout(timer); }, 500);
    }



    handleInputOnKeyDown(event) {
        const key = event.which || event.keyCode || event.key;

        if (key === 27 || key === "Escape" || key === "Esc") {
            this.clearInput(event.target);
            event.target.blur();
        }

        if (key === 13 || key === "Enter") {
            if (event.target.validity.valid && event.target.value.length) {
                if (this.state.activeColorStopText !== undefined) { this.setNewColorStopValue(event.target.value, this.state.activeColorStopText); }
                if (this.state.activeColorHintText !== undefined) { this.setNewColorHintValue(event.target.value, this.state.activeColorHintText); }
            }
            this.clearInput(event.target);
            event.target.blur();
        }
    }



    getMousePosXInPercentage(event) {
        const sliderDiv = document.getElementById(this.state.id).children[0];
        const width = Math.round(sliderDiv.getBoundingClientRect().width);
        const mouseX = mousePos({ ...event }, "#" + this.state.id);

        let mouseAtPercentage;
        if (mouseX <= 20) mouseAtPercentage = 0;
        else if (mouseX >= width - 20) mouseAtPercentage = 100;
        else mouseAtPercentage = getPercentToFixed(width - 40, mouseX - 20);

        return mouseAtPercentage;
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
        const timer = setTimeout(() => { this.resetStateTo(); clearTimeout(timer); }, 500);
    }



    setNewColorHintValue(value, index) {
        const gradientCopy = getImmutableGradientCopy(this.props.gradient);
        gradientCopy.colorHints[index] = Number(value);

        const updatedColorHints = [...gradientCopy.colorHints].sort((a, b) => a - b);
        gradientCopy.colorHints = updatedColorHints;

        this.props.updateGradient(gradientCopy, this.props.index);
        const timer = setTimeout(() => { this.resetStateTo(); clearTimeout(timer); }, 500);
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



    sortAndFilterGradients() {
        const gradientCopy = getImmutableGradientCopy(this.props.gradient);
        const gradientSorted = sortGradientByColorStopsPercentage(gradientCopy);
        const filteredGradient = filterIdenticalColorPercentages(gradientSorted, this.state.activeColorStop);

        this.props.updateGradient(filteredGradient, this.props.index);
    }



    addNewColorStop(event) {
        const gradientCopy = getImmutableGradientCopy(this.props.gradient);
        const updatedColorStops = gradientCopy.colors;

        updatedColorStops.push({ color: "rgba(255, 255, 255, 0.5)", stop: this.getMousePosXInPercentage({ ...event }) });
        gradientCopy.colors = updatedColorStops;

        const gradientSorted = sortGradientByColorStopsPercentage(gradientCopy);
        const filteredGradient = filterIdenticalColorPercentages(gradientSorted, this.state.activeColorStop);

        this.props.updateGradient(filteredGradient, this.props.index);
    }



    addNewColorHint(event) {
        const gradientCopy = getImmutableGradientCopy(this.props.gradient);
        const newStop = this.getMousePosXInPercentage({ ...event });
        const updatedColorHints = gradientCopy.colorHints;

        updatedColorHints.push(newStop);
        gradientCopy.colorHints = updatedColorHints;
        gradientCopy.colorHints = [...gradientCopy.colorHints].sort((a, b) => a - b);

        this.props.updateGradient(gradientCopy, this.props.index);
    }



    resetStateTo(newObject = {}) {
        const newState = { ...this.state };

        newState.colorStopDragged = newObject.colorStopDragged || false;
        newState.activeColorStop = newObject.activeColorStop;
        newState.activeColorStopText = newObject.activeColorStopText;
        newState.activeColorHint = newObject.activeColorHint;
        newState.activeColorHintText = newObject.activeColorHintText;
        newState.mouseAtPercentage = newObject.mouseAtPercentage;

        this.setState({ ...newState });
    }



    setButtonStates(buttonStates) { this.setState({ ...this.state, buttonStates }); }



    setActiveColorStop(activeColorStop, event) {
        this.resetStateTo({
            activeColorStop,
            mouseAtPercentage: this.getMousePosXInPercentage({ ...event })
        });
    }



    setActiveColorHint(activeColorHint, event) {
        this.resetStateTo({
            activeColorHint,
            mouseAtPercentage: this.getMousePosXInPercentage({ ...event })
        });
    }



    setActiveColorStopText(activeColorStopText) { this.setState({ ...this.state, activeColorStopText, setActiveColorHintText: undefined }); }



    setActiveColorHintText(activeColorHintText) { this.setState({ ...this.state, activeColorHintText, setActiveColorStopText: undefined }); }



    renderColorStops() {
        return this.props.gradient.colors.map((colorStop, index) => {
            const positionInPercentage = !this.props.gradient.repeating ? colorStop.stop : undefined;

            return <ColorStop
                key={`ColorStop${this.props.index}_${index}`}
                position={positionInPercentage}
                color={colorStop.color}
                index={index}
                deleteOn={this.state.buttonStates.deleteOn}
                textOpen={this.state.activeColorStopText === index}
                gradient={this.props.gradient}
                isActive={this.state.activeColorStop === index}
                setActiveColorStop={this.setActiveColorStop.bind(this)}
                setActiveColorStopText={this.setActiveColorStopText.bind(this)}
                handleInputOnBlur={this.handleInputOnBlur.bind(this)}
                handleInputOnKeyDown={this.handleInputOnKeyDown.bind(this)}
                setMousePosition={this.getMousePosXInPercentage.bind(this)}
            />
        });
    }



    renderColorHints() {
        const hints = [...this.props.gradient.colorHints].sort((a, b) => a - b);

        //get adjecent colors if available and error message if hint is out of range or shadowed by other hints
        const colorHintsWithInfo = [];

        if (!this.props.gradient.colors.length) hints.forEach(hint => {
            colorHintsWithInfo.push({ error: "no color stops detected", position: hints[colorHintsWithInfo.length] });
        });

        this.props.gradient.colors.forEach((colorStop, colorStopIndex, colorStopsArray) => {
            const currentColorPercentage = colorStop.stop;
            const nextColorPercentage = (colorStopsArray[colorStopIndex + 1] || {}).stop;

            if (colorStopIndex === 0) {
                const hintsOutOfRange = hints.filter(hint => hint < currentColorPercentage);
                hintsOutOfRange.forEach(hintOutOfRange => {
                    colorHintsWithInfo.push({ error: "out of range", position: hints[colorHintsWithInfo.length] });
                });
            }

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
                    gradient={this.props.gradient}
                    deleteOn={this.state.buttonStates.deleteOn}
                    setActiveColorHint={this.setActiveColorHint.bind(this)}
                    setActiveColorHintText={this.setActiveColorHintText.bind(this)}
                    errorInfo={colorHint.error}
                    adjecentColors={colorHint.adjecentColors}
                    handleInputOnBlur={this.handleInputOnBlur.bind(this)}
                    handleInputOnKeyDown={this.handleInputOnKeyDown.bind(this)}
                    setMousePosition={this.getMousePosXInPercentage.bind(this)}
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
                    onTouchMove={e => this.handleSliderOnMouseMove(e)}
                    onMouseUp={e => this.handleSliderOnMouseUp(e)}
                    onTouchEnd={e => this.handleSliderOnMouseUp(e)}
                >
                    <GradientSliderRuler gradient={this.props.gradient} />

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