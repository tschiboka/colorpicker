import React from 'react';
import LengthInput from "../LengthInput/LengthInput";
import { ToggleButton } from '../ToggleButton/ToggleButton';
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
                            value={100}
                            unit={"%"}
                            units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                        //onChange={this.handleRepeatingInputChange.bind(this)}
                        />
                    </div>

                    <div>
                        <LengthInput
                            id="7"
                            name="background-size-y"
                            title="background size y"
                            value={100}
                            unit={"%"}
                            units={["%", "px", "vw", "vh", "em", "rem"].reverse()}
                        //onChange={this.handleRepeatingInputChange.bind(this)}
                        />
                    </div>
                </div>
            </div>

            <div className="CodeSettings__vendor-prefixes">
                <p>Vendor Prefixes: </p>

                <div>
                    <button onClick={() => handlePrefixOnClick("-o-")}>
                        -o-
                        <div className={isActivePrefix("-o-")}></div>
                    </button>

                    <button onClick={() => handlePrefixOnClick("-ms-")}>
                        -ms-
                        <div className={isActivePrefix("-ms-")}></div>
                    </button>

                    <button onClick={() => handlePrefixOnClick("-moz-")}>
                        -moz-
                        <div className={isActivePrefix("-moz-")}></div>
                    </button>

                    <button onClick={() => handlePrefixOnClick("-webkit-")}>
                        -webkit-
                        <div className={isActivePrefix("-webkit-")}></div>
                    </button>

                    <button onClick={() => props.toggleFallbackAllowed()}>
                        fallback
                        <div className={props.fallbackAllowed ? "btn--active" : "btn--inactive"}></div>
                    </button>
                </div>
            </div>


            <div>
                <p>Preferred Format: </p>
                <button>hex</button>

                <button>rgb</button>

                <button>hsl</button>

                <button>auto</button>
            </div>

            <div>
                <p>Allow hex short-hand:
                    <span> eg.: #ff6600 - #f60</span>
                </p>

                <ToggleButton />
            </div>


            <div>
                <p>css color names:
                    <span> eg.: #ffffff - white</span>
                </p>

                <ToggleButton />
            </div>

            <div>
                <p>Show comments: </p>

                <ToggleButton />
            </div>
            <div><button onClick={() => props.closeSettings()}>Back</button></div>
        </div>
    );
}