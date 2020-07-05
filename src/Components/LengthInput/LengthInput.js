import React, { Component } from 'react';
import "./LengthInput.scss";



export default class LengthInput extends Component {
    render() {
        return (
            <div className="LengthInput">
                <input type="text" />

                <div>%</div>

                <div>&#709;</div>
            </div>
        );
    }
}