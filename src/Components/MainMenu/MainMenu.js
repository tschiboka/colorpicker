import React, { Component } from 'react';
import "./MainMenu.scss";



export default class MainMenu extends Component {
    constructor(props) {
        super(props);


        this.state = {
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
                console.log(JSON.parse(localStorage.patterns));
            }
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
                    <ul>
                        <li>New</li>

                        <li>Open</li>

                        <li onClick={() => this.setState({ ...this.state, saveMsgOpen: true })}>Save</li>

                        <li>Delete</li>
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