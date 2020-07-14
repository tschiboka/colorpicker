import { sortGradientByColorStopsPercentage } from "./slider";



const getHintString = (hints, colorStopArr, index, gradient, units) => {
    const maxValue = Number(gradient.max);
    let hintStr = "";

    if (hints.length) {
        const currentStop = colorStopArr[index].stop;
        let nextColorStop = colorStopArr[index + 1] ? colorStopArr[index + 1].stop : maxValue;

        const hintsInRange = hints.filter(hint => currentStop < hint && nextColorStop >= hint);
        const highestHint = hintsInRange.length ? Math.max(...hintsInRange) : undefined;

        if (highestHint) hintStr = ` ${highestHint}${units}`;
    }

    return hintStr;
}



const filterColorStops = gradients => {
    return gradients.map(gradient => {
        if (!gradient.repeating) return gradient;

        const filteredGradient = getImmutableGradientCopy(gradient);
        const filteredGradientColors = gradient.colors.filter(color => color.stop <= gradient.max);
        filteredGradient.colors = filteredGradientColors;

        return filteredGradient;
    });
}



const sortGradientsByColorStops = gradients => gradients
    .map(gradient => {
        return sortGradientByColorStopsPercentage(getImmutableGradientCopy(gradient));
    });




export function gradientObjsToStr(gradientArray) {
    gradientArray = gradientArray.map(gradient => {
        // if no ColorStop provided let it be transparent
        if (!gradient.colors.length) return {
            ...gradient,
            colors: [
                { color: "rgba(0, 0, 0, 0)", stop: 0 },
                { color: "rgba(0, 0, 0, 0)", stop: 100 }
            ]
        };
        // if only 1 ColorStop provided let it be form 0 - 100%
        else if (gradient.colors.length === 1) {
            return {
                ...gradient, colors: [
                    { color: gradient.colors[0].color, stop: 0 },
                    { color: gradient.colors[0].color, stop: 100 }
                ]
            };
        }

        return gradient;
    });

    const filteredGradientsByColorStops = filterColorStops(gradientArray);
    const sortedGradientsByColorStops = sortGradientsByColorStops(filteredGradientsByColorStops);


    return sortedGradientsByColorStops
        .filter(gradient => gradient.visible && hasValidMaxInput(gradient))
        .map(gradient => {
            const { colors } = gradient;
            const repeatingStr = gradient.repeating ? "repeating-" : "";
            const prefix = repeatingStr + gradient.type + "-gradient";
            const angle = gradient.angle + "deg, ";
            const hints = [...gradient.colorHints].sort((a, b) => a - b);
            const colorStops = colors.map((colorStop, index, colorStopArr) => {
                const units = gradient.repeatingUnit;
                const hintStr = getHintString(hints, colorStopArr, index, gradient, units);

                return `${colorStop.color} ${colorStop.stop}${units}${hintStr}`
            }).join(", ");


            if (gradient.type === "linear") {
                return `${prefix}(${angle}${colorStops})`;
            }

            if (gradient.type === "radial") {
                const shape = gradient.radial.shape ? gradient.radial.shape + " " : "";
                const size = gradient.radial.size ? gradient.radial.size + " " : "";
                const pos = gradient.radial.position.join(" ");
                const shapeSizePos = (shape || size || pos) ? shape + size + (pos && "at " + pos) + "," : "";
                const gradientStr = `radial-gradient(${shapeSizePos}${colorStops})`;

                return gradientStr;
            }

            return new Error("Illegal gradient type", gradient.type);
        }).join(",");
}



const defaultGradientObj = {
    name: "",
    visible: true,
    type: "linear",
    angle: "90",
    repeating: false,
    repeatingUnit: "%",
    max: 100,
    colorHints: [50],
    colors: [
        {
            color: "rgb(0, 0, 0)",
            stop: 0
        },
        {
            color: "rgba(255, 255, 255, 0.5)",
            stop: 100
        },
    ],
    radial: {
        shape: "ellipse",
        size: "50% 50%",
        position: ["50%", "50%"]
    }
};




// fix mutability issues of gradient obj by spreading
export const getDefaultGradientObj = () => {
    const gradient = {
        ...defaultGradientObj,
        colorHints: [...defaultGradientObj.colorHints],
        colors: [...defaultGradientObj.colors.map(color => Object.assign({}, color))],
        radial: { ...defaultGradientObj.radial }
    };

    return gradient;
}



export const getImmutableGradientCopy = gradient => {
    const copy = {
        ...gradient,
        colorHints: [
            ...gradient.colorHints
        ],
        colors: [
            ...gradient.colors.map(color => ({
                ...color
            }))
        ],
        radial: { ...gradient.radial }
    }

    return copy;
}



const maxStringNonZero = gradient => typeof gradient.max === "string" && gradient.max.length && gradient.max !== "0" && gradient.max !== "0.";
const maxNumberNonZero = gradient => typeof gradient.max === "number" && gradient.max !== 0;
const hasValidMaxInput = gradient => maxStringNonZero(gradient) || maxNumberNonZero(gradient);
export const gradientHasValidMaxInput = hasValidMaxInput;
