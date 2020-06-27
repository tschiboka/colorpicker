import React, { Component } from 'react';
import ColorPicker from "./Components/ColorPicker/ColorPicker";
import ResultDisplay from "./Components/ResultDisplay/ResultDisplay";
import GradientList from "./Components/GradientList/GradientList";
import Code from "./Components/Code/Code";
import { getDefaultGradientObj } from "./functions/gradient";
import "./App.scss";



export default class App extends Component {
  constructor(props) {
    super(props);

    const resizeWithFrequency = freq => {
      if (this.state.canResize) {
        this.forceUpdate();
        this.setState({ ...this.state, canResize: false });
      }
      else {
        const resizeTimer = setTimeout(() => {
          this.setState({ ...this.state, canResize: true });
          clearInterval(resizeTimer);
        }, freq);
      }
    }

    window.addEventListener("resize", () => { resizeWithFrequency(100) });



    this.state = {
      colorPicker: undefined,
      checkered: true,
      gradients: [{ ...getDefaultGradientObj() }],
      canResize: true,
    };
  }



  updateGradients(gradients) { this.setState({ ...this.state, gradients: gradients }) }



  openColorPicker(gradientIndex, thumbIndex, color) {
    this.setState(
      {
        ...this.state,
        colorPicker: { visible: true, gradientIndex, thumbIndex, color }
      });
  }



  returnColor(color, gradientIndex, thumbIndex, closeFunction) {
    const newState = {
      ...this.state,
      gradients: [
        ...this.state.gradients.map(grad => ({
          ...grad,
          colors: [...grad.colors].map(color => ({ ...color }))
        })),
      ]
    };

    newState.gradients[gradientIndex].colors[thumbIndex].color = color;

    this.setState(newState, () => closeFunction(this.state));
  }



  render() {
    return (
      <div className="App">
        <ResultDisplay gradients={this.state.gradients} />

        <GradientList
          gradients={this.state.gradients}
          updateGradients={this.updateGradients.bind(this)}
          openColorPicker={this.openColorPicker.bind(this)}
        />

        <Code />


        {this.state.colorPicker && <ColorPicker
          id="color1" /* ID is important if we want to store prev states of comp */
          visible={this.state.colorPicker}
          color={this.state.colorPicker.color}
          gradientIndex={this.state.colorPicker.gradientIndex}
          thumbIndex={this.state.colorPicker.thumbIndex}
          returnColor={this.returnColor.bind(this)}
          close={() => { this.setState({ ...this.state, colorPicker: undefined }); }}
        />}
      </div>
    );
  }
}