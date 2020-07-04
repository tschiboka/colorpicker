import React, { Component } from 'react';
import GradientField from "../GradientField/GradientField";
import DeleteConfirmMsg from "../DeleteConfirmMsg/DeleteConfirmMsg";
import { getDefaultGradientObj } from "../../functions/gradient";
import { calculateAngle } from "../../functions/slider";
import "./GradientList.scss";



export default class GradientList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteConfirmMsgVisible: false,
            gradientToDelete: undefined,
            activeAngleMeter: undefined,
            activeAngleMeterStartX: undefined,
            activeAngleMeterStartY: undefined
        }
    }



    renderGradients() {
        return this.props.gradients.map((gradient, i) => (
            <GradientField
                key={`gradient_${i}`}
                gradient={gradient}
                index={i}
                updateGradient={this.updateGradient.bind(this)}
                confirmDeleteGradient={this.confirmDeleteGradient.bind(this)}
                setAngleMeterIsActive={this.setAngleMeterIsActive.bind(this)}
                preventMouseUp={this.state.activeAngleMeter !== undefined}
                openColorPicker={this.props.openColorPicker}
                openRadiantSettings={this.props.openRadiantSettings}
            />
        ));
    }


    updateGradient(gradient, index) {
        if (index === undefined) throw new Error("Function updateGradient must have index parameter! ");

        const updatedGradientList = [...this.props.gradients];
        updatedGradientList[index] = gradient;

        this.props.updateGradients(updatedGradientList);
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
            const updatedGradient = this.props.gradients[this.state.activeAngleMeter];

            updatedGradient.angle = newAngle;

            this.updateGradient(updatedGradient, this.state.activeAngleMeter);
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
                onMouseUp={e => this.handleOnMouseUp(e)}
                onMouseLeave={e => this.handleOnMouseLeave(e)}
            >
                <header>
                    <span>Gradient List</span>

                    <button
                        title="add new gradient"
                        onClick={() => this.handleAddGradientOnClick()}
                    >&#43;</button>
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