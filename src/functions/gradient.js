export function gradientObjsToStr(grdObj) {
    return grdObj
        .filter(grad => grad.visible)
        .map(grad => {
            const { colors } = grad;
            const prefix = (grad.direction === "radial" ? "radial" : "linear") + "-gradient";
            const degree = grad.direction === "radial" ? "" : grad.direction + "deg, ";
            const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(",");

            return `${prefix}(${degree}${colorStops})`;
        }).join(",");
}



const defaultGradientObj = {
    name: "",
    visible: true,
    direction: "90",
    repeating: false,
    colors: [
        { color: "rgba(0, 0, 0, 1)", stop: 0 },
        { color: "rgba(255, 255, 255, 0.5)", stop: 100 },
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