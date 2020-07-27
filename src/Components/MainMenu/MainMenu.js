import React, { Component } from 'react';
import newIcon from "../../images/new.png";
import newActiveIcon from "../../images/new_active.png";
import openIcon from "../../images/open.png";
import openActiveIcon from "../../images/open_active.png";
import saveIcon from "../../images/save.png";
import saveActiveIcon from "../../images/save_active.png";
import deleteIcon from "../../images/delete.png";
import deleteActiveIcon from "../../images/delete_active.png";
import backIcon from "../../images/expand_less.png";
import backActiveIcon from "../../images/expand_less_active.png";
import "./MainMenu.scss";



export default class MainMenu extends Component {
    constructor(props) {
        super(props);


        this.state = {
            menuListHovered: undefined,
            saveMsgOpen: false,
            saveInputNameIsInvalid: this.props.patternName ? true : false
        }
    }



    componentDidMount() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(({ usage, quota }) => {
                const storageInfo = { usage, quota };

                this.setState({ ...this.state, storageInfo });
            });
        }
    }



    handleSaveInputOnChange(event) {
        const name = event.target.value;
        const saveInputNameIsInvalid = this.validateSaveNameInput(name);

        this.setState({ ...this.state, saveInputNameIsInvalid });
    }



    handleSaveInputOnKeyPress(event) {
        const key = event.which || event.keyCode || event.key;

        if (key === 13 || key === "Enter") {
            this.submitPattern();
        }
    }



    validateSaveNameInput(input) {
        if (!input.length || input.length > 30) return false;

        if (!/^[0-9a-zA-Z_-]+$/g.test(input)) return false;

        const nameAvailable = JSON.parse(localStorage.patterns || "[]").findIndex(pattern => pattern.patternName === input) === -1;
        if (input !== this.props.patternName && !nameAvailable) return false;

        return true;
    }



    submitPattern() {
        if (this.state.saveInputNameIsInvalid) {
            const name = document.getElementById("save-pattern-input").value;
            const patternName = name;
            const backgroundSize = this.props.backgroundSize;
            const backgroundColor = this.props.backgroundColor;
            const gradients = this.props.gradients;
            const pattern = {
                patternName,
                backgroundSize,
                backgroundColor,
                gradients
            };

            // check if localStore has patterns key at all
            const storagePatterns = localStorage.patterns;
            if (!storagePatterns) {
                localStorage.setItem("patterns", JSON.stringify([pattern]));
                this.props.renamePattern(name);
            }
            else {
                const storagePatternsArray = JSON.parse(storagePatterns);
                // if name is the same as patternName update it
                if (name === this.props.patternName) {
                    const patternIndex = storagePatternsArray.findIndex(patt => patt.patternName === name);
                    storagePatternsArray[patternIndex] = pattern;
                }
                else {
                    storagePatternsArray.push(pattern);
                    this.props.renamePattern(name);
                }

                localStorage.setItem("patterns", JSON.stringify(storagePatternsArray));
            }

            this.setState({ ...this.state, saveMsgOpen: false });
        }
    }



    renderStorageInfo() {
        if (this.state.storageInfo) return (
            <p>
                Local storage : Total [
                <span> {(this.state.storageInfo.quota / 1024).toFixed(2)}kB </span>
                ] / Used [
                <span> {(this.state.storageInfo.usage / 1024).toFixed(2)}kB </span>
                ]
            </p>
        );
    }



    render() {
        return (
            <div className="MainMenu">
                <div className="MainMenu__options">
                    <ul
                        onMouseLeave={() => this.setState({ ...this.state, menuListHovered: undefined })}
                    >
                        <li
                            onMouseOver={() => this.setState({ ...this.state, menuListHovered: "new" })}
                        >
                            <div style={{ backgroundImage: `url(${this.state.menuListHovered === "new" ? newActiveIcon : newIcon})` }}></div>

                            <span>New</span>
                        </li>

                        <li
                            onMouseOver={() => this.setState({ ...this.state, menuListHovered: "open" })}
                        >
                            <div style={{ backgroundImage: `url(${this.state.menuListHovered === "open" ? openActiveIcon : openIcon})` }}></div>

                            <span>Open</span>
                        </li>

                        <li
                            onClick={() => this.setState({ ...this.state, saveMsgOpen: true })}
                            onMouseOver={() => this.setState({ ...this.state, menuListHovered: "save" })}
                        >
                            <div style={{ backgroundImage: `url(${this.state.menuListHovered === "save" ? saveActiveIcon : saveIcon})` }}></div>

                            <span>Save</span>
                        </li>

                        <li
                            onMouseOver={() => this.setState({ ...this.state, menuListHovered: "delete" })}
                        >
                            <div style={{ backgroundImage: `url(${this.state.menuListHovered === "delete" ? deleteActiveIcon : deleteIcon})` }}></div>

                            <span>Delete</span>
                        </li>

                        <li
                            onMouseOver={() => this.setState({ ...this.state, menuListHovered: "back" })}
                            onClick={() => this.props.closeMenu()}
                        >
                            <div style={{ backgroundImage: `url(${this.state.menuListHovered === "back" ? backActiveIcon : backIcon})` }}></div>

                            <span>Back</span>
                        </li>
                    </ul>
                </div>

                {this.state.saveMsgOpen && (<div className="MainMenu__saveMsg">
                    <h2>Save</h2>

                    <div className="storage-info">
                        <p>Your pattern will be saved in your browsers local storage.</p>
                        {this.renderStorageInfo()}
                    </div>


                    <div>
                        <span>Name: </span>

                        <input
                            id="save-pattern-input"
                            className={this.state.saveInputNameIsInvalid ? "valid" : "invalid"}
                            type="text"
                            onChange={e => this.handleSaveInputOnChange(e)}
                            onKeyPress={e => this.handleSaveInputOnKeyPress(e)}
                            defaultValue={this.props.patternName}
                        />
                    </div>

                    <div>
                        <button onClick={() => this.submitPattern()}>Ok</button>

                        <button onClick={() => this.setState({ ...this.state, saveMsgOpen: false })}>Cancel</button>
                    </div>
                </div>)}
            </div>
        )
    }
}