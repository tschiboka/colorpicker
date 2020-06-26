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
      colorPicker1IsVisible: false,
      checkered: true,
      gradients: [{ ...getDefaultGradientObj() }],
      canResize: true
    };
  }



  updateGradients(gradients) { this.setState({ ...this.state, gradients: gradients }) }



  render() {
    return (
      <div className="App">
        <ResultDisplay gradients={this.state.gradients} />

        <GradientList
          gradients={this.state.gradients}
          updateGradients={this.updateGradients.bind(this)}
        />

        <Code />

        <ColorPicker
          id="color1" /* ID is important if we want to store prev states of comp */
          visible={this.state.colorPicker1IsVisible}
          X={100}
          Y={100}
          close={() => this.setState({ ...this.state, colorPicker1IsVisible: false })}
        />

        {/*<button onClick={() => this.setState({ ...this.state, colorPicker1IsVisible: true })}>ColorPicker</button>*/}
      </div>
    );
  }
}