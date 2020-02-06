import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./ColorPicker.scss";
import btnBg from "./images/btn_sm_square.png";
import transparentCheckerdBg from "./images/transparent_checkered_bg.png";

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
                    //onBlur={() => this.props.close()}
                    onKeyDown={e => { if (e.keyCode === 27) this.props.close(); }}
                    tabIndex={1}
                    ref={component => { if (ReactDOM.findDOMNode(component)) ReactDOM.findDOMNode(component).focus() }}
                >
                    <div className="ColorPicker__header">
                        <button
                            className="close-btn"
                            onClick={() => this.props.close()}
                            style={{ backgroundImage: `url(${btnBg})` }}
                            title="close [Esc]"
                        >&times;</button>
                    </div>

                    <div className="ColorPicker__body">
                        <div className="ColorPicker__upper-box">
                            <div className="ColorPicker__palette"></div>

                            <div className="ColorPicker__text-inputs"></div>
                        </div>

                        <div className="ColorPicker__lower-box">
                            <div className="ColorPicker__hue-slider">
                                <div className="ColorPicker__hue"></div>
                            </div>

                            <div className="ColorPicker__alpha-box">
                                <div className="ColorPicker__alpha-slider">
                                    <div className="ColorPicker__alpha-bg" style={{ backgroundImage: `url(${transparentCheckerdBg})` }}>

                                        <div className="ColorPicker__alpha"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="ColorPicker__ok-btn-box">
                                <button style={{ backgroundImage: `url(${btnBg})` }}>OK</button>
                            </div>
                        </div>
                    </div>
                </div>)
                : null
        );
    }
}