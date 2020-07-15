import React, { Component } from 'react';
import checkeredRect from "../../images/checkered_rect.png";
import ResultDisplayMenu from "../ResultDisplayMenu/ResultDisplayMenu";
import { gradientObjsToStr } from "../../functions/gradient";
import fullscreenIcon from "../../images/fullscreen.png";
import fullStreenActiveIcon from "../../images/fullscreen_active.png";
import menuIcon from "../../images/menu.png";
import menuActiveIcon from "../../images/menu_active.png";
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
                                onMouseEnter={() => this.setState({ ...this.state, fullscreenHover: true, menuHover: false })}
                                onMouseLeave={() => this.setState({ ...this.state, fullscreenHover: false, menuHover: false })}
                                onClick={() => this.setState({ ...this.state, menuIsOpen: !this.state.menuIsOpen })}
                            >
                                <div
                                    style={{ backgroundImage: `url(${this.state.fullscreenHover ? fullStreenActiveIcon : fullscreenIcon})` }}
                                ></div>
                            </button>
                        </div>


                        <div>
                            <button
                                title="main menu"
                                className="ResultDisplay__menu-btn"
                                onClick={() => this.setState({ ...this.state, menuIsOpen: !this.state.menuIsOpen })}
                                onMouseEnter={() => this.setState({ ...this.state, menuHover: true, fullscreenHover: false })}
                                onMouseLeave={() => this.setState({ ...this.state, menuHover: false, fullscreenHover: false })}
                            >
                                <div
                                    style={{ backgroundImage: `url(${this.state.menuHover ? menuActiveIcon : menuIcon})` }}
                                ></div>
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