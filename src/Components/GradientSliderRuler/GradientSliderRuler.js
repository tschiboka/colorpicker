import React from 'react';
import "./GradientSliderRuler.scss";



export default function GradientSliderRuler(props) {
    function renderRuler() {
        const bodyWith = document.querySelector("body").getBoundingClientRect().width;
        const gradientListWidth = bodyWith > 1000 ? bodyWith * 0.6 : bodyWith; // need a way to estimate width before rendering component
        const max = Number(props.gradient.max);
        const step = 100 / max;
        const iteration = max % 1 ? max * 10 : max;

        if (!max) return false;

        return (
            <svg>
                {new Array(iteration).fill(0).map((_, i) => {
                    if (max > 150 && i % 10) return false;
                    if (max > 1500 && i % 100) return false;

                    let isPrimaryGroove = false;
                    if (max <= 150 && !(i % 10)) isPrimaryGroove = true;
                    if (max > 150 && max <= 1500 && !(i % 100)) isPrimaryGroove = true;
                    if (max > 1500 && !(i % 1000)) isPrimaryGroove = true;

                    const isTransparent = gradientListWidth < 600 && !isPrimaryGroove;
                    const strokeStrength = isTransparent ? "transparent" : !isPrimaryGroove ? "light" : "strong";
                    const y = isPrimaryGroove ? 20 : 30;

                    // GROOVE LINES [PER PERCENTAGE]
                    return <line
                        key={`helperStripes_${i}`}
                        className={`ruler-grooves--${strokeStrength}`}
                        x1={`${i * step}%`}
                        y1={`${y}%`}
                        x2={`${i * step}%`}
                        y2={`${100 - y}%`}
                    />
                })}

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