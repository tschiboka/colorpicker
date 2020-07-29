import React, { Component } from 'react';
import GradientSliderRuler from "../GradientSliderRuler/GradientSliderRuler";
import GradientSliderButtonBox from "../GradientSliderButtonBox/GradientSliderButtonBox";
import ColorStop from "../ColorStop/ColorStop";
import ColorHint from "../ColorHint/ColorHint";
import { sortGradientByColorStopsPercentage, filterIdenticalColorPercentages } from "../../functions/slider";
import { getPercentToFixed, mousePos } from "../../functions/slider";
import { gradientHasValidMaxInput } from "../../functions/gradient";
import { produce } from "immer";
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
        const gradientCopy = (colorStopPressed || colorHintPressed) ? this.props.gradient : undefined;

        // Set dragged state if mouse pressed on color stop or color hint
        if (!thumbDragged && (colorStopPressed || colorHintPressed)) this.setState({ ...this.state, colorStopDragged: true });

        // Drag colors stop
        if (colorStopPressed) {
            const updatedGradientCopy = produce(gradientCopy, draft => {
                draft.colors[this.state.activeColorStop].stop = this.getNewStopPosition({ ...event });
            });
            this.props.updateGradient(updatedGradientCopy, this.props.index);
        }

        // Drag color hint
        if (colorHintPressed) {
            gradientCopy.colorHints[this.state.activeColorHint] = this.getNewStopPosition({ ...event });
            const sortedGradientHints = produce(gradientCopy, draft => {
                draft.colorHints = [...gradientCopy.colorHints].sort((a, b) => a - b);
            });
            this.props.updateGradient(sortedGradientHints, this.props.index);
        }
    }



    handleSliderOnMouseUp(event) {
        // Do nothing if any text input is active on slider
        const textActive = this.state.activeColorStopText !== undefined || this.state.activeColorHintText !== undefined;
        const mouseUpFromAngleMeter = this.props.activeAngleMeter !== undefined;
        if (textActive || mouseUpFromAngleMeter) return false;

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



    getNewStopPosition(event) {
        const sliderDiv = document.getElementById(this.state.id).children[0];
        const width = Math.round(sliderDiv.getBoundingClientRect().width);

        if (this.props.gradient.repeatingUnit === "%" && Number(this.props.gradient.max) === 100) return this.getMousePosXInPercentage(event, width);
        else return this.getMousePosX(event, width);
    }




    getMousePosXInPercentage(event, width) {
        const mouseX = mousePos({ ...event }, "#" + this.state.id);
        let mouseAtPercentage;

        if (mouseX <= 20) mouseAtPercentage = 0;
        else if (mouseX >= width - 20) mouseAtPercentage = 100;
        else mouseAtPercentage = getPercentToFixed(width - 40, mouseX - 20);

        return mouseAtPercentage;
    }



    getMousePosX(event, width) {
        const relativePosInPercentage = this.getMousePosXInPercentage(event, width);
        const percentageToUnits = Number(this.props.gradient.max) * (relativePosInPercentage / 100);

        return this.props.gradient.repeatingUnit === "px"
            ? Math.round(percentageToUnits) : percentageToUnits % 1
                ? Number(percentageToUnits.toFixed(1)) : percentageToUnits;
    }



    clearInput(target) {
        target.value = "";
        target.setCustomValidity("");
    }



    setNewColorStopValue(value, index) {
        const gradientCopy = produce(this.props.gradient, draft => {
            draft.colors[index].stop = Number(value);
        });

        const gradientSorted = sortGradientByColorStopsPercentage(gradientCopy);
        const filteredGradient = filterIdenticalColorPercentages(gradientSorted, index);

        this.props.updateGradient(filteredGradient, this.props.index);
        const timer = setTimeout(() => { this.resetStateTo(); clearTimeout(timer); }, 500);
    }



    setNewColorHintValue(value, index) {
        const gradientCopy = this.props.gradient;
        gradientCopy.colorHints[index] = Number(value);

        const updatedColorHints = [...gradientCopy.colorHints].sort((a, b) => a - b);
        const updatedGradientCopy = produce(gradientCopy, draft => {
            draft.colorHints = updatedColorHints;
        });

        this.props.updateGradient(updatedGradientCopy, this.props.index);
        const timer = setTimeout(() => { this.resetStateTo(); clearTimeout(timer); }, 500);
    }



    deleteColorStop(index) {
        const updatedGradient = produce(this.props.gradient, draft => {
            draft.colors = draft.colors.filter((_, i) => i !== index);
        });

        this.props.updateGradient(updatedGradient, this.props.index);
    }



    deleteColorHint(index) {
        const updatedGradient = produce(this.props.gradient, draft => {
            draft.colorHints = draft.colorHints.filter((_, i) => i !== index);
        });

        this.props.updateGradient(updatedGradient, this.props.index);
    }



    sortAndFilterGradients() {
        const gradientCopy = this.props.gradient;
        const gradientSorted = sortGradientByColorStopsPercentage(gradientCopy);
        const filteredGradient = filterIdenticalColorPercentages(gradientSorted, this.state.activeColorStop);

        this.props.updateGradient(filteredGradient, this.props.index);
    }



    addNewColorStop(event) {
        const sliderDiv = document.getElementById(this.state.id).children[0];
        const width = Math.round(sliderDiv.getBoundingClientRect().width);
        const gradientCopy = this.props.gradient;
        const updatedColorStops = [...gradientCopy.colors];
        let colorStop;

        if (this.props.gradient.repeatingUnit === "%" && Number(this.props.gradient.max) === 100) colorStop = this.getMousePosXInPercentage(event, width);
        else colorStop = this.getMousePosX(event, width);

        updatedColorStops.push({ color: "rgba(255, 255, 255, 0.5)", stop: colorStop });
        const updatedGradientColors = produce(gradientCopy, draft => {
            draft.colors = updatedColorStops;
        });

        const gradientSorted = sortGradientByColorStopsPercentage(updatedGradientColors);
        const filteredGradient = filterIdenticalColorPercentages(gradientSorted, this.state.activeColorStop);

        this.props.updateGradient(filteredGradient, this.props.index);
    }



    addNewColorHint(event) {
        const sliderDiv = document.getElementById(this.state.id).children[0];
        const width = Math.round(sliderDiv.getBoundingClientRect().width);
        const gradientCopy = this.props.gradient;
        let colorHint;

        if (this.props.gradient.repeatingUnit === "%" && Number(this.props.gradient.max) === 100) colorHint = this.getMousePosXInPercentage(event, width);
        else colorHint = this.getMousePosX(event, width);
        const colorHints = gradientCopy.colorHints;
        const pushedColorHints = produce(colorHints, draft => { draft.push(colorHint); });
        const gradientCopyWithNewColorHint = produce(gradientCopy, draft => {
            draft.colorHints = [...pushedColorHints].sort((a, b) => a - b)
        });

        this.props.updateGradient(gradientCopyWithNewColorHint, this.props.index);
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
            mouseAtPercentage: this.getNewStopPosition({ ...event })
        }, () => console.log(this.state.activeColorStop));
    }



    setActiveColorHint(activeColorHint, event) {
        this.resetStateTo({
            activeColorHint,
            mouseAtPercentage: this.getMousePosXInPercentage({ ...event })
        })
    }



    setActiveColorStopText(activeColorStopText) { this.setState({ ...this.state, activeColorStopText, setActiveColorHintText: undefined }); }



    setActiveColorHintText(activeColorHintText) { this.setState({ ...this.state, activeColorHintText, setActiveColorStopText: undefined }); }



    renderColorStops() {
        if (!gradientHasValidMaxInput(this.props.gradient)) return false;

        return this.props.gradient.colors.map((colorStop, index) => {
            return <ColorStop
                key={`ColorStop${this.props.index}_${index}`}
                position={colorStop.stop}
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
        if (!gradientHasValidMaxInput(this.props.gradient)) return false;

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