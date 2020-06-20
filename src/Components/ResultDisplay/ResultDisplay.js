import React, { Component } from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import "./ResultDisplay.scss";



export default class ResultDisplay extends Component {
    gradientObjToStr(grdObj) {
        const { colors } = grdObj;
        const prefix = (grdObj.direction === "radial" ? "radial" : "linear") + "-gradient";
        const degree = grdObj.direction === "radial" ? "" : grdObj.direction + "deg, ";
        const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(",");

        return `${prefix}(${degree}${colorStops})`;
    }



    render() {
        return (
            <div className="ResultDisplay">
                <div
                    className="ResultDisplay__checkered-bg"
                    style={{ backgroundImage: `url(${checkeredRect})` }}>
                    <div
                        className="ResultDisplay__color-bg"
                        title="Result Gradient"
                        style={{ background: this.gradientObjToStr(this.props.gradient) }}>
                    </div>
                </div>
            </div>
        );
    }
}