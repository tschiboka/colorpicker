import React, { Component } from 'react';
import "./GradientField.scss";



export default class GradientField extends Component {
    render() {
        return (
            <div className="GradientField">
                <header>
                    <div className="GradientField__index">{this.props.index + 1}</div>

                    <div className="GradientField__name">
                        {this.props.gradient.name || `Untitled ${this.props.index + 1}`}
                    </div>

                    <div className="GradientField__button-box">
                        <button title="insert new gradient above">&#8613;</button>

                        <button title="insert new gradient below">&#8615;</button>

                        <button title="reposition gradient">&#8645;</button>

                        <button title="visibility">&#128065;</button>

                        <button title="delete gradient">&times;</button>
                    </div>
                </header>
                <div className="GradientField__body">
                    BODY
                </div>
            </div>
        );
    }
}