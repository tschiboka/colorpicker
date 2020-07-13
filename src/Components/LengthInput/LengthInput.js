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
        this.setState({ ...this.state, valid })
        if (valid) this.props.onChange(this.props.name, input, this.state.unit);
    }



    handleOpitionOnClick(event, unit) {
        this.setState({ ...this.state, unit, optionsOpen: false }, () => {

            if (unit === "px" && /\..$/g.test(this.props.value)) {
                const input = document.getElementById(`LengthInput_${this.props.id}`);

                input.value = this.props.value.replace(/\..$/g, "");
            }

            //this.validateInput(document.getElementById(`LengthInput_${this.props.id}`).value);
        });

        event.stopPropagation();
    }



    validateInput(inputValue) {
        if (inputValue === "") return false;
        //if (/^\d$/g.test(inputValue));
        console.log("INVALID", /^\d$/g.test(inputValue));
        //input.value = this.validatePropsValue(this.props.value);

        console.log(inputValue);


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
            <div className="LengthInput">
                <input
                    id={`LengthInput_${this.props.id}`}
                    class={!this.state.valid && "invalid"}
                    type="text"
                    disabled={this.props.disabled}
                    onChange={e => this.handleInputOnChange(e.target.value)}
                />

                <div
                    class={!this.state.valid && "invalid"}
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
            </div >
        );
    }
}