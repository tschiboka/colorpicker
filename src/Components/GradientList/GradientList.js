import React, { Component } from 'react';
import GradientField from "../GradientField/GradientField";
import "./GradientList.scss";



export default class GradientList extends Component {
    renderGradients() {
        return this.props.gradients.map((gradient, i) => (
            <GradientField
                key={`gradient_${i}`}
                gradient={gradient}
                index={i}
                updateGradient={this.updateGradient.bind(this)}
            />
        ));
    }


    updateGradient(gradient, i) {
        const updatedGradientList = [...this.props.gradients];
        updatedGradientList[i] = gradient;
        this.props.updateGradients(updatedGradientList);
    }



    render() {
        return (
            <div className="GradientList">
                <header>Gradients</header>

                <div className="gradients">
                    {this.renderGradients()}
                </div>
            </div>
        )
    }
}