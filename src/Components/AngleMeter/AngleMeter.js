import React, { Component } from 'react';
import "./AngleMeter.scss";



export default class AngleMeter extends Component {
    handleMeterOnMouseDown(event) {
        const mouseStartX = event.clientX || event.pageX || event.touches[0].clientX;
        const mouseStartY = event.clientY || event.pageY || event.touches[0].clientY;

        this.props.setAngleMeterIsActive(this.props.index, mouseStartX, mouseStartY);

        event.stopPropagation();
        event.preventDefault();
    }



    render() {
        console.log(this.props.activeAngleMeter)
        return (
            <div
                className="AngleMeter"
                id={`AnmgleMeter_${this.props.index}`}
            >
                <svg
                    id={`AngleMeter__meter_${this.props.index}`}
                    className="AngleMeter__meter"
                    style={{
                        transform: `rotate(${this.props.gradient.angle}deg)`
                    }}
                    onMouseDown={e => this.handleMeterOnMouseDown(e)}
                    onTouchStart={e => this.handleMeterOnMouseDown(e)}
                >
                    <defs>
                        <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" style={{ "stop-color": "#1a1a1a", "stop-opacity": 0 }} />

                            <stop offset="100%" style={{ "stop-color": "#0c0c0c", "stop-opacity": 1 }} />
                        </radialGradient>
                    </defs>
                    <circle cx="25" cy="25" r="22" fill="url(#grad1)" />

                    <line x1="25" y1="25" x2="25" y2="3" />
                </svg>
            </div>
        );
    }
}