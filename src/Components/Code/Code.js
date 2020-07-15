import React, { Component } from 'react';
import gearIcon from "../../images/gear.png";
import gearActiveIcon from "../../images/gear_active.png";
import copyIcon from "../../images/copy.png";
import copyActiveIcon from "../../images/copy_active.png";
import checkeredBg from "../../images/checkered_rect.png";
import { getImmutableGradientCopy } from "../../functions/gradient";
import { getColorObj } from "../../functions/colors";
import "./Code.scss";
import { CodeSettings } from '../CodeSettings/CodeSettings';



function ColorPreview(props) {
    const color = props.color ? `linear-gradient(${props.color}, ${props.color}) ,` : "";

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
            settingIsOpen: false,
            copyButtonHover: false,
            convertCssNamedColorsWherePossible: true,
            preferredColorFormat: undefined,
            commentsAllowed: true,
            cssColorNames: require("../../constants/color_templates/cssColors.json"),
            fallbackAllowed: true,
            vendorPrefixes: {
                "W3C": true,
                "-o-": true,
                "-ms-": true,
                "-moz-": true,
                "-webkit-": true
            }
        }
    }



    componentDidMount() {
        const code = document.getElementById("code");
        const bites = encodeURI(code.textContent).split(/%..|./).length - 1;

        this.setState({ ...this.state, bites });
    }



    componentDidUpdate(_, prevState) {
        const code = document.getElementById("code");
        const text = this.props.gradients.length ? code.textContent : "";
        const bites = encodeURI(text)
            .replace(/\*(.|\n)*?\*/g, "") // get rid of comments
            .split(/%..|./).length - 1;

        if (prevState.bites !== bites) this.setState({ ...this, bites });
    }



    handleCopyBtnOnClick() {
        const copy = () => {
            const code = document.getElementById("code");
            const codeText = code.textContent.split(";").join(";\n");
            this.copyToClipboard(codeText);
        }

        if (this.state.commentsAllowed) { // Don't let comments pollute clip-board
            this.setState({ ...this.state, commentsAllowed: false }, () => {
                copy();
                this.setState({ ...this.state, commentsAllowed: true });
            });
        }
        else copy();
    }



    handleSettingsOnClick() {
        this.setState({ ...this.state, settingIsOpen: !this.state.settingIsOpen });
    }



    setVendorPrefixes(vendorPrefixes) { this.setState({ ...this.state, vendorPrefixes }); }



    toggleFallbackAllowed() { this.setState({ ...this.state, fallbackAllowed: !this.state.fallbackAllowed }); }



    copyToClipboard(text) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
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



    renderColor(color, colorsLength, index) {
        const colorObj = getColorObj(color);
        const colorType = color.match(/^(rgba|rgb|hsla|hsl|#)/g)[0];
        const preferredFormat = this.state.preferredColorFormat || colorType;

        // check if transparent
        if (colorType === "rgba" || colorType === "hsla") {
            const isTransparent = color.match(/[0-9.]+/g)[3] === "0";
            if (isTransparent) return (
                <span className="token css-color-name">
                    <ColorPreview />
                    transparent
                    {colorsLength - 1 > index && <span className="token punctuation">, </span>}
                </span>
            );
        }

        // convert to css names - only types with no alpha values
        if (this.state.convertCssNamedColorsWherePossible && colorObj.alpha === 100) {
            const cssName = this.state.cssColorNames["#" + colorObj.hex];

            if (cssName) return (
                <span className="token css-color-name">
                    <ColorPreview color={color} />
                    {cssName}
                    {colorsLength - 1 > index && <span className="token punctuation">, </span>}
                </span>
            );
        }

        // return RGB
        if (preferredFormat === "rgb") return (
            <span>
                <ColorPreview color={color} />

                <span className="token function">rgb</span>

                <span className="token punctuation">(</span>

                <span className="token number">{colorObj.rgb.r}</span>

                <span className="token punctuation">, </span>

                <span className="token number">{colorObj.rgb.g}</span>

                <span className="token punctuation">, </span>

                <span className="token number">{colorObj.rgb.b}</span>

                <span className="token punctuation">)</span>

                {colorsLength - 1 > index && <span className="token punctuation">, </span>}
            </span>
        );

        // return RGB
        if (preferredFormat === "rgba") return (
            <span>
                <ColorPreview color={color} />

                <span className="token function">rgba</span>

                <span className="token punctuation">(</span>

                <span className="token number">{colorObj.rgb.r}</span>

                <span className="token punctuation">, </span>

                <span className="token number">{colorObj.rgb.g}</span>

                <span className="token punctuation">, </span>

                <span className="token number">{colorObj.rgb.b}</span>


                <span className="token punctuation">, </span>

                <span className="token number">{"0." + colorObj.alpha.toString().replace(/0$/, "")}</span>

                <span className="token punctuation">)</span>

                {colorsLength - 1 > index && <span className="token punctuation">, </span>}
            </span>
        );

        // return HSL
        if (preferredFormat === "hsl") return (
            <span>
                <ColorPreview color={color} />

                <span className="token function">hsl</span>

                <span className="token punctuation">(</span>

                <span className="token number">{colorObj.hsl.h}</span>

                <span className="token punctuation">, </span>

                <span className="token number">{colorObj.hsl.s}</span>

                <span className="token unit">%</span>

                <span className="token punctuation">, </span>

                <span className="token number">{colorObj.hsl.l}</span>

                <span className="token unit">%</span>

                <span className="token punctuation">)</span>

                {colorsLength - 1 > index && <span className="token punctuation">, </span>}
            </span>
        );

        // return HSL
        if (preferredFormat === "hsla") return (
            <span>
                <ColorPreview color={color} />

                <span className="token function">hsla</span>

                <span className="token punctuation">(</span>

                <span className="token number">{colorObj.hsl.h}</span>

                <span className="token punctuation">, </span>

                <span className="token number">{colorObj.hsl.s}</span>

                <span className="token unit">%</span>

                <span className="token punctuation">, </span>

                <span className="token number">{colorObj.hsl.l}</span>

                <span className="token unit">%</span>

                <span className="token punctuation">, </span>

                <span className="token number">{"0." + colorObj.alpha.toString().replace(/0$/, "")}</span>


                <span className="token punctuation">)</span>

                {colorsLength - 1 > index && <span className="token punctuation">, </span>}
            </span>
        );

        if (preferredFormat === "#") {
            return (
                <span>
                    <ColorPreview color={color} />

                    <span className="token hex">{color}</span>

                    {colorsLength - 1 > index && <span className="token punctuation">, </span>}
                </span>
            );
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
                {this.renderColor(colorStop.color, colorStops.length, index)}
            </span>
        ));
    }



    renderComment(index) {
        const comment = this.props.gradients[index].name;
        const isUntitled = /^untitled/gi.test(comment);
        if (this.state.commentsAllowed && !isUntitled) return (
            <span className="token comment">&nbsp;&nbsp;&#47;&#42;&nbsp;{comment}&nbsp;&#42;&#47;</span>
        );
    }



    renderBackgroundWithPrefix(vendorPrefix) {
        const gradients = this.props.gradients.map(grad => getImmutableGradientCopy(grad)).reverse();
        const functionNames = gradients.map(gradient => (gradient.repeating ? "repeating-" : "") + gradient.type + "-gradient");
        const renderFunctionSpans = gradIndex => (
            <span key={`functionName${gradIndex}`}>

                <span className="token punctuation">(</span>

                {this.renderAngleParameter(gradients[gradIndex])}

                {this.renderShapeSizePosition(gradients[gradIndex])}

                {this.renderColorStopsAndHints(gradients[gradIndex])}

                <span className="token punctuation">)</span>
            </span>
        );

        const prefix = vendorPrefix === "W3C" ? "" : vendorPrefix;

        return (
            <code key={"code" + prefix}>
                <pre>
                    <span>
                        <span className="token property">background</span>

                        <span className="token punctuation">: </span>

                        {gradients.map((gradient, gradIndex) => (
                            <span key={`gradient_${gradIndex}`}>
                                <span className="token vendor-prefix">{prefix}</span>

                                <span className={`token ${prefix ? "vendor-prefix" : "function"}`}>{functionNames[gradIndex]}</span>

                                {renderFunctionSpans(gradIndex)}

                                {gradients.length - 1 > gradIndex
                                    ? <span className="token punctuation">
                                        ,{this.renderComment(gradIndex)}

                                        <br />

                                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                    </span>
                                    : <span className="token punctuation">
                                        ;{this.renderComment(gradIndex)}

                                        <br />
                                    </span>
                                }
                            </span>
                        ))}
                    </span>
                </pre>
            </code>
        )
    }



    renderCode() {
        const prefixes = Object.keys(this.state.vendorPrefixes);

        return (
            prefixes.map(vendorPrefix => {
                const prefixAllowed = this.state.vendorPrefixes[vendorPrefix];

                if (!prefixAllowed) return false;

                const vendorComment = {
                    "W3C": "W3C",
                    "-o-": "Opera 11.10+",
                    "-ms-": "Internet Explorer 10+",
                    "-moz-": "FireFox 3.6+",
                    "-webkit-": "Chrome, Safari4+",
                };

                return (
                    <span key={`vendor-prefix${vendorPrefix}`}>
                        {this.state.commentsAllowed && <span className="token comment">
                            &#47;&#42;&nbsp;

                            {vendorComment[vendorPrefix]}

                            &nbsp;&#42;&#47;
                            </span>}

                        {this.renderBackgroundWithPrefix(vendorPrefix)}
                    </span>
                )
            })
        );
    }



    render() {
        return (
            <div className="Code">
                <header>
                    <span>
                        CODE

                    </span>

                    <span className="bite-count">[{this.state.bites / 1000}kB ]</span>

                    <div>
                        <button
                            title="copy to clipboard"
                            onMouseOver={() => this.setState({ ...this.state, copyButtonHover: true })}
                            onMouseLeave={() => this.setState({ ...this.state, copyButtonHover: false })}
                            onClick={() => this.handleCopyBtnOnClick()}
                        >
                            <div style={{ backgroundImage: this.getCopyButtonImage() }}></div>
                        </button>

                        <button
                            title="settings"
                            onMouseOver={() => this.setState({ ...this.state, settingsButtonHover: true })}
                            onMouseLeave={() => this.setState({ ...this.state, settingsButtonHover: false })}
                            onClick={() => this.handleSettingsOnClick()}
                        >
                            <div style={{ backgroundImage: this.getGearButtonImage() }}></div>
                        </button>
                    </div>
                </header>

                <div className="Code__body">
                    {this.state.settingIsOpen && (
                        <CodeSettings
                            vendorPrefixes={this.state.vendorPrefixes}
                            setVendorPrefixes={this.setVendorPrefixes.bind(this)}
                            fallbackAllowed={this.state.fallbackAllowed}
                            toggleFallbackAllowed={this.toggleFallbackAllowed.bind(this)}
                            closeSettings={() => this.setState({ ...this.state, settingIsOpen: false })}
                        />
                    )}

                    <div id="code">
                        {this.props.gradients.length
                            ? <span>
                                {this.state.fallbackAllowed &&
                                    <span> {this.state.commentsAllowed && <span className="token comment">&#47;&#42;&nbsp;Fallback for Old Browsers&nbsp;&#42;&#47;<br /></span>}

                                        <span className="token property">background-color</span>

                                        <span className="token punctuation">: </span>

                                        {this.renderColor(this.props.gradients[0].colors[0].color, 1, 0)}

                                        <span className="token punctuation">;</span>

                                        <br />
                                    </span>
                                }
                                {this.renderCode()}
                            </span>
                            : <span className="token comment">&#47;&#47; No gradients</span>
                        }
                    </div>
                </div>
            </div>
        )
    }
}