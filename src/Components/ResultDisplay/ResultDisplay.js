import React, { Component } from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import "./ResultDisplay.scss";



export default class ResultDisplay extends Component {
    render() {
        return (
            <div className="ResultDisplay">
                <div className="ResultDisplay__checkered-bg" style={{ backgroundImage: `url(${checkeredRect})` }}>
                    <div className="ResultDisplay__color-bg" title="Result Gradient">

                    </div>
                </div>
            </div>
        );
    }
}