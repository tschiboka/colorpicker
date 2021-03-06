import React, { Component } from 'react';
import { getDefaultGradientObj, gradientObjsToStr } from "../../functions/gradient";
import checkeredRect from "../../images/checkered_rect.png";
import visibleIcon from "../../images/visible.png";
import visibleActiveIcon from "../../images/visible_active.png";
import hiddenIcon from "../../images/hidden.png";
import hiddenActiveIcon from "../../images/hidden_active.png";
import GradientSlider from "../GradientSlider/GradientSlider";
import GradientButtons from "../GradientButtons/GradientButtons";
import { produce } from "immer";
import "./GradientField.scss";



export default class GradientField extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibleHovered: false,
            nameInputVisible: false,
            copyWhenInsertOn: false
        };
    }



    componentDidMount() {
        if (!this.props.gradient.name) { this.nameGradients() }

        this.setPreview();
    }



    componentDidUpdate() {
        if (!this.props.gradient.name) { this.nameGradients() }

        this.setPreview();
    }


    setPreview() {
        // NOTE: Style needs to be set here!
        // React can not handle overlapping style properties like background shorthand / background color.
        // Its behaviour is unpredictable and unsupported. This part of the app needs to behave as closely
        // to native css as possible therefore style-sheet will be set on every update in vanilla JS style
        const display = document.getElementById("Preview_" + this.props.index);

        let backgroundSizeSet;

        try {
            const hasValue0 = this.props.backgroundSize[0] && this.props.backgroundSize[0].value;
            const hasValue1 = this.props.backgroundSize[1] && this.props.backgroundSize[1].value;
            const hasUnit0 = this.props.backgroundSize[0] && this.props.backgroundSize[0].unit;
            const hasUnit1 = this.props.backgroundSize[1] && this.props.backgroundSize[1].unit;
            backgroundSizeSet = hasValue0 && hasValue1 && hasUnit0 && hasUnit1;
        } catch (e) { }


        display.style.background = gradientObjsToStr([this.props.gradients[this.props.index]].reverse());
        display.style.backgroundColor = this.props.backgroundColor || "";
        if (backgroundSizeSet) {
            display.style.backgroundSize = this.props.backgroundSize[0].value + this.props.backgroundSize[0].unit + " " +
                this.props.backgroundSize[1].value + this.props.backgroundSize[1].unit;
        }
    }



    handleNameOnClick() { this.setState({ ...this.state, nameInputVisible: true }); }



    handeleNameOnKeyDown(e) {
        const key = e.which || e.keyCode || e.key;
        const input = document.getElementById(`GradientField${this.props.index}-name-input`);
        const closeInput = () => this.setState({ ...this.state, nameInputVisible: false });
        const validateInput = () => input.value
            .replace(/[^\w-.,()[\]\s]/g, "") // filter invalid chars
            .match(/.{0,20}/g)[0];           // allow only 20 cars 

        input.value = validateInput(input.value);

        if (key === 27 || key === "Escape" || key === "Esc") closeInput();

        if (key === 13 || key === "Enter") {
            const onlyWhiteSpace = str => /^\s*$/g.test(str);
            if (onlyWhiteSpace(input.value)) input.value = null;

            const updatedGradient = Object.assign({}, this.props.gradient, { name: input.value });
            this.props.updateGradient(updatedGradient, this.props.index);

            closeInput();
        }
    }



    handleInsertGradientOnClick(where) {
        const insertIndex = where === "above" ? this.props.index : this.props.index + 1;
        const newGradient = this.state.copyWhenInsertOn ? { ...this.props.gradient } : getDefaultGradientObj();
        const copyName = this.state.copyWhenInsertOn ? this.getCopyName(this.props.gradient.name) : "";
        const updatedGradient = JSON.parse(JSON.stringify(newGradient));

        updatedGradient.name = copyName;

        this.props.insertGradient(updatedGradient, insertIndex);
        this.setState({ ...this.state, copyWhenInsertOn: false });
    }



    toggleVisibility() {
        const updatedGradient = Object.assign({}, this.props.gradient, { visible: !this.props.gradient.visible });
        this.props.updateGradient(updatedGradient, this.props.index);
    }



    renderRedDiagonalLine() {
        return <svg height="100%" width="100%"><line x1="0" y1="100%" x2="100%" y2="0" style={{ stroke: "red", strokeWidth: 2 }} /></svg>
    }



    getCopyName(name) {
        // Untitled 1 ==> Untitled 1 copy
        const isFirstCopy = !/\s(copy\s\d+|copy)$/gi.test(name);
        if (isFirstCopy) return name + " copy";

        // Untitled 1 copy ==> Untitled 1 copy 2
        const isSecondCopy = /\scopy$/gi.test(name);
        if (isSecondCopy) return name + " 2";

        // Untitled 1 copy n ==> Untitled 1 copy n + 1
        const copyNumber = Number(name.match(/\d+$/g)) + 1;
        return name.replace(/\d+$/g, num => copyNumber);
    }



    getUntitledNumber() {
        // In case user messes up titles [Untitled 1, Untitled 3345, Untitled 2]
        // In the case above return 3 instead of 3346 as the next possible Untitled Number
        const names = this.props.gradients.map(gradient => gradient.name);
        const untitledNames = names.filter(name => /^Untitled\s?\d+$/gi.test(name));
        const untitledNumbers = untitledNames.map(name => Number(name.match(/\d+/))).sort((a, b) => a - b);
        const correctNumbers = untitledNumbers.filter((num, ind) => num === ind + 1);
        const untitledNumber = (correctNumbers[correctNumbers.length - 1] || 0) + 1;

        return untitledNumber;
    }



    getVisibleIcon() {
        if (!this.props.gradient.visible) {
            if (!this.state.visibleHovered) return `url(${visibleIcon})`;
            else return `url(${visibleActiveIcon})`;
        }
        else {
            if (!this.state.visibleHovered) return `url(${hiddenIcon})`;
            else return `url(${hiddenActiveIcon})`;
        }
    }



    nameGradients() {
        const updatedGradient = produce(this.props.gradient, draft => {
            draft.name = `Untitled ${this.getUntitledNumber()}`;
        });
        this.props.updateGradient(updatedGradient, this.props.index);
    }



    renderName() {
        if (!this.state.nameInputVisible) return this.props.gradient.name;
        else {
            return <input
                type="text"
                id={`GradientField${this.props.index}-name-input`}
                size={16}
                autoFocus
            />
        }
    }



    render() {
        return (
            <div className="GradientField">
                <header>
                    <div className="GradientField__index">{this.props.index + 1}</div>

                    <div
                        className="GradientField__name"
                        onClick={() => this.handleNameOnClick()}
                        onBlur={() => this.setState({ ...this.state, nameInputVisible: false })}
                        onKeyUp={e => this.handeleNameOnKeyDown(e)}
                    >
                        {this.renderName()}
                    </div>

                    <div className="GradientField__header__button-box">
                        <button
                            title="copy this gradient when insert"
                            onClick={() => this.setState({ ...this.state, copyWhenInsertOn: !this.state.copyWhenInsertOn })}
                        >&#128396;
                            <div className={`btn--${this.state.copyWhenInsertOn ? "active" : "inactive"}`}></div>
                        </button>

                        <button
                            title="insert new gradient above"
                            onClick={() => this.handleInsertGradientOnClick("above")}
                        >&#8613;</button>

                        <button
                            title="insert new gradient below"
                            onClick={() => this.handleInsertGradientOnClick("below")}
                        >&#8615;</button>

                        <button
                            title="reposition gradient"
                            style={{ color: this.props.repositionOn ? "#4cc3f1" : "" }}
                            onClick={() => this.props.setReposition(this.props.index)}
                        >&#8645;
                        <div className={`btn--${this.props.repositionOn ? "active" : "inactive"}`}></div>
                        </button>

                        <button
                            className="visibility-btn"
                            title="visibility"
                            onClick={() => this.toggleVisibility()}
                            onMouseEnter={() => this.setState({ ...this.state, visibleHovered: true })}
                            onMouseLeave={() => this.setState({ ...this.state, visibleHovered: false })}
                        ><div
                            style={{ backgroundImage: this.getVisibleIcon() }}
                        ></div>
                        </button>

                        <button
                            title="delete gradient"
                            onClick={() => this.props.confirmDeleteGradient(this.props.gradient, this.props.index)}
                        >&times;</button>
                    </div>
                </header>

                <div className="GradientField__body">
                    <div className="GradientField__preview" title="preview">
                        <div
                            className="GradientField__preview__checkered"
                            style={{
                                backgroundImage: `${this.props.checkered ? `url(${checkeredRect})` : ""}`,
                            }}
                        >
                            <div
                                id={`Preview_${this.props.index}`}
                                className="GradientField__preview__gradient"
                                onClick={() => this.toggleVisibility()}
                            >
                                {!this.props.gradient.visible && this.renderRedDiagonalLine()}
                            </div>
                        </div>
                    </div>

                    <div className="GradientField__settings">
                        <GradientSlider
                            gradient={this.props.gradient}
                            index={this.props.index}
                            updateGradient={this.props.updateGradient}
                            openColorPicker={this.props.openColorPicker}
                            preventMouseUp={this.props.preventMouseUp}
                            activeAngleMeter={this.props.activeAngleMeter}
                        />

                        <GradientButtons
                            gradient={this.props.gradient}
                            index={this.props.index}
                            updateGradient={this.props.updateGradient}
                            setAngleMeterIsActive={this.props.setAngleMeterIsActive}
                            activeAngleMeter={this.props.activeAngleMeter}
                            openRadialSettings={this.props.openRadialSettings}
                            openBackgroundSettings={this.props.openBackgroundSettings}
                        />
                    </div>
                </div>
            </div>
        );
    }
}