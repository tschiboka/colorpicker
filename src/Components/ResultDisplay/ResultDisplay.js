import React, { Component } from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import "./ResultDisplay.scss";



export default class ResultDisplay extends Component {
    gradientObjToStr(grdObj) {
        return grdObj.map(grad => {
            const { colors } = grad;
            const prefix = (grad.direction === "radial" ? "radial" : "linear") + "-gradient";
            const degree = grad.direction === "radial" ? "" : grad.direction + "deg, ";
            const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(",");

            return `${prefix}(${degree}${colorStops})`;
        }).join(",");
    }



    getStyleObj(isCheckered = false) {
        console.log("HERE")
        const checkeredStyle = { backgroundImage: `url(${checkeredRect})` };
        const whiteStyle = { backgroundColor: "white" };
        return isCheckered ? checkeredStyle : whiteStyle;
    }



    render() {
        return (
            <div className="ResultDisplay">
                <div
                    className="ResultDisplay__checkered-bg"
                    style={this.getStyleObj(this.props.checkered)}>
                    <div
                        className="ResultDisplay__color-bg"
                        title="Result Gradient"
                        style={{ background: this.gradientObjToStr(this.props.gradients) }}>
                    </div>
                </div>
            </div>
        );
    }
}