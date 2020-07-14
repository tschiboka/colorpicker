import React, { Component } from 'react';
import gearIcon from "../../images/gear.png";
import gearActiveIcon from "../../images/gear_active.png";
import copyIcon from "../../images/copy.png";
import copyActiveIcon from "../../images/copy_active.png";
import checkeredBg from "../../images/checkered_rect.png";
import { getImmutableGradientCopy } from "../../functions/gradient";
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb } from "../../functions/colors";
import "./Code.scss";



function ColorPreview(props) {
    const color = props.color ? `linear-gradient(${props.color}, ${props.color}) ,` : "";
    console.log(color);

    return (
        <div
            className="ColorPreview"
            style={{ backgroundImage: `${color}url(${checkeredBg})` }}
        ></div>
    )
}




export default class Code extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settingsButtonHover: false,
            copyButtonHover: false,
            convertCssNamedColorsWherePossible: true,
            preferredColorFormat: undefined,
            cssColorNames: require("../../constants/color_templates/cssColors.json")
        }
    }



    getCopyButtonImage() {
        const img = this.state.copyButtonHover ? copyActiveIcon : copyIcon;
        return `url(${img})`;
    }



    getGearButtonImage() {
        const img = this.state.settingsButtonHover ? gearActiveIcon : gearIcon;
        return `url(${img})`;
    }



    // ********************* PARSING FUNCTIONS **********************



    renderAngleParameter(gradient) {
        if (gradient.type === "linear") return (
            <span>
                <span className="token number">{gradient.angle}</span>

                <span className="token unit">deg</span>

                <span className="token punctuation">, </span>
            </span>
        );
    }



    renderUnit(size) {
        return size
            .match(/[0-9.]+(%|px|vw|vh|em|rem)/g)
            .map((sizeStr, index, sizeArr) => (
                <span key={`size-span-radial-units-${index}`}>
                    <span className="token number">{sizeStr.match(/[0-9.]+/g)}</span>

                    <span className="token unit">{sizeStr.match(/(%|px|vw|vh|em|rem)/g)}</span>

                    {sizeArr.length > 1 && !index && <span> </span>/* trailing whitespace */}
                </span>));
    }



    renderShapeSizePosition(gradient) {
        const isRadial = gradient.type === "radial";
        const { shape, size, position } = gradient.radial;
        const isUnit = str => /\d/g.test(str);

        if (isRadial) return (
            <span>
                {shape && <span className="token keyword">{shape}</span>}

                {(size && shape) && <span> </span>/* leading whitespace */}

                {
                    isUnit(size)
                        ? this.renderUnit(size)
                        : <span className="token keyword">{size}</span>
                }

                {((size || shape) && position) && <span> </span>/* leading whitespace */}

                {
                    position.map((pos, index, posArr, whiteSpace = posArr.length > 1 && !index) => isUnit(pos)
                        ? <span key={`size-span-radial-units-${index}`}>
                            {this.renderUnit(pos)}

                            {whiteSpace && <span> </span>}
                        </span>

                        : <span key={`size-span-radial-keyword-${index}`}>
                            <span className="token keyword">{pos}</span>

                            {whiteSpace && <span> </span>}
                        </span>
                    )
                }
                {(shape || size || position) && <span className="token punctuation">,</span>/* trailing comma */}
            </span>
        );
    }



    renderColor(color) {
        const colorType = color.match(/^(rgba|rgb|hsla|hsl|#)/)[0];

        // check if transparent
        if (colorType === "rgba" || colorType === "hsla") {
            const isTransparent = color.match(/[0-9.]+/g)[3] === "0";
            if (isTransparent) return (
                <span className="token css-color-name">
                    <ColorPreview color={"red"} />
                    transparent
                    <span> </span>
                </span>
            );
        }

        // convert to css names - only types with no alpha values
        if (this.state.convertCssNamedColorsWherePossible) {
            let hex = undefined;

            if (colorType === "#") hex = color;
            if (colorType === "rgb") hex = "#" + rgbToHex(...color.match(/\d+/g).map(Number));
            if (colorType === "hsl") hex = "#" + rgbToHex(...hslToRgb(...color.match(/\d+/g).map(Number)));

            const cssName = this.state.cssColorNames[hex];

            if (cssName) return (
                <span className="token css-color-name">
                    <ColorPreview color={color} />
                    {cssName}
                    <span> </span>
                </span>
            );
        }
        // return rgb
        if (colorType === "rgba") {
            const numbers = color.match(/[0-9.]+/g);
        }
    }



    renderColorStopsAndHints(gradient) {
        const colors = gradient.colors;
        const hints = gradient.colorHints;

        const colorStops = colors.map((colorStop, index) => {
            const { color, stop } = { ...colorStop };
            let hint = undefined;

            if (hints.length) {
                const currStop = colors[index].stop;
                const nextStop = colors[index + 1] ? colors[index + 1].stop : gradient.max;
                const hintsInRange = hints.filter(hint => currStop < hint && nextStop >= hint);
                const highestHint = hintsInRange.length ? Math.max(...hintsInRange) : undefined;
                hint = highestHint;
            }

            return ({ color, stop, hint })
        });

        return colorStops.map((colorStop, index) => (
            <span key={`color-stop-code-${index}`}>
                {this.renderColor(colorStop.color)}
            </span>
        ));
    }



    renderCode() {
        const gradients = this.props.gradients.map(grad => getImmutableGradientCopy(grad)).reverse();
        const functionNames = gradients.map(gradient => (gradient.repeating ? "repeating-" : "") + gradient.type + "-gradient");
        const renderFunctionSpans = gradIndex => (
            <span key={`functionName${gradIndex}`}>
                <span className="token function">{functionNames[gradIndex]}</span>

                <span className="token punctuation">(</span>

                {this.renderAngleParameter(gradients[gradIndex])}

                {this.renderShapeSizePosition(gradients[gradIndex])}

                {this.renderColorStopsAndHints(gradients[gradIndex])}
            </span>
        );

        return gradients.map((gradients, gradIndex) => (
            <pre key={`gradient-code${gradIndex}`}>
                <code>
                    <span className="token property">background</span>

                    <span className="token punctuation">: </span>

                    {renderFunctionSpans(gradIndex)}

                    <br />
                </code>
            </pre>
        ));
    }



    render() {
        return (
            <div className="Code">
                <header>
                    <span>CODE</span>

                    <div>
                        <button
                            title="copy to clipboard"
                            onMouseOver={() => this.setState({ ...this.state, copyButtonHover: true })}
                            onMouseLeave={() => this.setState({ ...this.state, copyButtonHover: false })}
                        >
                            <div style={{ backgroundImage: this.getCopyButtonImage() }}></div>
                        </button>

                        <button
                            title="settings"
                            onMouseOver={() => this.setState({ ...this.state, settingsButtonHover: true })}
                            onMouseLeave={() => this.setState({ ...this.state, settingsButtonHover: false })}
                        >
                            <div style={{ backgroundImage: this.getGearButtonImage() }}></div>
                        </button>
                    </div>
                </header>

                <div>
                    {this.renderCode()}
                </div>
            </div>
        )
    }
}