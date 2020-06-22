import React, { Component } from 'react';
import checkeredRect from "../ColorPicker/images/transparent_checkered_bg.png";
import ResultDisplayMenu from "../ResultDisplayMenu/ResultDisplayMenu";
import "./ResultDisplay.scss";



export default class ResultDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsOpen: false,
            bgIsCheckered: true,
        };
    }



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
        const checkeredStyle = { backgroundImage: `url(${checkeredRect})` };
        const whiteStyle = { backgroundColor: "white" };
        return isCheckered ? checkeredStyle : whiteStyle;
    }



    changeDisplayBg(isCheckered) { this.setState({ ...this.state, bgIsCheckered: isCheckered }, () => { console.log(this.state.bgIsCheckered) }); }



    closeMenu() { this.setState({ ...this.state, menuIsOpen: false }); }



    render() {
        return (
            <div className="ResultDisplay">
                <header className="ResultDisplay__header">
                    <span>Gradient Display</span>

                    <button
                        className="ResultDisplay__menu-btn"
                        onClick={() => this.setState({ ...this.state, menuIsOpen: !this.state.menuIsOpen })}>
                        &#9776;
                    </button>
                </header>

                <div
                    className="ResultDisplay__checkered-bg"
                    style={this.getStyleObj(this.state.bgIsCheckered)}>
                    <div
                        className="ResultDisplay__color-bg"
                        title="Result Gradient"
                        style={{ background: this.gradientObjToStr(this.props.gradients) }}>

                        {this.state.menuIsOpen && (
                            <ResultDisplayMenu
                                bgIsCheckered={this.state.bgIsCheckered}
                                changeDisplayBg={this.changeDisplayBg.bind(this)}
                                closeMenu={this.closeMenu.bind(this)}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}