import React, { Component } from 'react';
import "./ColorPicker.scss";

export default class ColorPicker extends Component {
    constructor(props) {
        super(props);

        this.componentRef = React.createRef();
        this.state = { coords: { x: 0, y: 0 } };
    }



    componentDidUpdate(prevProps) {
        // refresh coordinawtes if component was not visible previously
        if (!prevProps.visible) {

            var X, Y;
            // if X and Y coordinates are provided, place it there
            if (this.props.X && this.props.Y) [X, Y] = [this.props.X, this.props.Y];
            // otherwise place it in the middle of the screen
            else {
                const docHeight = document.body.clientHeight;
                const docWidth = document.body.clientWidth;
                const selfHeight = this.componentRef.current.getBoundingClientRect().height;
                const selfWidth = this.componentRef.current.getBoundingClientRect().width;

                X = Math.round((docWidth / 2) - (selfWidth / 2));
                Y = Math.round((docHeight / 2) - (selfHeight / 2));
            }

            this.setState({ ...this.state, coords: { x: X, y: Y } });
        }
    }



    render() {
        return (
            this.props.visible ? (
                <div
                    className="ColorPicker"
                    ref={this.componentRef}
                    style={{ left: this.state.coords.x + "px", top: this.state.coords.y + "px", background: "red" }}
                >
                    <div className="ColorPicker__header">Color Picker</div>

                    <div className="ColorPicker__palette"></div>

                    <div className="ColorPicker__spectrum"></div>

                    <div className="ColorPicker__alpha"></div>
                </div>)
                : null
        );
    }
}