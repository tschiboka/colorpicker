import React, { Component } from 'react';
import checkeredRect from "../../images/checkered_rect.png";
import MainMenu from "../MainMenu/MainMenu";
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
            menuHover: false,
            fullscreenHover: false
        };
    }


    getStyleObj(isCheckered = false) {
        const checkeredStyle = { backgroundImage: `url(${checkeredRect})` };
        const whiteStyle = { backgroundColor: "white" };
        return isCheckered ? checkeredStyle : whiteStyle;
    }



    closeMenu() { this.setState({ ...this.state, menuIsOpen: false }); }



    render() {
        return (
            <div className="ResultDisplay">
                <header className="ResultDisplay__header">
                    <span>Gradient Display</span>

                    <div>
                        <div>
                            <button
                                className="ResultDisplay__btn"
                                title="display gradient full-screen"
                                onMouseEnter={() => this.setState({ ...this.state, fullscreenHover: true, menuHover: false })}
                                onMouseLeave={() => this.setState({ ...this.state, fullscreenHover: false, menuHover: false })}
                                onClick={() => this.props.setFullscreen()}
                            >
                                <div
                                    style={{ backgroundImage: `url(${this.state.fullscreenHover ? fullStreenActiveIcon : fullscreenIcon})` }}
                                ></div>
                            </button>
                        </div>


                        <div>
                            <button
                                title="main menu"
                                className="ResultDisplay__btn"
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
                    style={this.getStyleObj(this.props.checkered)}>
                    <div
                        className="ResultDisplay__color-bg"
                        title="Result Gradient"
                        style={{
                            backgroundSize: this.props.backgroundSize[0].value + this.props.backgroundSize[0].unit + " " + this.props.backgroundSize[1].value + this.props.backgroundSize[1].unit,
                            background: gradientObjsToStr([...this.props.gradients].reverse()),
                            backgroundColor: this.props.backgroundColor || "",
                        }}>

                        {this.state.menuIsOpen && (
                            <MainMenu
                                checkered={this.props.checkered}
                                setCheckered={this.props.setCheckered}
                                closeMenu={this.closeMenu.bind(this)}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}