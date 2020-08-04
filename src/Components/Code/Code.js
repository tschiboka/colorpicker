import React, { Component } from 'react';
import gearIcon from "../../images/gear.png";
import gearActiveIcon from "../../images/gear_active.png";
import copyIcon from "../../images/copy.png";
import copyActiveIcon from "../../images/copy_active.png";
import checkeredBg from "../../images/checkered_rect.png";
import { getImmutableGradientCopy } from "../../functions/gradient";
import { getColorObj, hexShortHand } from "../../functions/colors";
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
            hexShortHandAllowed: true,
            cssNamesAllowed: true,
            commentsAllowed: true,
            preferredColorFormat: undefined,
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



    setPreferredColorFormat(preferredColorFormat) { this.setState({ ...this.state, preferredColorFormat: preferredColorFormat }); }



    toggleFallbackAllowed() { this.setState({ ...this.state, fallbackAllowed: !this.state.fallbackAllowed }); }



    toggleHexShortHandAllowed() { this.setState({ ...this.state, hexShortHandAllowed: !this.state.hexShortHandAllowed }) }



    toggleCssNamesAllowed() { this.setState({ ...this.state, cssNamesAllowed: !this.state.cssNamesAllowed }) }



    toggleCommentsAllowed() { this.setState({ ...this.state, commentsAllowed: !this.state.commentsAllowed }) }



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
        if (gradient.type === "radial" && gradient.radial) {
            const shape = gradient.radial.shape;
            const size = gradient.radial.size;
            const position = gradient.radial.position;

            function renderSize() {
                const keyword = size.keyword ? size.keyword.join("-") : undefined;
                if (keyword) return <span className="token keyword">{keyword}</span>
                else return (
                    <span>
                        <span className="token number">{size.x.value}</span>

                        <span className="token unit">{size.x.unit} </span>

                        <span className="token number">{size.y.value}</span>

                        <span className="token unit">{size.y.unit} </span>
                    </span>
                )
            }

            return (
                <span>
                    {shape && <span className="token keyword">{shape}</span>}

                    {((size || position) && shape) && <span> </span>/* leading whitespace */}

                    {size && renderSize()}

                    {(shape || size || position) && <span className="token punctuation">, </span>/* trailing comma */}
                </span>
            );
        }
    }



    renderColor(colorStops, index, unit) {
        const color = colorStops[index].color || colorStops; // colorStop can be an object or a single color str
        const hasSizeAndHint = typeof colorStops === "object";
        const colorObj = getColorObj(color);
        const customType = color.match(/^(rgba|rgb|hsla|hsl|#)/g)[0];
        const preferredFormat = this.state.preferredColorFormat;
        const lastColorStop = colorStops.length - 1 === index || !hasSizeAndHint;

        const getFinalColorType = () => {
            if (!preferredFormat) return customType;

            const hasTransparency = colorObj.alpha !== 100;
            if (!hasTransparency) return preferredFormat;
            if (preferredFormat === "rgb") return "rgba";
            if (preferredFormat === "hsl") return "hsla";
            if (preferredFormat === "#") return "rgba";
        }

        const colorType = getFinalColorType();

        // check if transparent
        if (colorType === "rgba" || colorType === "hsla") {
            const isTransparent = color.match(/[0-9.]+/g)[3] === "0";
            if (isTransparent) return (
                <span className="token css-color-name">
                    <ColorPreview />
                    transparent

                    {hasSizeAndHint && this.renderColorHint(colorStops[index], unit)}

                    {!lastColorStop && <span className="token punctuation">, </span>}
                </span>
            );
        }

        // convert to css names - only types with no alpha values
        if (this.state.cssNamesAllowed && colorObj.alpha === 100) {
            const cssName = this.state.cssColorNames["#" + colorObj.hex];

            if (cssName) return (
                <span className="token css-color-name">
                    <ColorPreview color={color} />

                    {cssName}

                    {hasSizeAndHint && this.renderColorHint(colorStops[index], unit)}

                    {!lastColorStop && <span className="token punctuation">, </span>}
                </span>
            );
        }

        // return RGB
        if (colorType === "rgb") return (
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

                {hasSizeAndHint && this.renderColorHint(colorStops[index], unit)}

                {!lastColorStop && <span className="token punctuation">, </span>}
            </span>
        );

        // return RGBA
        if (colorType === "rgba") return (
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

                {hasSizeAndHint && this.renderColorHint(colorStops[index], unit)}

                {!lastColorStop && <span className="token punctuation">, </span>}
            </span>
        );

        // return HSL
        if (colorType === "hsl") return (
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

                {hasSizeAndHint && this.renderColorHint(colorStops[index], unit)}

                {!lastColorStop && <span className="token punctuation">, </span>}
            </span>
        );

        // return HSLA
        if (colorType === "hsla") return (
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

                {hasSizeAndHint && this.renderColorHint(colorStops[index], unit)}

                {!lastColorStop && <span className="token punctuation">, </span>}
            </span>
        );

        if (colorType === "#") {
            return (
                <span>
                    <ColorPreview color={color} />

                    <span className="token hex">
                        #
                        {this.state.hexShortHandAllowed ? hexShortHand(colorObj.hex) : colorObj.hex}
                    </span>

                    {hasSizeAndHint && this.renderColorHint(colorStops[index], unit)}

                    {!lastColorStop && <span className="token punctuation">, </span>}
                </span>
            );
        }
    }



    renderColorHint(colorStop, unit) {
        return (
            <span>
                <span> </span>

                <span className="token number">{colorStop.stop}</span>

                <span className="token unit">{unit}</span>

                {colorStop.hint && (
                    <span>
                        <span> </span>

                        <span className="token number">{colorStop.hint}</span>

                        <span className="token unit">{unit}</span>
                    </span>
                )}
            </span>
        );
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
                {this.renderColor(colorStops, index, gradient.repeatingUnit)}
            </span>
        ));
    }



    renderBackgroundProperties(gradient) {
        // POSITION
        const posX = { ...gradient.background.position[0] };
        const posY = { ...gradient.background.position[1] };
        // Check if any positioning has been set
        const hasPositionX = posX.keyword || posX.value;
        const hasPositionY = posY.keyword || posY.value;
        const hasPosition = hasPositionX || hasPositionY;

        // SIZE
        const sizeX = { ...gradient.background.size.x };
        const sizeY = { ...gradient.background.size.y };

        function renderPositionWithKeywords() {
            return (<span>
                <span className="token keyword"> {posX.keyword || "top"}</span>

                <span className="token number"> {posX.value || "0"}</span>

                <span className="token unit">{posX.value && posX.unit}</span>

                <span className="token keyword"> {posY.keyword || "left"}</span>

                <span className="token number"> {posY.value || "0"}</span>

                <span className="token unit">{posY.value && posY.unit}</span>
            </span>);
        }

        function renderPositionWithoutKeywords() {
            return (<span>
                <span className="token number"> {posX.value || "0"}</span>

                <span className="token unit">{posX.value && posX.unit}</span>

                <span className="token number"> {posY.value || "0"}</span>

                <span className="token unit">{posY.value && posY.unit}</span>
            </span>);
        }

        function renderSize() {
            return (<span>
                {!hasPosition && <span className="token number"> 0 0</span>}

                <span className="token punctuation"> /</span>

                <span className="token number"> {sizeX.value || "0"}</span>

                <span className="token unit">{sizeX.value && sizeX.unit}</span>

                <span className="token number"> {sizeY.value || "0"}</span>

                <span className="token unit">{sizeY.value && sizeY.unit}</span>
            </span>);
        }

        return (
            <span>
                {(posX.keyword || posY.keyword) && renderPositionWithKeywords()}

                {(hasPosition && !posX.keyword && !posY.keyword) && renderPositionWithoutKeywords()}

                {(sizeX.value || sizeY.value) && renderSize()}

                {gradient.background.repeat && <span className="token keyword"> {gradient.background.repeat}</span>}
            </span>
        );
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

                {this.renderColorStopsAndHints(gradients[gradIndex], gradIndex, gradients.length)}

                <span className="token punctuation">)</span>

                {this.renderBackgroundProperties(gradients[gradIndex])}
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



    renderFallback() {
        if (this.state.fallbackAllowed && this.props.gradients[0].colors[0]) return (
            <span> {this.state.commentsAllowed && <span className="token comment">&#47;&#42;&nbsp;Fallback for Old Browsers&nbsp;&#42;&#47;<br /></span>}

                <span className="token property">background</span>

                <span className="token punctuation">: </span>

                {this.renderColor(this.props.gradients[0].colors[0].color, 1, 0)}

                <span className="token punctuation">;</span>

                <br />
            </span>
        );
    }



    renderBackgroundColor() {
        if (this.props.backgroundColor) return (
            <span>
                <span className="token property">background-color</span>

                <span className="token punctuation">: </span>

                {this.renderColor(this.props.backgroundColor, 1, 0)}

                <span className="token punctuation">;</span>
            </span>
        );
    }


    renderPatternBackgroundSize() {
        let backgroundSizeSet;

        try {
            const hasValue0 = this.props.backgroundSize[0].value;
            const hasValue1 = this.props.backgroundSize[1].value;
            const hasUnit0 = this.props.backgroundSize[0].unit;
            const hasUnit1 = this.props.backgroundSize[1].unit;
            backgroundSizeSet = hasValue0 && hasValue1 && hasUnit0 && hasUnit1;
        } catch (e) { }

        if (this.props.gradients.length && backgroundSizeSet) return (
            <span>
                <span className="token property">background-size</span>

                <span className="token punctuation">: </span>

                <span className="token number">{this.props.backgroundSize[0].value}</span>

                <span className="token unit">{this.props.backgroundSize[0].unit} </span>

                <span className="token number">{this.props.backgroundSize[1].value}</span>

                <span className="token unit">{this.props.backgroundSize[1].unit}</span>

                <span className="token punctuation">;</span>

                <br />
            </span>
        );
    }



    renderBackgroundBlendMode() {
        if (this.props.backgroundBlendMode) return (
            <span>
                <span className="token property">background-blend-mode</span>

                <span className="token punctuation">: </span>

                <span className="token keyword">{this.props.backgroundBlendMode}</span>

                <span className="token punctuation">;</span>

                <br />
            </span>
        );
    }



    render() {
        return (
            <div className="Code">
                <header>
                    <span>
                        Code
                        <span className="bite-count">[
                            <span>{this.state.bites / 1000}kB </span>
                        ]</span>
                    </span>


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
                            backgroundSize={this.props.backgroundSize}
                            backgroundColor={this.props.backgroundColor}
                            backgroundBlendMode={this.props.backgroundBlendMode}
                            changeBackgroundSize={this.props.changeBackgroundSize}
                            changeBackgroundBlendMode={this.props.changeBackgroundBlendMode}
                            openColorPicker={this.props.openColorPicker}
                            resetBackgroundColor={this.props.resetBackgroundColor}
                            vendorPrefixes={this.state.vendorPrefixes}
                            setVendorPrefixes={this.setVendorPrefixes.bind(this)}
                            fallbackAllowed={this.state.fallbackAllowed}
                            toggleFallbackAllowed={this.toggleFallbackAllowed.bind(this)}
                            preferredColorFormat={this.state.preferredColorFormat}
                            setPreferredColorFormat={this.setPreferredColorFormat.bind(this)}
                            hexShortHandAllowed={this.state.hexShortHandAllowed}
                            toggleHexShortHandAllowed={this.toggleHexShortHandAllowed.bind(this)}
                            cssNamesAllowed={this.state.cssNamesAllowed}
                            toggleCssNamesAllowed={this.toggleCssNamesAllowed.bind(this)}
                            commentsAllowed={this.state.commentsAllowed}
                            toggleCommentsAllowed={this.toggleCommentsAllowed.bind(this)}
                            closeSettings={() => this.setState({ ...this.state, settingIsOpen: false })}
                            checkered={this.props.checkered}
                            setCheckered={this.props.setCheckered}
                        />
                    )}

                    <div id="code">
                        {this.props.gradients.length
                            ? <span>
                                {this.renderFallback()}

                                {this.renderCode()}

                                {this.renderBackgroundColor()}

                                {this.renderPatternBackgroundSize()}

                                {this.renderBackgroundBlendMode()}
                            </span>
                            : <span className="token comment">&#47;&#47; No gradients</span>
                        }
                    </div>
                </div>
            </div>
        )
    }
}