import React, { Component } from 'react';
import "./App.scss";
import ColorPicker from "./Components/ColorPicker/ColorPicker";
import ResultDisplay from "./Components/ResultDisplay/ResultDisplay";



export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colorPicker1IsVisible: false,
      checkered: true,
    };
  }



  render() {
    const defaultGradient = [
      {
        direction: "-190",
        colors: [
          { color: "rgba(255, 0, 0, 1)", stop: 0 },
          { color: "rgba(255, 255, 0, 1)", stop: 12 },
          { color: "rgba(0, 0, 255, 0)", stop: 100 }
        ]
      },
      {
        direction: "3",
        colors: [
          { color: "rgba(25, 70, 40, 1)", stop: 0 },
          { color: "rgba(0, 0, 0, 0.2)", stop: 50 },
          { color: "rgba(0, 30, 25, 0)", stop: 100 }
        ]
      }
    ];

    return (
      <div
        className="App"
      >
        <ResultDisplay
          gradients={this.state.gradient || defaultGradient}
          checkered={this.state.checkered} />

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