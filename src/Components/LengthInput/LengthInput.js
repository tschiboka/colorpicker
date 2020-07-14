import React, { Component } from 'react';
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



    handleInputOnChange(input) {
        const valid = this.validateInput(input);
        console.log("ISVALID", valid);
        this.setState({ ...this.state, valid })
        if (valid) this.props.onChange(this.props.name, Number(input), this.state.unit);
    }



    handleOpitionOnClick(event, unit) {
        this.setState({ ...this.state, unit, optionsOpen: false }, () => {
            const input = document.getElementById(`LengthInput_${this.props.id}`);
            this.handleInputOnChange(input.value);
        });

        event.stopPropagation();
    }



    validateInput(inputValue) {
        console.log(this.state.unit === "px", /\./g.test(inputValue));
        if (inputValue === "") return false;                                    // TEST ""
        if (!/^(\d+)?([.]?\d{1})?$/g.test(inputValue)) return false;            // TEST X NUMBER OPTIONAL 1 DECIMAL PLACE
        if (this.state.unit === "px" && /\./g.test(inputValue)) return false;   // TEST PX UNIT INTEGER
        if (this.state.unit === "px" && Number(inputValue) > 2000) return false;// TEST PX <= 2000
        if (this.state.unit !== "px" && Number(inputValue) > 100) return false; // TEST REST UNITS <= 100
        if (/^0\d/g.test(inputValue)) return false;                             // TEST 01 00 001


        console.log("NOT NUMBER", inputValue, !/^[0-9.]+$/g.test(inputValue))
        return true;
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
                >{this.state.unit}</div>

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
                </div>
            </div>
        );
    }
}