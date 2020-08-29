import React, { Component } from 'react';
import GradientField from "../GradientField/GradientField";
import DeleteConfirmMsg from "../DeleteConfirmMsg/DeleteConfirmMsg";
import { getDefaultGradientObj } from "../../functions/gradient";
import { calculateAngle } from "../../functions/slider";
import addIcon from "../../images/add.png";
import addActiveIcon from "../../images/add_active.png";
import helpIcon from "../../images/help.png";
import helpActiveIcon from "../../images/help_active.png";
import { produce } from "immer";
import "./GradientList.scss";



export default class GradientList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addIconHover: false,
            helpIconHover: false,
            deleteConfirmMsgVisible: false,
            gradientToDelete: undefined,
            activeAngleMeter: undefined,
            activeAngleMeterStartX: undefined,
            activeAngleMeterStartY: undefined,
            isRepositioning: false,
            repositionArr: [],
        }
    }



    renderGradients() {
        return this.props.gradients.map((gradient, i) => (
            <GradientField
                key={`gradient_${i}`}
                index={i}
                gradient={gradient}
                gradients={this.props.gradients}
                checkered={this.props.checkered}
                backgroundSize={this.props.backgroundSize}
                backgroundColor={this.props.backgroundColor}
                updateGradient={this.props.updateGradient}
                confirmDeleteGradient={this.confirmDeleteGradient.bind(this)}
                setAngleMeterIsActive={this.setAngleMeterIsActive.bind(this)}
                preventMouseUp={this.state.activeAngleMeter !== undefined}
                openColorPicker={this.props.openColorPicker}
                openRadialSettings={this.props.openRadialSettings}
                openBackgroundSettings={this.props.openBackgroundSettings}
                activeAngleMeter={this.state.activeAngleMeter}
                insertGradient={this.props.insertGradient}
                setReposition={this.setReposition.bind(this)}
                repositionOn={this.state.repositionArr.indexOf(i) !== -1}
            />
        ));
    }



    setReposition(index) {
        const newState = { ...this.state };
        const newRepositionArr = [...newState.repositionArr];
        const indexOfField = newRepositionArr.indexOf(index);
        if (indexOfField === -1) newRepositionArr.push(index);
        else newRepositionArr.splice(indexOfField, 1);

        newState.repositionArr = newRepositionArr;
        this.setState(newState, () => {
            if (this.state.repositionArr.length > 1) {
                this.props.swapGradientFields(...this.state.repositionArr);
                const newState = { ...this.state };
                newState.repositionArr = [];
                this.setState(newState)
            }
        });
    }



    confirmDeleteGradient(gradient, index) {
        this.setState({ ...this.state, deleteConfirmMsgVisible: true, gradientToDelete: { gradient, index } });
    }



    deleteConfirmResponse(deleteConformed) {
        if (deleteConformed) {
            const updatedGradientList = this.props.gradients.filter((grad, i) => i !== this.state.gradientToDelete.index);
            this.props.updateGradients(updatedGradientList);
        }

        this.setState({ ...this.state, deleteConfirmMsgVisible: false, gradientToDelete: undefined });
    }



    handleAddGradientOnClick() {
        const updatedGradientList = [...this.props.gradients, { ...getDefaultGradientObj() }];
        this.props.updateGradients(updatedGradientList);
    }



    handleOnMouseMove(event) {
        if (this.state.activeAngleMeter !== undefined) {
            const mouseStartX = this.state.activeAngleMeterStartX;
            const mouseStartY = this.state.activeAngleMeterStartY;
            const mouseCurrX = event.clientX || event.pageX || event.touches[0].clientX;
            const mouseCurrY = event.clientY || event.pageY || event.touches[0].clientY;

            const newAngle = calculateAngle(mouseStartX, mouseStartY, mouseCurrX, mouseCurrY);
            const updatedGradient = produce(this.props.gradients[this.state.activeAngleMeter], draft => {
                draft.angle = newAngle;
            });

            this.props.updateGradient(updatedGradient, this.state.activeAngleMeter);

            event.stopPropagation();
            event.preventDefault();
        }
    }



    handleOnMouseUp(event) {
        if (this.state.activeAngleMeter !== undefined) { this.stopAngleMeterMoving(); }
    }



    handleOnMouseLeave(event) {
        if (this.state.activeAngleMeter !== undefined) { this.stopAngleMeterMoving(); }
    }



    stopAngleMeterMoving() {
        this.setState({
            ...this.state,
            activeAngleMeter: undefined,
            activeAngleMeterStartX: undefined,
            activeAngleMeterStartY: undefined
        });
    }



    setAngleMeterIsActive(activeAngleMeter, activeAngleMeterStartX, activeAngleMeterStartY) {
        this.setState({
            ...this.state,
            activeAngleMeter,
            activeAngleMeterStartX,
            activeAngleMeterStartY
        });
    }



    render() {
        return (
            <div
                className="GradientList"
                onMouseMove={e => this.handleOnMouseMove(e)}
                onTouchMove={e => this.handleOnMouseMove(e)}
                onMouseUp={e => this.handleOnMouseUp(e)}
                onTouchEnd={e => this.handleOnMouseUp(e)}
                onMouseLeave={e => this.handleOnMouseLeave(e)}
            >
                <header>
                    <span>
                        Gradient List
                        <span> [
                            <span>
                                {this.props.gradients.length}
                            </span>
                                 ] </span>
                    </span>

                    <div>
                        <button
                            title="help and tutorial"
                            onClick={() => this.props.openHelpMenu()}
                            onMouseOver={() => this.setState({ ...this.state, helpIconHover: true, addIconHover: false })}
                            onMouseLeave={() => this.setState({ ...this.state, helpIconHover: false, addIconHover: false })}
                        >
                            <div
                                style={{ backgroundImage: `url(${this.state.helpIconHover ? helpActiveIcon : helpIcon})` }}
                            ></div>
                        </button>

                        <button
                            title="add new gradient"
                            onClick={() => this.handleAddGradientOnClick()}
                            onMouseOver={() => this.setState({ ...this.state, addIconHover: true, helpIconHover: false })}
                            onMouseLeave={() => this.setState({ ...this.state, addIconHover: false, helpIconHover: false })}
                        >
                            <div
                                style={{ backgroundImage: `url(${this.state.addIconHover ? addActiveIcon : addIcon})` }}
                            ></div>
                        </button>
                    </div>
                </header>

                <div className="gradients">
                    {this.renderGradients()}
                </div>

                {
                    this.state.deleteConfirmMsgVisible &&
                    <DeleteConfirmMsg
                        gradientToDelete={this.state.gradientToDelete}
                        deleteConfirmResponse={this.deleteConfirmResponse.bind(this)}
                    />
                }
            </div>
        )
    }
}