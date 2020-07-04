import React, { Component } from 'react';
import ColorPicker from "./Components/ColorPicker/ColorPicker";
import ResultDisplay from "./Components/ResultDisplay/ResultDisplay";
import GradientList from "./Components/GradientList/GradientList";
import Code from "./Components/Code/Code";
import RadiantSettings from "./Components/RadiantSettings/RadiantSettings";
import { getDefaultGradientObj } from "./functions/gradient";
import "./App.scss";



export default class App extends Component {
  constructor(props) {
    super(props);

    // Do not let resize update to often otherwise it gets sluggish
    const resizeWithFrequency = freq => {
      if (this.state.canResize) {
        this.forceUpdate();
        this.setState({ ...this.state, canResize: false });
      }
      else {
        const resizeTimer = setTimeout(() => {
          this.setState({ ...this.state, canResize: true, appWidth: this.getWindowWidth() });
          clearInterval(resizeTimer);
        }, freq);
      }
    }

    window.addEventListener("resize", () => { resizeWithFrequency(100) });



    this.state = {
      checkered: true,
      gradients: [{ ...getDefaultGradientObj() }],
      canResize: true,
      appWidth: this.getWindowWidth(),
      colorPicker: undefined,
      radiantSettingsOn: false,
      radientSettingsGradientIndex: undefined,
    };
  }



  updateGradients(gradients) { this.setState({ ...this.state, gradients: gradients }/*, () => console.log(this.state.gradients)*/) }



  updateGradient(gradient, index) {
    if (index === undefined) throw new Error("Function updateGradient must have index parameter! ");

    const updatedGradientList = [...this.state.gradients];
    updatedGradientList[index] = gradient;

    this.updateGradients(updatedGradientList);
  }



  getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }



  openColorPicker(gradientIndex, thumbIndex, color) {
    this.setState(
      {
        ...this.state,
        colorPicker: { visible: true, gradientIndex, thumbIndex, color }
      });
  }



  openRadiantSettings(radiantSettingsOn, radientSettingsGradientIndex) {
    this.setState(
      {
        ...this.state,
        radiantSettingsOn,
        radientSettingsGradientIndex
      }
    );
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



  renderRadientSettings() {
    return (
      <RadiantSettings
        openRadiantSettings={this.openRadiantSettings.bind(this)}
        index={this.state.radientSettingsGradientIndex}
        gradients={this.state.gradients}
        updateGradient={this.updateGradient.bind(this)}
      />
    );
  }



  render() {
    return (
      <div className="App">
        <ResultDisplay gradients={this.state.gradients} />

        <GradientList
          gradients={this.state.gradients}
          updateGradients={this.updateGradients.bind(this)}
          updateGradient={this.updateGradient.bind(this)}
          openColorPicker={this.openColorPicker.bind(this)}
          openRadiantSettings={this.openRadiantSettings.bind(this)}
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

        {this.state.radiantSettingsOn && (
          this.state.appWidth <= 500
            ? this.renderRadientSettings()
            : <div
              className="fullscreen-box"
              onClick={() => this.setState({ ...this.state, radiantSettingsOn: false })}
            >
              {this.renderRadientSettings()}
            </div>
        )}
      </div>
    );
  }
}