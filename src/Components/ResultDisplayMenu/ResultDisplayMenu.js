import React, { Component } from 'react';
import "./ResultDisplayMenu.scss";



export default class ResultDisplayMenu extends Component {
    componentDidMount() {
        const radioName = this.props.bgIsCheckered ? "checkered" : "white";
        console.log(this.props.bgIsCheckered, radioName);
        document.getElementById(`ResultDisplayMenu__radio--${radioName}`).checked = true;
    }



    render() {
        return (
            <div className="ResultDisplayMenu">
                <h2>Background</h2>

                <div>
                    <div>
                        <label htmlFor="ResultDisplayMenu__radio--checkered">Checkered</label>

                        <input
                            id="ResultDisplayMenu__radio--checkered"
                            type="radio"
                            name="result-display-bg"
                            onChange={() => this.props.changeDisplayBg(true)}
                        />
                    </div>

                    <div>
                        <label htmlFor="ResultDisplayMenu__radio--white">White</label>

                        <input
                            id="ResultDisplayMenu__radio--white"
                            type="radio"
                            name="result-display-bg"
                            onChange={() => this.props.changeDisplayBg(false)}
                        />
                    </div>
                </div>

                <button>Close</button>
            </div>

        )
    }
}