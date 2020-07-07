import React from 'react';
import "./GradientSliderRuler.scss";



export default function GradientSliderRuler(props) {
    function renderRuler() {
        const bodyWith = document.querySelector("body").getBoundingClientRect().width;
        const gradientListWidth = bodyWith > 1000 ? bodyWith * 0.6 : bodyWith;

        if (!props.gradient.repeating) return (
            <svg>
                {
                    new Array(100).fill("").map((_, i) => {
                        const isTens = !(i % 10);
                        const widthSmallAndNotTens = gradientListWidth < 600 && !isTens;
                        const strokeStrength = widthSmallAndNotTens ? "transparent" : !isTens ? "light" : "strong";
                        const y = i % 10 ? 30 : 20;

                        return <line className={`ruler-grooves--${strokeStrength}`} x1={`${i}%`} y1={`${y}%`} x2={`${i}%`} y2={`${100 - y}%`} key={`helperStripes_${i}`} />
                    })
                }

                {/* HORIZONTAL LINE */}
                <line x1="0" y1="50%" x2="100%" y2="50%" />

                {/* LEFTMOST LINE */}
                <line x1="0" y1="0" x2="0" y2="100%" />

                {/* RIGHTMOST LINE */}
                <line x1="100%" y1="0" x2="100%" y2="100%" />
            </svg>
        );
    }



    return (
        <div className="GradientSliderRuler">
            {renderRuler()}
        </div>
    );
}