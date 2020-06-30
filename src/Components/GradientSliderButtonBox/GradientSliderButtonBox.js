import React, { Component } from 'react';



export default class GradientSliderButtonBox extends Component {
    render() {
        return (
            <div className="GradientSliderButtonBox">
                <div>
                    <button
                        title="add color hint [click on the slider]"
                    //onClick={() => this.setState({ ...this.state, colorHintButtonOn: true, colorStopButtonOn: false, delButtonOn: false })}
                    >
                        &#9675;

                            <div className={`btn--${this.state.colorHintButtonOn ? "active" : "inactive"}`}></div>
                    </button>

                    <button
                        title="add color stop [click on the slider]"
                    //onClick={() => this.setState({ ...this.state, colorHintButtonOn: false, colorStopButtonOn: true, delButtonOn: false })}
                    >
                        &#11216;

                            <div className={`btn--${this.state.colorStopButtonOn ? "active" : "inactive"}`}></div>
                    </button>
                </div>

                <div>
                    <button
                        title="delete color stop [click on slider thumb]"
                    //onClick={() => this.handleDelBtnOnClick()}
                    >
                        Del
                        <div className={`btn--${this.state.delButtonOn ? "active" : "inactive"}`}></div>
                    </button>
                </div>
            </div>

        );
    }
}