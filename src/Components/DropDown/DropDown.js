import React, { Component } from 'react';
import "./DropDown.scss";



export default class DropDown extends Component {
    constructor(props) {
        super(props);

        this.state = { dropDownListIsOpen: false };
    }



    handleOptionListOnBlur() {
        const blurTimer = setTimeout(() => {
            this.setState({ ...this.state, dropDownListIsOpen: false });
            clearTimeout(blurTimer);
        }, 100);
    }



    renderOptions() {
        const focusTimer = setTimeout(() => {
            this.dropdown.focus();
            clearTimeout(focusTimer);
        }, 100);

        return this.props.options.map((option, index) => (
            <li
                key={`option_${index}`}
                className={(option === (this.props.current || this.props.default)) ? "option--disabled" : ""}
                onClick={() => this.props.onSelect(option)}
            >
                {option}
            </li>
        ));
    }



    render() {
        return (
            <div className="DropDown">
                <div>{this.props.current || this.props.default}</div>

                <button
                    className="DropDown__toggle-options-list"
                    disabled={this.dropDownListIsOpen}
                    onClick={() => this.setState({ ...this.state, dropDownListIsOpen: !this.state.dropDownListIsOpen ? true : false })}
                >&#709;</button>

                <div className="DropDown__HOOK">
                    {
                        this.state.dropDownListIsOpen &&
                        (
                            <ul
                                ref={dropdown => this.dropdown = dropdown}
                                tabIndex={1}
                                onBlur={() => this.handleOptionListOnBlur()}
                            >
                                {this.renderOptions()}
                            </ul>
                        )
                    }
                </div>
            </div>
        )
    }
}