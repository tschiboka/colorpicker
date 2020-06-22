export function gradientObjsToStr(grdObj) {
    return grdObj.map(grad => {
        const { colors } = grad;
        const prefix = (grad.direction === "radial" ? "radial" : "linear") + "-gradient";
        const degree = grad.direction === "radial" ? "" : grad.direction + "deg, ";
        const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(",");

        return `${prefix}(${degree}${colorStops})`;
    }).join(",");
}



export const defaultGradientObj = {
    name: "",
    visible: true,
    direction: "90",
    colors: [
        { color: "rgba(0, 0, 0, 1)", stop: 0 },
        { color: "rgba(255, 255, 255, 0.5)", stop: 100 }
    ]
};