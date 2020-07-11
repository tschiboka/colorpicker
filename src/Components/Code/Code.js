import React, { Component } from 'react';
import "./Code.scss";
import gearIcon from "../../images/gear.png";
import gearActiveIcon from "../../images/gear_active.png";
import copyIcon from "../../images/copy.png";
import copyActiveIcon from "../../images/copy_active.png";



export default class Code extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settingsButtonHover: false,
            copyButtonHover: false
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



    render() {
        return (
            <div className="Code">
                <header>
                    <span>CODE</span>

                    <div>
                        <button
                            onMouseOver={() => this.setState({ ...this.state, copyButtonHover: true })}
                            onMouseLeave={() => this.setState({ ...this.state, copyButtonHover: false })}
                        >
                            <div style={{ backgroundImage: this.getCopyButtonImage() }}></div>
                        </button>

                        <button
                            onMouseOver={() => this.setState({ ...this.state, settingsButtonHover: true })}
                            onMouseLeave={() => this.setState({ ...this.state, settingsButtonHover: false })}
                        >
                            <div style={{ backgroundImage: this.getGearButtonImage() }}></div>
                        </button>
                    </div>
                </header>
            </div>
        )
    }
}