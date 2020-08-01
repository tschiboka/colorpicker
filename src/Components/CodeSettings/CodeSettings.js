import React from 'react';
import LengthInput from "../LengthInput/LengthInput";
import { ToggleButton } from '../ToggleButton/ToggleButton';
import DropDown from "../DropDown/DropDown";
import checkeredBg from "../../images/checkered_rect.png";
import "./CodeSettings.scss";



export function CodeSettings(props) {
    function handlePrefixOnClick(prefix) {
        const vendorPrefixes = { ...props.vendorPrefixes };
        const isPrefixAllowed = vendorPrefixes[prefix];

        vendorPrefixes[prefix] = !isPrefixAllowed;

        props.setVendorPrefixes(vendorPrefixes);
    }




    function isActivePrefix(prefix) {
        const vendorPrefixes = props.vendorPrefixes;
        const buttonPrefixAllowed = vendorPrefixes[prefix];

        return buttonPrefixAllowed ? "btn--active" : "btn--inacitve";
    }



    return (
        <div className="CodeSettings">
            <h2>Code Settings</h2>

            <div className="CodeSettings__background-size">
                <p>Background Size: </p>

                <div>
                    <div>
                        <LengthInput
                            id="6"
                            name="background-size-x"
                            title="background size x"
                            value={(props.backgroundSize && props.backgroundSize[0] && props.backgroundSize[0].value) ? props.backgroundSize[0].value : ""}
                            unit={(props.backgroundSize && props.backgroundSize[0] && props.backgroundSize[0].unit) ? props.backgroundSize[0].unit : "px"}
                            units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                            onChange={props.changeBackgroundSize}
                        />
                    </div>

                    <div>
                        <LengthInput
                            id="7"
                            name="background-size-y"
                            title="background size y"
                            value={(props.backgroundSize && props.backgroundSize[1] && props.backgroundSize[1].value) ? props.backgroundSize[1].value : ""}
                            unit={(props.backgroundSize && props.backgroundSize[1] && props.backgroundSize[1].unit) ? props.backgroundSize[1].unit : "px"}
                            units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                            onChange={props.changeBackgroundSize}
                        />
                    </div>

                    <ToggleButton
                        on={(() => {
                            let backgroundSizeSet;

                            try {
                                const hasValue0 = props.backgroundSize[0].value;
                                const hasValue1 = props.backgroundSize[1].value;
                                const hasUnit0 = props.backgroundSize[0].unit;
                                const hasUnit1 = props.backgroundSize[1].unit;
                                backgroundSizeSet = hasValue0 && hasValue1 && hasUnit0 && hasUnit1;
                            } catch (e) { }

                            return backgroundSizeSet;
                        })()}
                        handleOnClick={() => {
                            props.changeBackgroundSize(undefined);
                            document.getElementById("LengthInput_6").value = "";
                            document.getElementById("LengthInput_7").value = "";
                        }}
                    />

                </div>
            </div>

            <div className="CodeSettings__background-color">
                <p>Background Color: </p>

                <div
                    className="background-color-div"
                    style={{ backgroundImage: `url(${checkeredBg})` }}
                    onClick={() => props.openColorPicker(undefined, undefined, props.backgroundColor)}
                >
                    <div style={{ backgroundColor: props.backgroundColor }}></div>
                </div>

                <div>
                    <ToggleButton
                        on={props.backgroundColor}
                        handleOnClick={() => props.backgroundColor
                            ? props.resetBackgroundColor()
                            : props.openColorPicker(undefined, undefined, props.backgroundColor)
                        }
                    />
                </div>
            </div>

            <div className="CodeSettings__background-blend-mode">
                <p>Background Blend Mode: </p>

                <DropDown
                    options={["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"]}
                    current={props.backgroundBlendMode}
                    default="normal"
                    onSelect={props.changeBackgroundBlendMode}
                />
            </div>

            <div className="CodeSettings__preferred-format">
                <p>Preferred Format: </p>

                <div>
                    <DropDown
                        options={["default", "rgb", "hex", "hsl"]}
                        current={props.preferredColorFormat}
                        default="default"
                        onSelect={props.setPreferredColorFormat}
                    />
                </div>
            </div>

            <div className="CodeSettings__vendor-prefixes">
                <p>Vendor Prefixes: </p>

                <div>
                    <button
                        title="Opera"
                        onClick={() => handlePrefixOnClick("-o-")}>
                        o
                        <div className={isActivePrefix("-o-")}></div>
                    </button>

                    <button
                        title="Internet Explorer"
                        onClick={() => handlePrefixOnClick("-ms-")}>
                        ms
                        <div className={isActivePrefix("-ms-")}></div>
                    </button>

                    <button
                        title="Firefox"
                        onClick={() => handlePrefixOnClick("-moz-")}>
                        moz
                        <div className={isActivePrefix("-moz-")}></div>
                    </button>

                    <button
                        title="Safari, Chrome, Android, iOS"
                        onClick={() => handlePrefixOnClick("-webkit-")}>
                        webkit
                        <div className={isActivePrefix("-webkit-")}></div>
                    </button>

                    <button
                        title="Old Browsers"
                        onClick={() => props.toggleFallbackAllowed()}>
                        fallback
                        <div className={props.fallbackAllowed ? "btn--active" : "btn--inactive"}></div>
                    </button>
                </div>
            </div>

            <div>
                <p>Allow HEX Shorthand:
                    <span> eg.: #FF6600 - #F60</span>
                </p>

                <ToggleButton
                    on={props.hexShortHandAllowed}
                    handleOnClick={() => props.toggleHexShortHandAllowed()}
                />
            </div>


            <div>
                <p>CSS Color Names:
                    <span> eg.: #FFFFFF - white</span>
                </p>

                <ToggleButton
                    on={props.cssNamesAllowed}
                    handleOnClick={() => props.toggleCssNamesAllowed()}
                />
            </div>

            <div>
                <p>Show Comments: </p>

                <ToggleButton
                    on={props.commentsAllowed}
                    handleOnClick={() => props.toggleCommentsAllowed()}
                />
            </div>

            <div>
                <p>White / Checkered Background: </p>

                <ToggleButton
                    on={props.checkered}
                    handleOnClick={() => props.setCheckered(!props.checkered)}
                />
            </div>
            <div><button onClick={() => props.closeSettings()}>Back</button></div>
        </div>
    );
}