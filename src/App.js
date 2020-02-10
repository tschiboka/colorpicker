import React, { Component } from 'react';
import "./App.scss";
import ColorPicker from "./Components/ColorPicker/ColorPicker";



export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = { colorPickerIsVisible: false };
  }



  render() {
    return (
      <div
        className="App"
      >
        <ColorPicker id="color1" visible={this.state.colorPickerIsVisible} X={100} Y={100} close={() => this.setState({ ...this.state, colorPickerIsVisible: false })} />

        <button onClick={() => this.setState({ ...this.state, colorPickerIsVisible: true })}>ColorPicker</button>
      </div>
    );
  }
}