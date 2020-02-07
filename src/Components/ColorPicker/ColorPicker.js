import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import "./ColorPicker.scss";
import transparentCheckerdBg from "./images/transparent_checkered_bg.png";
import sliderThumb from "./images/hue_slider_thumb.png";

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
                            className="close-btn ColorPicker--button-theme"
                            onClick={() => this.props.close()}
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
                                <div className="ColorPicker__slider-bg">
                                    <div className="ColorPicker__hue">
                                        <div className="ColorPicker__slider-thumb" style={{ backgroundImage: `url(${sliderThumb})` }}>
                                            <div className="ColorPicker__slider-point" id="hue-slider-point"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ColorPicker__alpha-box">
                                <div className="ColorPicker__alpha-slider">
                                    <div className="ColorPicker__slider-bg">
                                        <div className="ColorPicker__alpha-bg" style={{ backgroundImage: `url(${transparentCheckerdBg})` }}>
                                            <div className="ColorPicker__alpha">
                                                <div className="ColorPicker__slider-thumb" style={{ backgroundImage: `url(${sliderThumb})` }}>
                                                    <div className="ColorPicker__slider-point" id="alpha-slider-point"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="ColorPicker__ok-btn-box">
                                <button className="ColorPicker--button-theme">OK</button>
                            </div>
                        </div>
                    </div>
                </div>)
                : null
        );
    }
}