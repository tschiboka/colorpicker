import React from 'react';
import "./Animation.scss";



export default function Animation(props) {
    function renderLetters(letters) {
        return [...letters].map((letter, index) => (
            <span key={`letter_${index}`}>
                {letter}
            </span>)
        );
    }



    return (
        <div className="Animation">
            <div className="Animation__zig-zag"></div>

            <div className="Animation__text">{renderLetters("Gradient")}</div>

            <div className="Animation__text"><span>&</span></div>

            <div className="Animation__text">{renderLetters("Pattern")}</div>

            <div className="Animation__text">{renderLetters("Generator")}</div>

            <div className="Animation__zig-zag"></div>
        </div>
    );
}