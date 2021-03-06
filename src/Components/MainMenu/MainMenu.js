import React, { Component } from 'react';
import Gallery from "../Gallery/Gallery";
import newIcon from "../../images/new.png";
import newActiveIcon from "../../images/new_active.png";
import openIcon from "../../images/open.png";
import openActiveIcon from "../../images/open_active.png";
import saveIcon from "../../images/save.png";
import saveActiveIcon from "../../images/save_active.png";
import deleteIcon from "../../images/delete.png";
import deleteActiveIcon from "../../images/delete_active.png";
import helpIcon from "../../images/help_sml.png";
import helpActiveIcon from "../../images/help_sml_active.png";
import backIcon from "../../images/expand_less.png";
import backActiveIcon from "../../images/expand_less_active.png";
import "./MainMenu.scss";



export default class MainMenu extends Component {
    constructor(props) {
        super(props);


        this.state = {
            menuListHovered: undefined,
            newFormOpen: false,
            saveFormOpen: false,
            openFormOpen: false,
            openPatternDialog: false,
            deleteFormOpen: false,
            deletePatternDialog: false,
            showPredefinedOrStorage: "predefined",
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



    // OPTION NEW FUNCTIONS
    checkIfChangesHaveBeenMadeInPattern() {
        // if pattern has no name it must be a fresh one by opening the app
        if (!this.props.patternName) return true;

        // check if localStorage pattern matches exactly the current pattern
        const backgroundSize = this.props.backgroundSize;
        const patternName = this.props.patternName;
        const backgroundColor = this.props.backgroundColor;
        const gradients = this.props.gradients;
        const currentPattern = {
            patternName,
            backgroundSize,
            backgroundColor,
            gradients
        };

        const patternsInStorage = JSON.parse(localStorage.patterns || "[]");
        const storedPatternIndex = patternsInStorage.findIndex(storedPattern => storedPattern.patternName === patternName);

        // in case pattern has name but it can not be found in storage (further down it would cause runtime exception)
        if (storedPatternIndex === -1) return true;

        const storedPattern = patternsInStorage[storedPatternIndex];
        const currentPatternStr = JSON.stringify(currentPattern);
        const storedPatternStr = JSON.stringify(storedPattern);

        if (storedPatternStr === currentPatternStr) return false; // the two are perfectly matching --> no need to save
        else return true;   // the current version of the pattern doesn't match the one sored
    }



    createNewPattern() {
        this.setState({ ...this.state, newFormOpen: false }, () => {
            this.props.closeMenu();

            this.props.setDefaultState();
        });
    }



    renderNewForm() {
        return (
            <div>
                {this.checkIfChangesHaveBeenMadeInPattern()
                    ? (
                        <div className="MainMenu__new-form">
                            <h2>New</h2>

                            <p>
                                You have unsaved changes in your work.<br />
                                Creating a new pattern will close the<br />
                                current work in progress.<br />
                                Would you like to save it before closing?
                            </p>

                            <div>
                                <button onClick={() => { this.setState({ ...this.state, saveFormOpen: true }); }}>Save</button>

                                <button onClick={() => this.createNewPattern()}>Don&apos;t save</button>

                                <button onClick={() => this.setState({ ...this.state, newFormOpen: false })}>Cancel</button>
                            </div>
                        </div>
                    )
                    : (
                        <div className="MainMenu__new-form">
                            <h2>New</h2>

                            <p>
                                Your work has no unsaved changes.<br />
                                Creating a new pattern will close the<br />
                                current work in progress.<br />
                            </p>

                            <div>
                                <button onClick={() => this.createNewPattern()}>Ok</button>

                                <button onClick={() => this.setState({ ...this.state, newFormOpen: false })}>Cancel</button>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }



    // OPTION SAVE FUNCTIONS
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
        if (!input.length || input.length > 30) return false;  // input length 1 - 29

        if (!/^[0-9a-zA-Z_-]+$/g.test(input)) return false;    // has only chars nums and -_

        if (!/^[a-zA-Z]/.test(input)) return false;          // starts with a char

        // name can not be already present in storage
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

            if (this.props.backgroundBlendMode) pattern.backgroundBlendMode = this.props.backgroundBlendMode;

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
                    console.log(pattern);
                }

                localStorage.setItem("patterns", JSON.stringify(storagePatternsArray));
            }

            this.setState({ ...this.state, saveFormOpen: false });
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



    renderSaveForm() {
        return (
            <div className="MainMenu__save-form">
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
                        autoFocus={true}
                    />
                </div>

                <div>
                    <button onClick={() => this.submitPattern()}>Ok</button>

                    <button onClick={() => this.setState({ ...this.state, saveFormOpen: false })}>Cancel</button>
                </div>
            </div>
        )
    }



    // OPTION OPEN FUNCTIONS
    renderOpenForm() {
        return (
            <div className="MainMenu__open-dialog">
                <h2>Open</h2>

                <ul className="MainMenu__storage-predefined-toggle">
                    <li onClick={() => this.setState({ ...this.state, showPredefinedOrStorage: "storage" })}>
                        Storage
                        <div className={this.state.showPredefinedOrStorage === "storage" ? "btn--active" : "btn--inactive"}></div>
                    </li>

                    <li onClick={() => this.setState({ ...this.state, showPredefinedOrStorage: "predefined" })}>
                        Predefined
                        <div className={this.state.showPredefinedOrStorage === "predefined" ? "btn--active" : "btn--inactive"}></div>
                    </li>
                </ul>

                <div>
                    <Gallery
                        show={this.state.showPredefinedOrStorage}
                        callBackOnClick={this.setOpenPatternDialog.bind(this)}
                    />
                </div>
            </div>
        );
    }



    setOpenPatternDialog(pattern) {
        this.setState({ ...this.state, openPatternDialog: true, openFormOpen: false, patternToOpen: pattern });
    }



    renderOpenPatternDialog() {
        return (
            <div>
                {this.checkIfChangesHaveBeenMadeInPattern()
                    ? (
                        <div className="MainMenu__open-form">
                            <h2>Open</h2>

                            <p>
                                You have unsaved changes in your work.<br />
                                Opening a new pattern will close the<br />
                                current work in progress.<br />
                                Would you like to save it before closing?
                            </p>

                            <div>
                                <button onClick={() => { this.setState({ ...this.state, saveFormOpen: true }); }}>Save</button>

                                <button onClick={() => this.openNewPattern()}>Don&apos;t save</button>

                                <button onClick={() => this.setState({ ...this.state, openPatternDialog: undefined, openFormOpen: undefined })}>Cancel</button>
                            </div>
                        </div>
                    )
                    : (
                        <div className="MainMenu__open-form">
                            <h2>Open</h2>

                            <p>
                                Your work has no unsaved changes.<br />
                                Opening a new pattern will close the<br />
                                current work in progress.<br />
                            </p>

                            <div>
                                <button onClick={() => this.openNewPattern()}>Ok</button>

                                <button onClick={() => this.setState({ ...this.state, openPatternDialog: undefined, openDialogOpen: undefined, openFormOpen: undefined })}>Cancel</button>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }



    openNewPattern() {
        const pattern = this.state.patternToOpen;
        this.setState({ ...this.state, openPatternDialog: false, patternToOpen: undefined }, () => {
            this.props.closeMenu();

            this.props.changeStateToPattern(pattern);
        });
    }



    // DELETE OPTION FUNCTIONS
    renderDeleteForm() {
        return (
            <div className="MainMenu__delete-form">
                <h2>Delete</h2>

                <div>
                    <Gallery
                        show={"storage"}
                        callBackOnClick={this.setDeleteDialog.bind(this)}
                    />

                    {this.state.deletePatternDialog && (
                        <div className="delete-dialog">
                            <p>Confirm the name of the pattern to be deleted!</p>

                            <div>
                                <span>Type its name [ <span>{this.state.patternToDelete}</span> ]:&nbsp;&nbsp;&nbsp;</span>

                                <input
                                    type="text"
                                    onChange={e => this.handleDeleteInputOnChange(e)}
                                    onKeyPress={e => this.handleDeleteInputOnKeyPress(e)}
                                    autoFocus={true}
                                />
                            </div>

                            <div>
                                <button onClick={() => this.deletePattern()}>Delete</button>

                                <button onClick={() => this.setState({ ...this.state, patternToDelete: undefined, deletePatternDialog: false })}>Cancel</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }



    handleDeleteInputOnChange(event) {
        this.setState({ ...this.state, patternNameConfirmed: false });

        const value = event.target.value;
        const inputLength = value.length;
        const subString = this.state.patternToDelete.substr(0, inputLength);

        if (subString === value) {
            event.target.classList.remove(...event.target.classList);
            event.target.classList.add("partially-correct");
        }
        else {
            event.target.classList.remove(...event.target.classList);
            event.target.classList.add("incorrect");
        }

        if (value === this.state.patternToDelete) {
            event.target.classList.remove(...event.target.classList);
            event.target.classList.add("correct");

            this.setState({ ...this.state, patternNameConfirmed: true });
        }
    }



    handleDeleteInputOnKeyPress(event) {
        if (this.state.patternNameConfirmed) {
            const key = event.which || event.keyCode || event.key;

            if (key === 13 || key === "Enter") {
                this.deletePattern();
            }
        }
    }



    setDeleteDialog(pattern) {
        const patternToDelete = pattern.patternName;
        this.setState({ ...this.state, patternToDelete, deletePatternDialog: true, patternNameConfirmed: false });
    }



    deletePattern() {
        if (this.state.patternNameConfirmed) {
            const storagePatterns = JSON.parse(localStorage.patterns);
            const deleteIndex = storagePatterns.findIndex(pattern => pattern.patternName === this.state.patternToDelete);

            if (storagePatterns[deleteIndex]) {
                storagePatterns.splice(deleteIndex, 1);

                localStorage.setItem("patterns", JSON.stringify(storagePatterns));

                this.setState({ ...this.state, patternNameConfirmed: false, patternToDelete: undefined, deletePatternDialog: undefined });
            }
        }
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
                            onClick={() => this.setState({ ...this.state, newFormOpen: true })}
                        >
                            <div style={{ backgroundImage: `url(${this.state.menuListHovered === "new" ? newActiveIcon : newIcon})` }}></div>

                            <span>New</span>
                        </li>

                        <li
                            onMouseOver={() => this.setState({ ...this.state, menuListHovered: "open" })}
                            onClick={() => this.setState({ ...this.state, openFormOpen: true })}
                        >
                            <div style={{ backgroundImage: `url(${this.state.menuListHovered === "open" ? openActiveIcon : openIcon})` }}></div>

                            <span>Open</span>
                        </li>

                        <li
                            onClick={() => this.setState({ ...this.state, saveFormOpen: true })}
                            onMouseOver={() => this.setState({ ...this.state, menuListHovered: "save" })}
                        >
                            <div style={{ backgroundImage: `url(${this.state.menuListHovered === "save" ? saveActiveIcon : saveIcon})` }}></div>

                            <span>Save</span>
                        </li>

                        <li
                            onClick={() => this.setState({ ...this.state, deleteFormOpen: true })}
                            onMouseOver={() => this.setState({ ...this.state, menuListHovered: "delete" })}
                        >
                            <div style={{ backgroundImage: `url(${this.state.menuListHovered === "delete" ? deleteActiveIcon : deleteIcon})` }}></div>

                            <span>Delete</span>
                        </li>

                        <li
                            onClick={() => {
                                this.props.openHelpMenu();
                                this.props.closeMenu();
                            }}
                            onMouseOver={() => this.setState({ ...this.state, menuListHovered: "help" })}
                        >
                            <div style={{ backgroundImage: `url(${this.state.menuListHovered === "delete" ? helpActiveIcon : helpIcon})` }}></div>

                            <span>Help</span>
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

                {this.state.openFormOpen && this.renderOpenForm()}

                {this.state.openPatternDialog && this.renderOpenPatternDialog()}

                {this.state.newFormOpen && this.renderNewForm()}

                {this.state.saveFormOpen && this.renderSaveForm()}

                {this.state.deleteFormOpen && this.renderDeleteForm()}
            </div>
        )
    }
}