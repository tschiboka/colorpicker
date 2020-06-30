import { getDefaultGradientObj } from "./gradient";



// get elements left distance from window
export const getCumulativeOffset = elem => {
    let left = 0;
    do {
        left += elem.offsetLeft || 0;
        elem = elem.offsetParent;
    } while (elem);

    return left;
};



export const mousePos = (event, selector) => {
    const onMouseDiv = document.querySelector(selector);
    const offsetLeft = getCumulativeOffset(onMouseDiv);
    const mouseAbsolutePos = event.clientX || event.pageX || event.touches[0].clientX;
    const mouseRelativePos = mouseAbsolutePos - offsetLeft;

    return mouseRelativePos;
};



export const sortGradientByColorStopsPercentage = gradient => {
    const sortedColors = gradient.colors.sort((a, b) => a.stop - b.stop);
    const sortedGradient = { ...gradient, colors: sortedColors };

    return sortedGradient;
};



export const filterIdenticalColorPercentages = (gradient, activeThumbIndex) => {
    const updatedGradient = { ...gradient };

    // filter out identical colorStops if active thumb is provided active index 
    // will overwrite any existing colorStops with the same colorStop stop value

    if (activeThumbIndex !== undefined) {
        const colorStopToFilter = updatedGradient.colors[activeThumbIndex].stop;
        updatedGradient.colors = updatedGradient.colors.filter((color, index) => {
            return index === activeThumbIndex || color.stop !== colorStopToFilter;
        });
    }



    // filter out identical colorStops even if no active thumb 
    // is provided in order to make sure stops will not collide

    const existingColorStops = [];

    const filteredGradientColors = updatedGradient.colors
        .reverse() // reverse in order to delete the one below
        .filter(colorStop => {
            if (existingColorStops.indexOf(colorStop.stop) === -1) {
                existingColorStops.push(colorStop.stop);
                return colorStop;
            }
            else return false;
        })
        .reverse();
    return { ...gradient, colors: filteredGradientColors };
};



// all gradients need to have a 0% and a 100% color stop
// if any missing give default color stops
export const correctGradientEdges = gradient => {
    let updatedGradientColors = { ...gradient }.colors;
    const [_0Percent, _100Percent] = { ...getDefaultGradientObj() }.colors;

    if (gradient.colors[0].stop !== 0) updatedGradientColors = [_0Percent, ...updatedGradientColors];

    if (gradient.colors[gradient.colors.length - 1].stop !== 100) updatedGradientColors = [...updatedGradientColors, _100Percent];

    return { ...gradient, colors: updatedGradientColors };
};



export const setZIndexAscending = index => {
    const measureBoxChildren = document.getElementById(`GradientSlider__measure-text-box${index}`).children;
    const thumbBoxChildren = document.getElementById(`GradientSlider__thumbs-box${index}`).children;
    const elemGroups = [...thumbBoxChildren].map((_, i) => [measureBoxChildren[i], thumbBoxChildren[i]]);

    elemGroups.forEach((children, i) => children.forEach(child => child.style.zIndex = i + 100));
};



export const getPercentToFixed = (wholeInput, fractionInput, decimalPlaces = 1, limit0_to_100 = true) => {
    let percentage = fractionInput / wholeInput * 100;
    percentage = Number(percentage.toFixed(percentage % 1 !== 0 ? decimalPlaces : 0));

    if (limit0_to_100) {
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;
    }

    return percentage;
};



export const calculateAngle = (startX, startY, currX, currY) => {
    const deltaX = currX - startX;
    const deltaY = currY - startY;
    const angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI + 90;

    return Math.round(angle < 0 ? 360 + angle : angle);
};