import React, { Component } from 'react';
import checkeredRect from "../../images/checkered_rect.png";
import ResultDisplayMenu from "../ResultDisplayMenu/ResultDisplayMenu";
import { gradientObjsToStr } from "../../functions/gradient";
import fullscreenBtn from "../../images/fullscreen.png";
import fullStreenActiveBtn from "../../images/fullscreen_active.png";
import "./ResultDisplay.scss";



export default class ResultDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuIsOpen: false,
            bgIsCheckered: true,
            menuHover: false,
            fullscreenHover: false
        };
    }


    getStyleObj(isCheckered = false) {
        const checkeredStyle = { backgroundImage: `url(${checkeredRect})` };
        const whiteStyle = { backgroundColor: "white" };
        return isCheckered ? checkeredStyle : whiteStyle;
    }



    changeDisplayBg(isCheckered) { this.setState({ ...this.state, bgIsCheckered: isCheckered }) }



    closeMenu() { this.setState({ ...this.state, menuIsOpen: false }); }



    render() {
        return (
            <div className="ResultDisplay">
                <header className="ResultDisplay__header">
                    <span>Gradient Display</span>

                    <div>
                        <div>
                            <button
                                className="ResultDisplay__menu-btn"
                                title="display gradient full-screen"
                                //onClick={() => this.setState({ ...this.state, menuIsOpen: !this.state.menuIsOpen })}
                                onMouseEnter={() => this.setState({ ...this.state, fullscreenHover: true })}
                                onMouseLeave={() => this.setState({ ...this.state, fullscreenHover: false })}
                            >
                                <div
                                    style={{ backgroundImage: `url(${this.state.fullscreenHover ? fullStreenActiveBtn : fullscreenBtn})` }}
                                ></div>
                            </button>
                        </div>


                        <div>
                            <button
                                className="ResultDisplay__menu-btn"
                                onClick={() => this.setState({ ...this.state, menuIsOpen: !this.state.menuIsOpen })}>
                                &#9776;
                        </button>
                        </div>
                    </div>
                </header>

                <div
                    className="ResultDisplay__checkered-bg"
                    style={this.getStyleObj(this.state.bgIsCheckered)}>
                    <div
                        className="ResultDisplay__color-bg"
                        title="Result Gradient"
                        style={{ background: gradientObjsToStr([...this.props.gradients].reverse()) }}>

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