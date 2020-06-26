import React, { Component } from 'react';
import GradientField from "../GradientField/GradientField";
import DeleteConfirmMsg from "../DeleteConfirmMsg/DeleteConfirmMsg";
import { defaultGradientObj } from "../../functions/gradient";
import "./GradientList.scss";



export default class GradientList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            deleteConfirmMsgVisible: false,
            gradientToDelete: undefined
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
        const updatedGradientList = [defaultGradientObj, ...this.props.gradients];
        this.props.updateGradients(updatedGradientList);
    }



    render() {
        return (
            <div className="GradientList">
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