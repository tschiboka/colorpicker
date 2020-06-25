export const getCumulativeOffset = elem => {
    let left = 0;
    do {
        left += elem.offsetLeft || 0;
        elem = elem.offsetParent;
    } while (elem);

    return left;
}