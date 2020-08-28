import React from 'react';
import "./Animation.scss";



export default function Animation(props) {
    function renderLetters(letters) {
        return [...letters].map((letter, index) => <span key={`letter_${index}`}>{letter}</span>);
    }



    return (
        <div className="Animation">
            <div>{renderLetters("Gradient")}</div>

            <div><span>&</span></div>

            <div>{renderLetters("Pattern")}</div>

            <div>{renderLetters("Generator")}</div>
        </div>
    );
}