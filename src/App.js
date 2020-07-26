import React, { Component } from 'react';
import ColorPicker from "./Components/ColorPicker/ColorPicker";
import ResultDisplay from "./Components/ResultDisplay/ResultDisplay";
import GradientList from "./Components/GradientList/GradientList";
import Code from "./Components/Code/Code";
import RadialSettings from "./Components/RadialSettings/RadialSettings";
import BackgroundSettings from "./Components/BackgroundSettings/BackgroundSettings";
import { getDefaultGradientObj, gradientObjsToStr } from "./functions/gradient";
import checkeredRect from "./images/checkered_rect.png";
import { produce } from "immer";
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
      patternName: undefined,
      backgroundSettingsOn: false,
      backgroundSettings_GradientIndex: undefined,
      backgroundSize: [
        { value: "100", unit: "%" },
        { value: "100", unit: "%" }
      ],
      backgroundColor: undefined,
      fullscreen: false,
    };
  }



  componentDidUpdate() {
    if (this.state.fullscreen) {
      // NOTE: Style needs to be set here!
      // React can not handle overlapping style properties like background shorthand / background color.
      // Its behaviour is unpredictable and unsupported. This part of the app needs to behave as closely
      // to native css as possible therefore style-sheet will be set on every update in vanilla JS style
      const display = document.getElementById("Fullscreen_Display");

      display.style.backgroundSize = this.state.backgroundSize[0].value + this.state.backgroundSize[0].unit + " " +
        this.state.backgroundSize[1].value + this.state.backgroundSize[1].unit;
      display.style.background = gradientObjsToStr([...this.state.gradients].reverse());
      display.style.backgroundColor = this.state.backgroundColor || "";
    }
  }



  getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  }



  updateGradients(gradients, callback) {
    const newState = produce(this.state, draft => {
      draft.gradients = gradients
    });

    this.setState(() => { return newState },
      () => typeof callback === "function" && callback()
    );
  }



  updateGradient(gradient, index, callback) {
    if (index === undefined) throw new Error("Function updateGradient must have index parameter! ");

    const updatedGradientList = produce(this.state.gradients, draft => {
      draft[index] = gradient;
    });

    this.updateGradients(updatedGradientList, callback);
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
    const newGradients = [...this.state.gradients];
    const type = setToRadial ? "radial" : "linear";

    const gradients = produce(newGradients, draft => {
      draft[radialSettings_GradientIndex].type = type;
    });

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
    // if color selection happened from a color stop / hint thumb
    if (gradientIndex !== undefined && thumbIndex !== undefined) { // index 0 would coerse false
      const newState = produce(this.state, draft => {
        draft.gradients[gradientIndex].colors[thumbIndex].color = color;
      });
      this.setState(newState, () => closeFunction(this.state));
    }
    // else it must change background color
    else {
      const newState = produce(this.state, draft => {
        draft.backgroundColor = color;
      });

      this.setState(newState, () => closeFunction(this.state));
    }
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
          backgroundColor={this.state.backgroundColor}
          gradients={this.state.gradients}
          setFullscreen={this.setFullscreen.bind(this)}
          checkered={this.state.checkered}
        />

        <GradientList
          gradients={this.state.gradients}
          checkered={this.state.checkered}
          backgroundSize={this.state.backgroundSize}
          backgroundColor={this.state.backgroundColor}
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
          backgroundColor={this.state.backgroundColor}
          openColorPicker={this.openColorPicker.bind(this)}
          changeBackgroundSize={this.changeBackgroundSize.bind(this)}
          checkered={this.state.checkered}
          setCheckered={this.setCheckeredDisplay.bind(this)}
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
            <div id="Fullscreen_Display" >
              <button onClick={() => this.setState({ ...this.state, fullscreen: false })}>&times;</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}