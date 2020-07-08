import React, { Component } from 'react';
import "./LengthInput.scss";



export default class LengthInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            optionsOpen: false,
            unit: this.props.unit,
        };
    }



    componentDidUpdate() {
        if (this.lengthInput) this.lengthInput.focus();
    }



    handleOnBlur() {
        const blurDelay = setTimeout(() => {
            this.setState({ ...this.state, optionsOpen: false });
            clearTimeout(blurDelay);
        }, 500);
    }



    handleOpitionOnClick(event, unit) {
        this.setState({ ...this.state, unit, optionsOpen: false }, () => {

            if (unit === "px" && /\..$/g.test(this.props.value)) {
                const input = document.getElementById(`LengthInput_${this.props.id}`);

                input.value = this.props.value.replace(/\..$/g, "");
            }

            this.validateInput(document.getElementById(`LengthInput_${this.props.id}`).value);
        });

        event.stopPropagation();
    }



    validateInput(inputValue) {
        const valid = document.getElementById(`LengthInput_${this.props.id}`).validity.valid;

        this.setState({ ...this.state, valid }, () => {
            if (this.state.valid) this.props.onChange(this.props.name, inputValue, this.state.unit);
        });
    }



    getInputPattern = () => this.state.unit === "px" ? "\\d{1,4}" : "\\d{1,2}\\.?\\d?|100";



    getInputValue = () => {
        if (this.props.disabled) return "";

        if (this.unit === "px") return this.props.value.replace(/\..$/g, "");

        return this.props.value;
    }



    renderUnitButtons() {
        const units = (this.props.units || ["%", "px", "vw", "vh", "em", "rem"].reverse());

        return units.map((unit, i) => (
            <button
                key={`LengthInput__unit-opition-btn_${this.props.id}${i}`}
                onClick={e => this.handleOpitionOnClick(e, unit)}
            >
                {unit}
            </button>
        ));
    }



    render() {
        return (
            <div className="LengthInput">
                <input
                    id={`LengthInput_${this.props.id}`}
                    type="text"
                    disabled={this.props.disabled}
                    placeholder={this.props.value}
                    pattern={this.getInputPattern()}
                    value={this.getInputValue()}
                    onChange={e => this.validateInput(e.target.value, e)}
                />

                <div>{this.state.unit}</div>

                <div onClick={() => this.setState({ ...this.state, optionsOpen: !this.props.disabled ? !this.state.optionsOpen : false })}>
                    &#709;
                </div>

                <div className="LengthInput__HOOK">
                    {this.state.optionsOpen && (
                        <div
                            className="LengthInput__options"
                            ref={(input) => { this.lengthInput = input; }}
                            tabIndex={1}
                            onBlur={e => this.handleOnBlur(e)}>
                            {this.renderUnitButtons()}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}