import React, { Component } from 'react';
import "./GradientSliderButtonBox.scss";



export default function gradientSliderButtonBox(props) {
    return (
        <div className="GradientSliderButtonBox">
            <div>
                <button
                    title="add color hint [click on the slider]"
                    onClick={() => props.setButtonStates({...props.buttonStates, colorHintOn: true, colorStopOn: false})}
                >
                    &#9675;

                    <div className={`btn--${props.buttonStates.colorHintOn ? "active" : "inactive"}`}></div>
                </button>

                <button
                    title="add color stop [click on the slider]"
                onClick={() => props.setButtonStates({...props.buttonStates, colorStopOn: true, colorHintOn: false})}
                >
                    &#11216;

                    <div className={`btn--${props.buttonStates.colorStopOn ? "active" : "inactive"}`}></div>
                </button>
            </div>

            <div>
                <button
                    title="delete color stop [click on slider thumb]"
                    onClick={() => props.setButtonStates({...props.buttonStates, deleteOn: !props.buttonStates.deleteOn})}
                >
                    Del
                    
                    <div className={`btn--${props.buttonStates.deleteOn ? "active" : "inactive"}`}></div>
                </button>
            </div>
        </div>

    );
}
