import { getDefaultGradientObj } from "./gradient";



// get elements left distance from window
export const getCumulativeOffset = elem => {
    let left = 0;
    do {
        left += elem.offsetLeft || 0;
        elem = elem.offsetParent;
    } while (elem);

    return left;
}



export const mousePos = (event, index) => {
    const thumbBoxDiv = document.querySelector(`#GradientSlider__thumbs-box${index}`);
    const offsetLeft = getCumulativeOffset(thumbBoxDiv);
    const mouseAbsolutePos = event.clientX || event.pageX;
    const mouseRelativePos = mouseAbsolutePos - offsetLeft;

    return mouseRelativePos;
}



export const sortGradientByColorStopsPercentage = gradient => {
    const sortedColors = gradient.colors.sort((a, b) => a.stop - b.stop);
    const sortedGradient = { ...gradient, colors: sortedColors };

    return sortedGradient;
}



export const filterIdenticalColorPercentages = gradient => {
    const existingColorStops = [];

    const filteredGradientColors = gradient.colors
        .reverse() // reverse in order to delete the one below
        .filter(colorStop => {
            if (existingColorStops.indexOf(colorStop.stop) === -1) {
                existingColorStops.push(colorStop.stop);
                return colorStop;
            }
            else return false;
        })
        .reverse();

    const filteredGradient = { ...gradient, colors: filteredGradientColors };

    return filteredGradient;
}



// all gradients need to have a 0% and a 100% color stop
// if any missing give default color stops
export const correctGradientEdges = gradient => {
    const updatedGradient = { ...gradient };
    const defaultGradient = getDefaultGradientObj();
    console.log(defaultGradient);
    //if (updatedGradient.colors[0].stop != 0) gradient.colors.unshift()
}