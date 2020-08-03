import { sortGradientByColorStopsPercentage } from "./slider";
import { produce } from 'immer';



const getHintString = (hints, colorStopArr, index, gradient, units) => {
    const maxValue = Number(gradient.max);
    let hintStr = "";

    if (hints.length) {
        const currentStop = colorStopArr[index].stop;
        let nextColorStop = colorStopArr[index + 1] ? colorStopArr[index + 1].stop : maxValue;

        const hintsInRange = hints.filter(hint => currentStop < hint && nextColorStop >= hint);
        const highestHint = hintsInRange.length ? Math.max(...hintsInRange) : undefined;

        if (highestHint) hintStr = ` ${highestHint}${units}`;
    }

    return hintStr;
}



const filterColorStops = gradients => {
    return gradients.map(gradient => {
        if (!gradient.repeating) return gradient;

        const filteredGradientColors = gradient.colors.filter(color => color.stop <= gradient.max);
        const filteredGradient = produce(getImmutableGradientCopy(gradient), draft => {
            draft.colors = filteredGradientColors;
        });

        return filteredGradient;
    });
}



const sortGradientsByColorStops = gradients => gradients
    .map(gradient => {
        return sortGradientByColorStopsPercentage(getImmutableGradientCopy(gradient));
    });




export function gradientObjsToStr(gradientArray) {
    gradientArray = gradientArray.map(gradient => {
        // if no ColorStop provided let it be transparent
        if (!gradient.colors.length) return {
            ...gradient,
            colors: [
                { color: "rgba(0, 0, 0, 0)", stop: 0 },
                { color: "rgba(0, 0, 0, 0)", stop: 100 }
            ]
        };
        // if only 1 ColorStop provided let it be form 0 - 100%
        else if (gradient.colors.length === 1) {
            return {
                ...gradient, colors: [
                    { color: gradient.colors[0].color, stop: 0 },
                    { color: gradient.colors[0].color, stop: 100 }
                ]
            };
        }

        return gradient;
    });

    const filteredGradientsByColorStops = filterColorStops(gradientArray);
    const sortedGradientsByColorStops = sortGradientsByColorStops(filteredGradientsByColorStops);


    return sortedGradientsByColorStops
        .filter(gradient => gradient.visible && hasValidMaxInput(gradient))
        .map(gradient => {
            // COLOR STOPS
            const { colors } = gradient;
            const repeatingStr = gradient.repeating ? "repeating-" : "";
            const prefix = repeatingStr + gradient.type + "-gradient";
            const angle = gradient.angle + "deg, ";
            const hints = [...gradient.colorHints].sort((a, b) => a - b);
            const colorStops = colors.map((colorStop, index, colorStopArr) => {
                const units = gradient.repeatingUnit;
                const hintStr = getHintString(hints, colorStopArr, index, gradient, units);

                return `${colorStop.color} ${colorStop.stop}${units}${hintStr}`
            }).join(", ");

            // BACKGROUND

            // POSITION
            const posX = { ...gradient.background.position[0] };
            const posY = { ...gradient.background.position[1] };
            let position = "";

            // if any keyword (top, bottom) set
            if (posX.keyword || posY.keyword) {
                const positionX = `${posX.keyword || "top"} ${posX.value ? posX.value + posX.unit : "0"}`;
                const positionY = `${posY.keyword || "left"} ${posY.value ? posY.value + posY.unit : "0"}`;
                position = positionX + " " + positionY;
            }
            else if (posX.value || posY.value) {
                position = `${posX.value ? posX.value + posX.unit : "0"} ${posY.value ? posY.value + posY.unit : "0"}`;
            }

            // SIZE
            const sizeX = { ...gradient.background.size.x };
            const sizeY = { ...gradient.background.size.y };
            let size = "";

            if (sizeX.value || sizeY.value) {
                size = `${sizeX.value ? sizeX.value + sizeX.unit : "0"} ${sizeY.value ? sizeY.value + sizeY.unit : "0"}`;
            }

            const posAndSize = size ? `${position || "0 0"} / ${size}` : position;

            const background = posAndSize + (gradient.background.repeat ? " " + gradient.background.repeat : "");

            // LINEAR / RADIAL
            if (gradient.type === "linear") {
                return `${prefix}(${angle}${colorStops})${background ? " " + background : ""}`;
            }

            if (gradient.type === "radial") {
                const shape = gradient.radial?.shape ? gradient.radial.shape + " " : "";
                const size = gradient.radial?.size?.keyword
                    ? gradient.radial.size.keyword.join("-")
                    : "";
                const pos = gradient.radial?.position ? gradient.radial.position.join(" ") : " ";
                //const shapeSizePos = (shape || size || pos) ? shape + size + (pos && "at " + pos) + "," : "";
                const shapeSizePos = shape + size + ((shape || size || pos) ? "," : "");
                console.log(`${prefix}(${shapeSizePos}${colorStops}${background ? " " + background : ""})`);
                return `${prefix}(${shapeSizePos}${colorStops}${background ? " " + background : ""})`;
            }

            return new Error("Illegal gradient type", gradient.type);
        }).join(",");
}



const defaultGradientObj = {
    name: "",
    visible: true,
    type: "linear",
    angle: "90",
    repeating: false,
    repeatingUnit: "%",
    max: 100,
    colorHints: [50],
    colors: [
        { color: "rgb(0, 0, 0)", stop: 0 },
        { color: "rgba(255, 255, 255, 0.5)", stop: 100 },
    ],
    radial: undefined,
    background: {
        position: [
            { keyword: undefined, value: undefined, unit: undefined },
            { keyword: undefined, value: undefined, unit: undefined },
        ],
        size: {
            x: { value: undefined, unit: undefined },
            y: { value: undefined, unit: undefined }
        },
        repeat: undefined,
    }
};



export const getDefaultGradientObj = () => produce(defaultGradientObj, draft => {
    draft.name = "";
    draft.visible = true;
    draft.type = "linear";
    draft.angle = "90";
    draft.repeating = false;
    draft.repeatingUnit = "%";
    draft.max = 100;
    draft.colorHints = [50];
    draft.colors = [{ color: "rgb(0, 0, 0)", stop: 0 }, { color: "rgba(255, 255, 255, 0.5)", stop: 100 },];
    draft.radial = undefined;
    draft.background = {
        position: [
            { keyword: undefined, value: undefined, unit: undefined },
            { keyword: undefined, value: undefined, unit: undefined },],
        size: {
            x: { value: undefined, unit: undefined },
            y: { value: undefined, unit: undefined }
        },
        repeat: undefined,
    };
});



export const getImmutableGradientCopy = gradient => produce(gradient, draft => {
    draft = gradient;
});



const maxStringNonZero = gradient => typeof gradient.max === "string" && gradient.max.length && gradient.max !== "0" && gradient.max !== "0.";
const maxNumberNonZero = gradient => typeof gradient.max === "number" && gradient.max !== 0;
const hasValidMaxInput = gradient => maxStringNonZero(gradient) || maxNumberNonZero(gradient);
export const gradientHasValidMaxInput = hasValidMaxInput;
