import React, { Component } from 'react';
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

            if (!onlyWhiteSpace(input.value)) {
                const updatedGradient = Object.assign({}, this.props.gradient, { name: input.value });
                this.props.updateGradient(updatedGradient, this.props.index);
            }

            closeInput();
        }
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

                    <div className="GradientField__button-box">
                        <button title="insert new gradient above">&#8613;</button>

                        <button title="insert new gradient below">&#8615;</button>

                        <button title="reposition gradient">&#8645;</button>

                        <button title="visibility">&#128065;</button>

                        <button title="delete gradient">&times;</button>
                    </div>
                </header>

                <div className="GradientField__body">
                    BODY
                </div>
            </div>
        );
    }
}