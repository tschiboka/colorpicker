import React from 'react';
import LengthInput from "../LengthInput/LengthInput";
import { ToggleButton } from '../ToggleButton/ToggleButton';
import "./CodeSettings.scss";



export function CodeSettings(props) {
    return (
        <div className="CodeSettings">
            <h2>Code Settings</h2>

            <div className="CodeSettings__background-size">
                <p>Background Size:</p>

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
                <p>Vendor Prefixes:</p>

                <div>
                    <button>-o-</button>

                    <button>-ms-</button>

                    <button>-moz-</button>

                    <button>-webkit-</button>

                    <button>fallback</button>
                </div>
            </div>


            <div>
                <p>Preferred Format:</p>
                <button>hex</button>

                <button>rgb</button>

                <button>hsl</button>

                <button>auto</button>
            </div>

            <div>
                <p>Allow hex short-hand:
                    <span>eg.: #ff6600 - #f60</span>
                </p>

                <ToggleButton />
            </div>


            <div>
                <p>css color names:
                    <span>eg.: #ffffff - white</span>
                </p>

                <ToggleButton />
            </div>

            <div>
                <p>Show comments:
                    <span>(comments never appear in your clipboard)</span>
                </p>

                <ToggleButton />
            </div>
            <div><button>Back</button></div>
        </div>
    );
}