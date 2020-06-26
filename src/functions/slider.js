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
    const mouseAbsoluteStartPos = event.clientX || event.pageX;
    const mouseRelativeStartPos = mouseAbsoluteStartPos - offsetLeft;

    return mouseRelativeStartPos;
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