import React, { Component } from 'react';
import ColorPicker from "./Components/ColorPicker/ColorPicker";
import ResultDisplay from "./Components/ResultDisplay/ResultDisplay";
import GradientList from "./Components/GradientList/GradientList";
import Code from "./Components/Code/Code";
import RadialSettings from "./Components/RadialSettings/RadialSettings";
import BackgroundSettings from "./Components/BackgroundSettings/BackgroundSettings";
import { getDefaultGradientObj, gradientObjsToStr } from "./functions/gradient";
import checkeredRect from "./images/checkered_rect.png";
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
      radialSettingsOn: false,
      radialSettings_GradientIndex: undefined,
      backgroundSettingsOn: false,
      backgroundSettings_GradientIndex: undefined,
      backgroundSize: [
        { value: "100", unit: "%" },
        { value: "100", unit: "%" }
      ],
      fullscreen: false,
    };
  }



  getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }



  updateGradients(gradients) { this.setState({ ...this.state, gradients: gradients }, () => console.log(JSON.stringify(this.state.gradients))) }



  updateGradient(gradient, index) {
    if (index === undefined) throw new Error("Function updateGradient must have index parameter! ");

    const updatedGradientList = [...this.state.gradients];
    updatedGradientList[index] = gradient;

    this.updateGradients(updatedGradientList);
  }



  swapGradientFields(indexA, indexB) {
    const gradients = [...this.state.gradients];
    const tempField = gradients[indexA];
    gradients[indexA] = gradients[indexB];
    gradients[indexB] = tempField;

    this.updateGradients(gradients);
  }



  insertGradient(newGradient, insertIndex) {
    const updatedGradientList = [...this.state.gradients];
    updatedGradientList.splice(insertIndex, 0, newGradient);

    this.updateGradients([...updatedGradientList]);
  }



  openColorPicker(gradientIndex, thumbIndex, color) {
    this.setState(
      {
        ...this.state,
        colorPicker: { visible: true, gradientIndex, thumbIndex, color }
      });
  }



  openRadialSettings(radialSettingsOn, radialSettings_GradientIndex, setToRadial) {
    const gradients = [...this.state.gradients];
    const type = setToRadial ? "radial" : "linear";
    gradients[radialSettings_GradientIndex].type = type;

    this.setState(
      {
        ...this.state,
        gradients,
        radialSettingsOn,
        radialSettings_GradientIndex
      }
    );
  }



  openBackgroundSettings(backgroundSettingsOn, backgroundSettings_GradientIndex) {
    const gradients = [...this.state.gradients];

    this.setState(
      {
        ...this.state,
        gradients,
        backgroundSettingsOn,
        backgroundSettings_GradientIndex
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



  renderRadialSettings() {
    return (
      <RadialSettings
        openRadialSettings={this.openRadialSettings.bind(this)}
        index={this.state.radialSettings_GradientIndex}
        gradients={this.state.gradients}
        updateGradient={this.updateGradient.bind(this)}
      />
    );
  }



  renderBackgroundSettings() {
    return (
      <BackgroundSettings
        openBackgroundSettings={this.openBackgroundSettings.bind(this)}
        index={this.state.backgroundSettings_GradientIndex}
        gradients={this.state.gradients}
        updateGradient={this.updateGradient.bind(this)}
      />
    );
  }



  changeBackgroundSize(name, value, unit) {
    const index = name === "background-size-x" ? 0 : 1;
    const backgroundSize = [...this.state.backgroundSize];

    backgroundSize[index] = { value, unit };
    this.setState({ ...this.state, backgroundSize });
  }



  setFullscreen() { this.setState({ ...this.state, fullscreen: true }); }



  setCheckeredDisplay(checkered) { console.log(checkered); this.setState({ ...this.state, checkered }); }



  render() {
    return (
      <div className="App">
        <ResultDisplay
          backgroundSize={this.state.backgroundSize}
          gradients={this.state.gradients}
          setFullscreen={this.setFullscreen.bind(this)}
          checkered={this.state.checkered}
          setCheckered={this.setCheckeredDisplay.bind(this)}
        />

        <GradientList
          gradients={this.state.gradients}
          checkered={this.state.checkered}
          backgroundSize={this.state.backgroundSize}
          updateGradients={this.updateGradients.bind(this)}
          updateGradient={this.updateGradient.bind(this)}
          openColorPicker={this.openColorPicker.bind(this)}
          openRadialSettings={this.openRadialSettings.bind(this)}
          openBackgroundSettings={this.openBackgroundSettings.bind(this)}
          insertGradient={this.insertGradient.bind(this)}
          swapGradientFields={this.swapGradientFields.bind(this)}
        />

        <Code
          gradients={this.state.gradients}
          backgroundSize={this.state.backgroundSize}
          changeBackgroundSize={this.changeBackgroundSize.bind(this)}
        />


        {this.state.colorPicker && <ColorPicker
          id="color1" /* ID is important if we want to store prev states of comp */
          visible={this.state.colorPicker}
          color={this.state.colorPicker.color}
          gradientIndex={this.state.colorPicker.gradientIndex}
          thumbIndex={this.state.colorPicker.thumbIndex}
          returnColor={this.returnColor.bind(this)}
          close={() => { this.setState({ ...this.state, colorPicker: undefined }); }}
        />}

        {this.state.radialSettingsOn && (
          this.state.appWidth <= 500
            ? this.renderRadialSettings()
            : <div
              className="fullscreen-box"
              onClick={() => this.openRadialSettings(false, this.state.radialSettings_GradientIndex, false)}
            >
              {this.renderRadialSettings()}
            </div>
        )}

        {this.state.backgroundSettingsOn && (
          this.state.appWidth <= 500
            ? this.renderBackgroundSettings()
            : <div
              className="fullscreen-box"
              onClick={() => this.openBackgroundSettings(false, this.state.backgroundSettings_GradientIndex, false)}
            >
              {this.renderBackgroundSettings()}
            </div>
        )}

        {this.state.fullscreen && (
          <div
            id="fullscreen"
            style={{
              backgroundColor: "white",
              backgroundImage: this.state.checkered ? `url(${checkeredRect})` : ""
            }}
          >
            <div
              style={{
                backgroundImage: gradientObjsToStr([...this.state.gradients].reverse()),
                backgroundSize: this.state.backgroundSize[0].value + this.state.backgroundSize[0].unit + " " + this.state.backgroundSize[1].value + this.state.backgroundSize[1].unit,
              }}
            >
              <button onClick={() => this.setState({ ...this.state, fullscreen: false })}>&times;</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}