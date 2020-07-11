import React, { Component } from 'react';
import "./AngleMeter.scss";



export default class AngleMeter extends Component {
    constructor(props) {
        super(props);

        this.state = { onMouseOver: false }
    }



    handleMeterOnMouseDown(event) {
        const mouseStartX = event.clientX || event.pageX || event.touches[0].clientX;
        const mouseStartY = event.clientY || event.pageY || event.touches[0].clientY;

        this.props.setAngleMeterIsActive(this.props.index, mouseStartX, mouseStartY);

        event.stopPropagation();
        event.preventDefault();
    }



    render() {
        return (
            <div
                className="AngleMeter"
                id={`AngleMeter_${this.props.index}`}
            >
                <svg>
                    <line x1="30" y1="0" x2="30" y2="60" />

                    <line x1="30" y1="2" x2="30" y2="58" />

                    <line x1="30" y1="0" x2="30" y2="60" />

                    <line x1="30" y1="2" x2="30" y2="58" />

                    <line x1="30" y1="0" x2="30" y2="60" />

                    <line x1="30" y1="2" x2="30" y2="58" />

                    <line x1="30" y1="0" x2="30" y2="60" />

                    <line x1="30" y1="2" x2="30" y2="58" />

                    <line x1="30" y1="0" x2="30" y2="60" />

                    <line x1="30" y1="2" x2="30" y2="58" />

                    <line x1="30" y1="0" x2="30" y2="60" />

                    <line x1="30" y1="2" x2="30" y2="58" />

                    <circle cx="30" cy="30" r="26" />
                </svg>

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
                        <radialGradient id="gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" style={{ "stopColor": "#1a1a1a", "stopOpacity": 1 }} />

                            <stop offset="100%" style={{ "stopColor": "#0c0c0c", "stopOpacity": 1 }} />
                        </radialGradient>

                        <radialGradient id="gradientInverse" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                            <stop offset="0%" style={{ "stopColor": "#0c0c0c", "stopOpacity": 1 }} />

                            <stop offset="100%" style={{ "stopColor": "#1a1a1a", "stopOpacity": 1 }} />
                        </radialGradient>

                    </defs>

                    <circle
                        cx="30" cy="30" r="23"
                        fill={(this.props.activeAngleMeter === this.props.index || this.state.onMouseOver) ? "url(#gradientInverse)" : "url(#gradient)"}
                        onMouseOver={() => this.setState({ ...this.state, onMouseOver: true })}
                        onMouseLeave={() => this.setState({ ...this.state, onMouseOver: false })}
                    />

                    <line x1="30" y1="26" x2="30" y2="13" />

                    <line x1="30" y1="25" x2="30" y2="15" />
                </svg>
            </div>
        );
    }
}