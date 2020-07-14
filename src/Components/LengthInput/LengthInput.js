import React, { Component } from 'react';
import errorIcon from "../../images/error.png";
import "./LengthInput.scss";



export default class LengthInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            optionsOpen: false,
            unit: this.props.unit,
            valid: true
        };
    }



    componentDidMount() {
        const input = document.getElementById(`LengthInput_${this.props.id}`);
        input.value = this.validatePropsValue(this.props.value);
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



    handleInputOnChange(inputValue) {
        const { valid, error, value } = { ...this.validateInput(inputValue) };
        this.setState({ ...this.state, valid, error })
        if (valid) this.props.onChange(this.props.name, Number(value), this.state.unit);
    }



    handleOpitionOnClick(event, unit) {
        this.setState({ ...this.state, unit, optionsOpen: false }, () => {
            const input = document.getElementById(`LengthInput_${this.props.id}`);
            this.handleInputOnChange(input.value);
        });

        event.stopPropagation();
    }



    validateInput(inputValue) {
        let error = undefined;
        let valid = true;
        let value = inputValue;

        if (inputValue === "") {                                                // TEST ""
            error = "Can not be empty!";
            return ({ valid: false, error, value });
        }
        if (/^\d*[.]+$/g.test(inputValue)) {                                    // TEST . X. X..
            error = "Must not end in decimal point!";
            return ({ valid: false, error, value });
        }
        if (/[.]\d{2,}?$/g.test(inputValue)) {                                  // TEST X.YZ 
            error = "Max 1 decimal value!";
            return ({ valid: false, error, value });
        }
        if (!/^(\d+)?([.]?\d{1})?$/g.test(inputValue)) {                        // TEST X NUMBER OPTIONAL AND DECIMAL POINT
            error = "Must contain numbers!";
            return ({ valid: false, error, value });
        }
        if (this.state.unit === "px" && /\./g.test(inputValue)) {               // TEST PX UNIT INTEGER
            error = "Must be an integer! [px]";
            return ({ valid: false, error, value });
        }
        if (this.state.unit === "px" && Number(inputValue) > 2000) {            // TEST PX <= 2000
            error = "Max 2000 for px";
            return ({ valid: false, error, value });
        }
        if (this.state.unit !== "px" && Number(inputValue) > 100) {             // TEST REST UNITS <= 100
            error = "Max 100 for " + this.state.unit + "!";
            return ({ valid: false, error, value });
        }
        if (/^0\d/g.test(inputValue)) {                                         // TEST 01 00 001
            error = "Invalid formating!";
            return ({ valid: false, error, value });
        }

        return ({ valid, error, value });
    }



    validatePropsValue(valueFromProps) { return !this.props.disabled ? valueFromProps : ""; }



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
            <div
                className="LengthInput"
                title={this.props.title}
            >
                <input
                    id={`LengthInput_${this.props.id}`}
                    className={!this.state.valid ? "invalid" : ""}
                    type="text"
                    disabled={this.props.disabled}
                    onChange={e => this.handleInputOnChange(e.target.value)}
                />
                <div
                    className={!this.state.valid ? "invalid" : ""}
                >{
                        this.state.valid ?
                            this.state.unit :
                            <span
                                className="error info icon"
                                style={{ backgroundImage: `url(${errorIcon})` }}
                            ></span>
                    }</div>

                <div onClick={() => this.setState({ ...this.state, optionsOpen: !this.props.disabled ? !this.state.optionsOpen : false })}>
                    &#709;
                </div>

                <div className="LengthInput__HOOK">
                    {this.state.optionsOpen && (
                        <div
                            className="LengthInput__options"
                            ref={(input) => { this.lengthInput = input; }}
                            tabIndex={1}
                            onBlur={e => this.handleOnBlur(e, e.target)}>
                            {this.renderUnitButtons()}
                        </div>
                    )}
                    {
                        !this.state.valid && (
                            <div
                                className="LengthInput__error-msg"
                            >
                                {this.state.error}
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}