import React from 'react';
import "./GradientSliderRuler.scss";



export default function GradientSliderRuler(props) {
    function renderRuler() {
        const bodyWith = document.querySelector("body").getBoundingClientRect().width;
        const gradientListWidth = bodyWith > 1000 ? bodyWith * 0.6 : bodyWith;
        const stroke = "rgba(255, 255, 255, 0.5)";

        if (props.units === "percentage") return (
            <svg>
                {
                    new Array(100).fill("").map((_, i) => {
                        const isTens = !(i % 10);
                        const widthSmallAndNotTens = gradientListWidth < 600 && !isTens;
                        const strokeColor = widthSmallAndNotTens ? "transparent" : !isTens ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.5)";
                        const y = i % 10 ? 40 : 30;

                        return <line x1={`${i}%`} y1={`${y}%`} x2={`${i}%`} y2={`${100 - y}%`} style={{ stroke: strokeColor, strokeWidth: 1 }} key={`helperStripes_${i}`} />
                    })
                }

                {/* LEFTMOST LINE */}
                <line x1="0" y1="0" x2="0" y2="100%" style={{ stroke, strokeWidth: 2 }} />

                {/* RIGHTMOST LINE */}
                <line x1="100%" y1="0" x2="100%" y2="100%" style={{ stroke, strokeWidth: 2 }} />

                {/* HORIZONTAL LINE */}
                <line x1="0" y1="50%" x2="100%" y2="50%" style={{ stroke, strokeWidth: 1 }} />

                {/*MIDDLE  LINE */}
                <line x1="50%" y1="20%" x2="50%" y2="80%" style={{ stroke, strokeWidth: 1 }} />
            </svg>
        );
    }



    return (
        <div className="GradientSliderRuler">
            {renderRuler()}
        </div>
    );
}