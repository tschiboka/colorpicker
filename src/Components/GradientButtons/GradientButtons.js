import React, { Component } from 'react';
import "./GradientButtons.scss";



export default class GradientButtons extends Component {
    render() {
        return (
            <div className="GradientButtons">
                <div>
                    <button>&rarr;</button>

                    <button>&larr;</button>
                </div>

                <div>
                    <button>&uarr;</button>

                    <button>&darr;</button>
                </div>

                <div>
                    <button>&#x2196;</button>

                    <button>&#x2197;</button>

                    <button>&#x2199;</button>

                    <button>&#x2198;</button>
                </div>

                <div>
                    <button>&#x25A5;</button>
                </div>

                <div>
                    <button>&#9678;</button>
                </div>

                <div>
                    <button>degree</button>
                </div>
            </div>
        );
    }
}