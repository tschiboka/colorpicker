import React, { Component } from 'react';
import "./AngleMeter.scss";



export default class AngleMeter extends Component {
    handleMeterOnMouseDown(event) {
        //const mouseX = 
    }



    render() {
        return (
            <div
                className="AngleMeter"
                id={`AnmgleMeter_${this.props.index}`}
            >
                <svg
                    id={`AngleMeter__meter_${this.props.index}`}
                    className="AngleMeter__meter"
                    width="50"
                    height="50"
                    style={{
                        transform: `rotate(${this.props.gradient.angle}deg)`
                    }}
                    onMouseDown={e => this.handleMeterOnMouseDown(e)}
                >
                    <circle cx="25" cy="25" r="22" fill="transparent" stroke="#888" />

                    <line x1="25" y1="25" x2="25" y2="3" stroke="#888" />
                </svg>
            </div>
        );
    }
}