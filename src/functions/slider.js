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