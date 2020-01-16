import React, { Component } from 'react';
import "./App.scss";
import ColorPicker from "./Components/ColorPicker";



export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = { colorPickerIsVisible: false };
  }



  render() {
    return (
      <div
        className="App"
        onClick={e => this.setState({
          ...this.state,
          colorPickerIsVisible: !this.state.colorPickerIsVisible
        })}>
        <ColorPicker visible={this.state.colorPickerIsVisible} />
      </div>
    );
  }
}