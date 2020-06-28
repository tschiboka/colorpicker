import React, { Component } from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import { gradientObjsToStr } from "../../functions/gradient";
import GradientSlider from "../GradientSlider/GradientSlider";
import GradientButtons from "../GradientButtons/GradientButtons";
import "./GradientField.scss";



export default class GradientField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            nameInputVisible: false
        };
    }



    handleNameOnClick() { this.setState({ ...this.state, nameInputVisible: true }); }



    handeleNameOnKeyDown(e) {
        const key = e.which || e.keyCode || e.key;
        const input = document.getElementById(`GradientField${this.props.index}-name-input`);
        const validateInput = () => input.value.replace(/[^\w-.,()[\]\s]/g, "");
        const closeInput = () => this.setState({ ...this.state, nameInputVisible: false });

        input.value = validateInput(input.value);

        if (key === 27 || key === "Escape" || key === "Esc") closeInput();

        if (key === 13 || key === "Enter") {
            const onlyWhiteSpace = str => /^\s*$/g.test(str);
            if (onlyWhiteSpace(input.value)) input.value = null;

            const updatedGradient = Object.assign({}, this.props.gradient, { name: input.value });
            this.props.updateGradient(updatedGradient, this.props.index);

            closeInput();
        }
    }



    toggleVisibility() {
        const updatedGradient = Object.assign({}, this.props.gradient, { visible: !this.props.gradient.visible });
        this.props.updateGradient(updatedGradient, this.props.index);
    }



    renderRedDiagonalLine() {
        return <svg height="100%" width="100%"><line x1="0" y1="100%" x2="100%" y2="0" style={{ stroke: "red", strokeWidth: 2 }} /></svg>
    }



    renderName() {
        if (!this.state.nameInputVisible) {
            return this.props.gradient.name || `Untitled ${this.props.index + 1}`;
        }
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
                        <button title="insert new gradient above">&#8613;</button>

                        <button title="insert new gradient below">&#8615;</button>

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
                        />

                        <GradientButtons
                            gradient={this.props.gradient}
                            index={this.props.index}
                            updateGradient={this.props.updateGradient}
                            setAngleMeterIsActive={this.props.setAngleMeterIsActive}
                        />
                    </div>
                </div>
            </div>
        );
    }
}