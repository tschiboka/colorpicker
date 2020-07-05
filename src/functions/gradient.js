import { sortGradientByColorStopsPercentage } from "./slider";



export function gradientObjsToStr(gradientArray) {
    console.log([...gradientArray]);
    gradientArray = gradientArray.map(grad => {
        // if no ColorStop provided let it be transparent
        if (!grad.colors.length) return {
            ...grad,
            colors: [
                { color: "rgba(0, 0, 0, 0)", stop: 0 },
                { color: "rgba(0, 0, 0, 0)", stop: 100 }
            ]
        };
        // if only 1 ColorStop provided let it be form 0 - 100%
        else if (grad.colors.length === 1) {
            return {
                ...grad, colors: [
                    { color: grad.colors[0].color, stop: 0 },
                    { color: grad.colors[0].color, stop: 100 }
                ]
            };
        }

        return grad;
    });

    const sortedByPercentage = gradientArray.map(grad => sortGradientByColorStopsPercentage(getImmutableGradientCopy(grad)));

    return sortedByPercentage
        .filter(grad => grad.visible)
        .map(grad => {
            const { colors } = grad;
            const prefix = grad.type + "-gradient";
            const angle = grad.angle + "deg, ";
            const hints = [...grad.colorHints].sort((a, b) => a - b);
            const colorStops = colors.map((colorStop, index, colorStopArr) => {
                let hintStr = "";
                const maxValue = 100;
                const units = grad.units === "percentage" ? "%" : "";

                if (hints.length) {
                    const currentStop = colorStop.stop;
                    let nextColorStop = colorStopArr[index + 1] ? colorStopArr[index + 1].stop : maxValue;

                    const hintsInRange = hints.filter(hint => currentStop < hint && nextColorStop >= hint);
                    const highestHint = hintsInRange.length ? Math.max(...hintsInRange) : undefined;

                    if (highestHint) hintStr = ` ${highestHint}${units}`;
                }

                return `${colorStop.color} ${colorStop.stop}${units}${hintStr}`
            }).join(",");

            if (grad.type === "linear") return `${prefix}(${angle}${colorStops})`;

            if (grad.type === "radial") {
                const shape = grad.radial.shape ? grad.radial.shape + " " : "";
                const size = grad.radial.size ? grad.radial.size + " " : "";
                const shapeAndSize = (shape || size) ? shape + size + ", " : "";
                const gradientStr = `radial-gradient(${shapeAndSize}${colorStops})`;

                console.log(gradientStr);
                return gradientStr;
            }
        }).join(",");
}



const defaultGradientObj = {
    name: "",
    visible: true,
    type: "linear",
    angle: "90",
    units: "percentage",
    repeating: false,
    max: undefined,
    colorHints: [50],
    colors: [
        {
            color: "rgba(0, 0, 0, 1)",
            stop: 0
        },
        {
            color: "rgba(255, 255, 255, 0.5)",
            stop: 100
        },
    ],
    radial: {
        shape: "ellipse",
        size: "6% 6%",//"farthest-corner",
        position: ["center", "center"]
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