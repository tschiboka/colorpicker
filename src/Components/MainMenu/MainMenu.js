import React, { Component } from 'react';
import { ToggleButton } from "../ToggleButton/ToggleButton";
import "./MainMenu.scss";



export default class MainMenu extends Component {
    render() {
        return (
            <div className="MainMenu">
                <div>
                    <p>Save</p>

                    <input type="text" name="" id="" />
                </div>

                <div>
                    <p>Open</p>

                    <input type="text" name="" id="" />
                </div>

                <div>
                    <p>Predefined</p>

                    <input type="text" />
                </div>

                <div>
                    <p>Display backgrund is checkered</p>

                    <ToggleButton
                        on={this.props.checkered}
                        handleOnClick={() => this.props.setCheckered(!this.props.checkered)}
                    />

                </div>

                <div>
                    <button onClick={() => this.props.closeMenu()}>Close</button>
                </div>
            </div>
        )
    }
}