export function gradientObjsToStr(grdObj) {
    console.log(grdObj);
    return grdObj.map(grad => {
        const { colors } = grad;
        const prefix = (grad.direction === "radial" ? "radial" : "linear") + "-gradient";
        const degree = grad.direction === "radial" ? "" : grad.direction + "deg, ";
        const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(",");

        return `${prefix}(${degree}${colorStops})`;
    }).join(",");
}