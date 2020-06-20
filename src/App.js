import React, { Component } from 'react';
import "./App.scss";
import ColorPicker from "./Components/ColorPicker/ColorPicker";
import ResultDisplay from "./Components/ResultDisplay/ResultDisplay";



export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colorPicker1IsVisible: false,
    };
  }



  render() {
    const defaultGradient = {
      direction: 90,
      colors: [
        { color: "rgba(255, 0, 0, 1)", stop: 0 },
        { color: "rgba(0, 0, 255, 1)", stop: 100 }
      ]
    }

    return (
      <div
        className="App"
      >
        <ResultDisplay gradient={this.state.gradient || defaultGradient} />

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