import React, { Component } from 'react';
import ColorPicker from "./Components/ColorPicker/ColorPicker";
import ResultDisplay from "./Components/ResultDisplay/ResultDisplay";
import GradientList from "./Components/GradientList/GradientList";
import Code from "./Components/Code/Code";
import "./App.scss";



export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colorPicker1IsVisible: false,
      checkered: true,
      gradients: [
        {
          name: "",
          visible: true,
          direction: "90",
          colors: [
            { color: "rgba(0, 0, 0, 1)", stop: 0 },
            { color: "rgba(255, 255, 255, 0.5)", stop: 100 }
          ]
        },
      ]
    };
  }



  updateGradients(gradients) { this.setState({ ...this.state, gradients: gradients }, () => console.log(this.state.gradients)); }



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