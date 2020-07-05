import React, { Component } from 'react';
import "./LengthInput.scss";



export default class LengthInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            optionsOpen: false,
            unit: "%",
        };
    }



    componentDidUpdate() {
        if (this.lengthInput) this.lengthInput.focus()
    }



    handleOnBlur() {
        const blurDelay = setTimeout(() => {
            this.setState({ ...this.state, optionsOpen: false });
            clearTimeout(blurDelay);
        }, 500);
    }



    handleOpitionOnClick(event, unit) {
        this.setState({ ...this.state, unit, optionsOpen: false });

        event.stopPropagation();
    }



    renderUnitButtons() {
        const units = ["%", "px", "vw", "vh", "em", "rem"].reverse();

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
            >
                <input
                    type="text"
                    min="0"
                />

                <div>{this.state.unit}</div>

                <div onClick={() => this.setState({ ...this.state, optionsOpen: !this.state.optionsOpen })}>
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