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
            this.validateInput(document.getElementById(`LengthInput_${this.props.id}`).value);
        });

        event.stopPropagation();
    }



    validateInput(inputValue) {
        const value = inputValue || "0";
        const valid = value.length && document.getElementById(`LengthInput_${this.props.id}`).validity.valid;

        this.setState({ ...this.state, valid }, () => {
            if (this.state.valid) this.props.onChange(this.props.name, Number(value), this.state.unit);
        });
    }



    renderUnitButtons() {
        const units = (this.props.units || ["%", "px", "vw", "vh", "em", "rem"]).reverse();

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
                    min="0"
                    pattern={this.state.unit === "px" ? "\\d{1,4}|\\d{1,4}\\.\\d" : "\\d{1,2}|100"}
                    value={this.props.disabled ? "" : this.props.value}
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