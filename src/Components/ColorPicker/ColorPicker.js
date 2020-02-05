import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./ColorPicker.scss";
import btnBg from "./images/btn_sm_square.png";

export default class ColorPicker extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            this.props.visible ? (
                <div
                    className="ColorPicker"
                    style={{ left: (this.props.X || 0) + "px", top: (this.props.Y || 0) + "px" }}
                    onClick={e => e.stopPropagation()}
                    onBlur={() => this.props.close()}
                    tabIndex={1}
                    ref={component => { if (ReactDOM.findDOMNode(component)) ReactDOM.findDOMNode(component).focus() }}
                >
                    <div className="ColorPicker__header">
                        <button
                            className="close-btn" onClick={() => this.props.close()}
                            style={{ backgroundImage: `url(${btnBg})` }}
                        >&times;</button>
                    </div>

                    <div className="ColorPicker__palette"></div>

                    <div className="ColorPicker__spectrum"></div>

                    <div className="ColorPicker__alpha"></div>
                </div>)
                : null
        );
    }
}