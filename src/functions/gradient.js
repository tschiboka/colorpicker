import { sortGradientByColorStopsPercentage } from "./slider";



export function gradientObjsToStr(gradientArray) {
    const defaultGradColors = [
        { color: "rgba(0, 0, 0, 0)", stop: 0 },
        { color: "rgba(0, 0, 0, 0)", stop: 100 }
    ];
    gradientArray = gradientArray.map(grad => !grad.colors.length ? { ...grad, colors: defaultGradColors } : grad);

    const sortedByPercentage = gradientArray.map(grad => sortGradientByColorStopsPercentage(getImmutableGradientCopy(grad)));

    return sortedByPercentage
        .filter(grad => grad.visible)
        .map(grad => {
            const { colors } = grad;
            const prefix = (grad.angle === "radial" ? "radial" : "linear") + "-gradient";
            const degree = grad.angle === "radial" ? "" : grad.angle + "deg, ";
            const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(",");

            return `${prefix}(${degree}${colorStops})`;
        }).join(",");
}



const defaultGradientObj = {
    name: "",
    visible: true,
    angle: "90",
    units: "percentage",
    repeating: false,
    max: undefined,
    colors: [
        {
            color: "rgba(0, 0, 0, 1)",
            stop: 0
        },
        {
            color: "rgba(255, 255, 255, 0.5)",
            stop: 100
        },
    ]
};




// fix mutability issues of gradient obj by spreading
export const getDefaultGradientObj = () => {
    const gradient = {
        ...defaultGradientObj,
        colors: [...defaultGradientObj.colors.map(color => Object.assign({}, color))]
    };

    return gradient;
}



export const getImmutableGradientCopy = gradient => {
    const copy = {
        ...gradient,
        colors: [
            ...gradient.colors.map(color => ({
                ...color
            }))
        ]
    }

    return copy;
}