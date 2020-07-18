import React, { Component } from 'react';
import "./BackgroundSettings.scss";



export default class BackgroundSettings extends Component {
    render() {
        const gradient = this.props.gradients[this.props.index];

        return (
            <div
                className="BackgroundSettings"
                onClick={(e) => { e.stopPropagation() }}
            >
                <div className="BackgroundSettings__header">
                    <span>
                        Background Settings of [
                    <span>{gradient.name}</span>
                ] gradient</span>

                    <button onClick={() => this.props.openRadialSettings(false, this.props.index, false)}>
                        &times;
                </button>
                </div>


            </div>
        );
    }
}