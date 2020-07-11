import React, { Component } from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import { gradientObjsToStr, getImmutableGradientCopy } from "../../functions/gradient";
import GradientSlider from "../GradientSlider/GradientSlider";
import GradientButtons from "../GradientButtons/GradientButtons";
import { getDefaultGradientObj } from "../../functions/gradient";
import "./GradientField.scss";



export default class GradientField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nameInputVisible: false,
            copyWhenInsertCopyOn: false
        };
    }



    componentDidMount() {
        if (!this.props.gradient.name) { this.nameGradients() }
    }



    componentDidUpdate() {
        if (!this.props.gradient.name) { this.nameGradients() }
    }



    handleNameOnClick() { this.setState({ ...this.state, nameInputVisible: true }); }



    handeleNameOnKeyDown(e) {
        const key = e.which || e.keyCode || e.key;
        const input = document.getElementById(`GradientField${this.props.index}-name-input`);
        const closeInput = () => this.setState({ ...this.state, nameInputVisible: false });
        const validateInput = () => input.value
            .replace(/[^\w-.,()[\]\s]/g, "") // filter invalid chars
            .match(/.{0,20}/g)[0];           // allow only 20 cars 

        input.value = validateInput(input.value);
        console.log(input.value);

        if (key === 27 || key === "Escape" || key === "Esc") closeInput();

        if (key === 13 || key === "Enter") {
            const onlyWhiteSpace = str => /^\s*$/g.test(str);
            if (onlyWhiteSpace(input.value)) input.value = null;

            const updatedGradient = Object.assign({}, this.props.gradient, { name: input.value });
            this.props.updateGradient(updatedGradient, this.props.index);

            closeInput();
        }
    }



    handleInsertGradientOnClick(where) {
        const addCopyText = str => {
            console.log("HERE", str);
            return str.replace(/(\scopy\s?\d?)?$/g, copyText => {
                const copyNumber = Number(copyText.match(/\d*$/g)[0] || 0) + 1;
                return " copy" + (copyNumber === 1 ? "" : " " + copyNumber);
            });
        }
        const getCopyName = () => addCopyText((this.props.gradient.name || `Untitled ${this.props.index + 1}`));
        const insertIndex = where === "above" ? this.props.index : this.props.index + 1;
        const newGradient = this.state.copyWhenInsertCopyOn ? { ...this.props.gradient } : getDefaultGradientObj();
        const copyName = this.state.copyWhenInsertCopyOn ? getCopyName() : "";

        newGradient.name = copyName;

        this.props.insertGradient(newGradient, insertIndex);
    }



    toggleVisibility() {
        const updatedGradient = Object.assign({}, this.props.gradient, { visible: !this.props.gradient.visible });
        this.props.updateGradient(updatedGradient, this.props.index);
    }



    renderRedDiagonalLine() {
        return <svg height="100%" width="100%"><line x1="0" y1="100%" x2="100%" y2="0" style={{ stroke: "red", strokeWidth: 2 }} /></svg>
    }



    getUntitledNumber() {
        // In case user messes up titles [Untitled 1, Untitled 3345, Untitled 2]
        // In the case above return 3 instead of 3346 as the next possible Untitled Number
        const names = this.props.gradients.map(gradient => gradient.name);
        const untitledNames = names.filter(name => /^Untitled\s?\d+$/gi.test(name));
        const untitledNumbers = untitledNames.map(name => Number(name.match(/\d+/))).sort((a, b) => a - b);
        const correctNumbers = untitledNumbers.filter((num, ind) => num === ind + 1);
        const untitledNumber = (correctNumbers[correctNumbers.length - 1] || 0) + 1;
        console.log(correctNumbers, untitledNumber);

        return untitledNumber;
    }



    nameGradients() {
        const updatedGradient = getImmutableGradientCopy(this.props.gradient);
        updatedGradient.name = `Untitled ${this.getUntitledNumber()}`;
        console.log(updatedGradient.name);
        this.props.updateGradient(updatedGradient, this.props.index);
    }



    renderName() {
        if (!this.state.nameInputVisible) return this.props.gradient.name;
        else {
            return <input
                type="text"
                id={`GradientField${this.props.index}-name-input`}
                size={16}
                autoFocus
            />
        }
    }



    render() {
        return (
            <div className="GradientField">
                <header>
                    <div className="GradientField__index">{this.props.index + 1}</div>

                    <div
                        className="GradientField__name"
                        onClick={() => this.handleNameOnClick()}
                        onBlur={() => this.setState({ ...this.state, nameInputVisible: false })}
                        onKeyUp={e => this.handeleNameOnKeyDown(e)}
                    >
                        {this.renderName()}
                    </div>

                    <div className="GradientField__header__button-box">
                        <button
                            title="copy this gradient when insert"
                            onClick={() => this.setState({ ...this.state, copyWhenInsertCopyOn: !this.state.copyWhenInsertCopyOn })}
                        >&#128396;
                            <div className={`btn--${this.state.copyWhenInsertCopyOn ? "active" : "inactive"}`}></div>
                        </button>

                        <button
                            title="insert new gradient above"
                            onClick={() => this.handleInsertGradientOnClick("above")}
                        >&#8613;</button>

                        <button
                            title="insert new gradient below"
                            onClick={() => this.handleInsertGradientOnClick("below")}
                        >&#8615;</button>

                        <button title="reposition gradient">&#8645;</button>

                        <button
                            title="visibility"
                            onClick={() => this.toggleVisibility()}
                        >&#128065;<div>{!this.props.gradient.visible && this.renderRedDiagonalLine()}</div>
                        </button>

                        <button
                            title="delete gradient"
                            onClick={() => this.props.confirmDeleteGradient(this.props.gradient, this.props.index)}
                        >&times;</button>
                    </div>
                </header>

                <div className="GradientField__body">
                    <div className="GradientField__preview" title="preview">
                        <div
                            style={{ background: `${gradientObjsToStr([this.props.gradient].reverse())}, url(${checkeredRect})` }}
                            onClick={() => this.toggleVisibility()}
                        >
                            {!this.props.gradient.visible && this.renderRedDiagonalLine()}
                        </div>
                    </div>

                    <div className="GradientField__settings">
                        <GradientSlider
                            gradient={this.props.gradient}
                            index={this.props.index}
                            updateGradient={this.props.updateGradient}
                            openColorPicker={this.props.openColorPicker}
                            preventMouseUp={this.props.preventMouseUp}
                            activeAngleMeter={this.props.activeAngleMeter}
                        />

                        <GradientButtons
                            gradient={this.props.gradient}
                            index={this.props.index}
                            updateGradient={this.props.updateGradient}
                            setAngleMeterIsActive={this.props.setAngleMeterIsActive}
                            activeAngleMeter={this.props.activeAngleMeter}
                            openRadialSettings={this.props.openRadialSettings}
                        />
                    </div>
                </div>
            </div>
        );
    }
}