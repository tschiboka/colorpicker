import React, { Component } from 'react';
import "./MainMenu.scss";



export default class MainMenu extends Component {
    componentDidMount() {
        const radioName = this.props.bgIsCheckered ? "checkered" : "white";
        console.log(this.props.bgIsCheckered, radioName);
        document.getElementById(`MainMenu__radio--${radioName}`).checked = true;
    }



    render() {
        return (
            <div className="MainMenu">
                <h2>Background</h2>

                <div>
                    <div>
                        <label
                            htmlFor="MainMenu__radio--checkered"
                            title="checkered background"
                        >Checkered</label>

                        <input
                            id="MainMenu__radio--checkered"
                            type="radio"
                            name="result-display-bg"
                            title="checkered background"
                            onChange={() => this.props.changeDisplayBg(true)}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="MainMenu__radio--white"
                            title="white background"
                        >White</label>

                        <input
                            id="MainMenu__radio--white"
                            type="radio"
                            name="result-display-bg"
                            title="white background"
                            onChange={() => this.props.changeDisplayBg(false)}
                        />
                    </div>
                </div>

                <button onClick={() => this.props.closeMenu()}>Close</button>
            </div>
        )
    }
}